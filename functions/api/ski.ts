export const onRequestGet = async () => {
  const url =
    "https://www.killington.com/page-data/the-mountain/conditions-weather/lifts-trails-report/page-data.json";

  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  const text = await res.text();

  // Find the API endpoint reference inside this JSON blob
  const needles = [
    "externalEndpoint",
    "endpoint",
    "api",
    "dataUrl",
    "externalendpoint",
  ];
  const hits: any[] = [];
  const lower = text.toLowerCase();

  for (const n of needles) {
    const i = lower.indexOf(n.toLowerCase());
    hits.push({
      needle: n,
      found: i !== -1,
      index: i,
      around: i !== -1 ? text.slice(Math.max(0, i - 400), i + 600) : null,
    });
  }

  return new Response(
    JSON.stringify({ ok: res.ok, status: res.status, hits }, null, 2),
    {
      headers: { "content-type": "application/json" },
    },
  );
};
