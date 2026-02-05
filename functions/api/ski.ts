export const onRequestGet = async () => {
  const url =
    "https://www.killington.com/page-data/the-mountain/conditions-weather/lifts-trails-report/page-data.json";

  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  const text = await res.text();

  const needles = [
    "lift",
    "lifts",
    "trail",
    "trails",
    "open",
    "closed",
    "status",
    "liftStatus",
    "trailStatus",
    "dor",
    "report",
  ];

  const hits: any[] = [];
  const lower = text.toLowerCase();

  for (const n of needles) {
    const i = lower.indexOf(n.toLowerCase());
    hits.push({
      needle: n,
      found: i !== -1,
      index: i,
      around: i !== -1 ? text.slice(Math.max(0, i - 350), i + 350) : null,
    });
  }

  return new Response(
    JSON.stringify(
      { ok: res.ok, status: res.status, bytes: text.length, hits },
      null,
      2,
    ),
    { headers: { "content-type": "application/json" } },
  );
};
