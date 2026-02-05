export const onRequestGet = async () => {
  const url = "https://www.killington.com/page-data/sq/d/187408592.json";
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  const text = await res.text();

  // find where open_lifts/open_trails appear (if they do)
  const needles = ["open_lifts", "open_trails", "lifts", "trails", "terrain"];
  const hits: any[] = [];

  for (const n of needles) {
    const i = text.toLowerCase().indexOf(n);
    hits.push({
      needle: n,
      found: i !== -1,
      index: i,
      around: i !== -1 ? text.slice(Math.max(0, i - 250), i + 250) : null,
    });
  }

  return new Response(
    JSON.stringify(
      {
        ok: res.ok,
        status: res.status,
        bytes: text.length,
        hits,
      },
      null,
      2,
    ),
    { headers: { "content-type": "application/json" } },
  );
};
