export const onRequestGet = async () => {
  const url =
    "https://www.killington.com/page-data/the-mountain/conditions-weather/lifts-trails-report/page-data.json";

  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  const text = await res.text();

  return new Response(
    JSON.stringify(
      {
        ok: res.ok,
        status: res.status,
        bytes: text.length,
        preview: text.slice(0, 1200),
      },
      null,
      2,
    ),
    { headers: { "content-type": "application/json" } },
  );
};
