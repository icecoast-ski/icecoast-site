export const onRequestGet = async () => {
  const url =
    "https://www.killington.com/the-mountain/conditions-weather/current-conditions-weather/?gclsrc=aw.ds&&utm_source=google&utm_medium=cpc&utm_content=brand&gad_source=1&gad_campaignid=18419792863";

  const res = await fetch(url, {
    headers: {
      // pretend like a real browser so resorts don’t block us
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
  });

  return new Response(
    JSON.stringify({
      ok: res.ok,
      status: res.status,
      final_url: res.url,
    }),
    { headers: { "content-type": "application/json" } },
  );
};
