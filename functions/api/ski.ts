export const onRequestGet = async () => {
  const base = "https://map.killington.com";
  const pageUrl = `${base}/map/propmap/`;

  // 1) Fetch the map page HTML
  const pageRes = await fetch(pageUrl, {
    headers: { "user-agent": "Mozilla/5.0" },
  });
  const html = await pageRes.text();

  // 2) Grab JS bundle URLs (they're relative)
  const scriptSrcs = [
    ...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi),
  ].map((m) => m[1]);
  const scripts = Array.from(new Set(scriptSrcs))
    .map((u) => new URL(u, base).toString())
    .filter((u) => u.endsWith(".js"))
    .slice(0, 8);

  // 3) Scan JS for likely data endpoints (json/api/graphql)
  const endpointCandidates: string[] = [];
  for (const js of scripts) {
    const r = await fetch(js, { headers: { "user-agent": "Mozilla/5.0" } });
    const t = await r.text();

    // absolute URLs
    for (const m of t.matchAll(/https?:\/\/[^\s"'<>]+/g))
      endpointCandidates.push(m[0]);
    // relative URLs
    for (const m of t.matchAll(/\/[a-z0-9_\-\/\.]+/gi))
      endpointCandidates.push(m[0]);
  }

  const interesting = Array.from(new Set(endpointCandidates))
    .map((u) => {
      try {
        return new URL(u, base).toString();
      } catch {
        return null;
      }
    })
    .filter(Boolean) as string[];

  const filtered = interesting
    .filter(
      (u) =>
        /\.json(\?|$)/i.test(u) ||
        /api|graphql|lift|trail|status|report|conditions/i.test(u),
    )
    .filter(
      (u) => !/\.(png|jpg|jpeg|gif|svg|webp|css|woff2?|ttf)(\?|$)/i.test(u),
    )
    .slice(0, 60);

  // 4) Probe candidates until we find JSON that looks like lift/trail data
  let chosen: any = null;

  for (const u of filtered) {
    try {
      const r = await fetch(u, { headers: { "user-agent": "Mozilla/5.0" } });
      if (!r.ok) continue;

      const ct = r.headers.get("content-type") || "";
      const text = await r.text();
      if (
        !ct.includes("json") &&
        !text.trim().startsWith("{") &&
        !text.trim().startsWith("[")
      )
        continue;

      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        continue;
      }

      const blob = JSON.stringify(data).toLowerCase();
      if (
        blob.includes("lift") &&
        blob.includes("trail") &&
        (blob.includes("status") || blob.includes("open"))
      ) {
        chosen = { url: u, sampleKeys: Object.keys(data).slice(0, 30), data };
        break;
      }
    } catch {}
  }

  if (!chosen) {
    return new Response(
      JSON.stringify(
        {
          ok: true,
          step: "discovery_failed",
          pageUrl,
          scriptsScanned: scripts.length,
          candidateCount: filtered.length,
          candidates: filtered,
        },
        null,
        2,
      ),
      { headers: { "content-type": "application/json" } },
    );
  }

  // 5) Try to count open/total in a generic way (works for many map JSON schemas)
  const data = chosen.data;
  const blob = JSON.stringify(data);

  // heuristics: find arrays named lifts/trails or scan all arrays of objects with "status"
  const findArray = (obj: any, key: string): any[] | null => {
    if (!obj || typeof obj !== "object") return null;
    if (Array.isArray((obj as any)[key])) return (obj as any)[key];
    for (const k of Object.keys(obj)) {
      const v = (obj as any)[k];
      const found = findArray(v, key);
      if (found) return found;
    }
    return null;
  };

  const lifts = findArray(data, "lifts") || findArray(data, "Lifts");
  const trails = findArray(data, "trails") || findArray(data, "Trails");

  const countOpen = (arr: any[] | null) => {
    if (!arr) return null;
    const total = arr.length;
    const open = arr.filter((x) => {
      const s = (x?.status ?? x?.Status ?? x?.state ?? x?.State ?? "")
        .toString()
        .toLowerCase();
      return ["open", "operating", "expected"].some((w) => s.includes(w));
    }).length;
    return { open, total };
  };

  const liftCounts = countOpen(lifts);
  const trailCounts = countOpen(trails);

  return new Response(
    JSON.stringify(
      {
        ok: true,
        discoveredUrl: chosen.url,
        liftCounts,
        trailCounts,
        note: "If liftCounts/trailCounts are null, we found the endpoint but need to adjust the schema mapping.",
      },
      null,
      2,
    ),
    { headers: { "content-type": "application/json" } },
  );
};
