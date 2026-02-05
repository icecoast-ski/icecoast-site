export const onRequestGet = async () => {
  const pageUrl =
    "https://www.killington.com/the-mountain/conditions-weather/lifts-trails-report/";

  const res = await fetch(pageUrl, {
    headers: { "user-agent": "Mozilla/5.0" },
  });

  const html = await res.text();

  // Pull out URLs from the HTML (scripts, json, APIs, etc.)
  const urlMatches = [...html.matchAll(/https?:\/\/[^\s"'<>]+/g)].map(
    (m) => m[0],
  );

  // Keep only likely “data” endpoints (not images/fonts)
  const interesting = urlMatches
    .filter(
      (u) =>
        /\.json(\?|$)/i.test(u) ||
        /graphql|api|dor|report|terrain|lift|trail|status/i.test(u),
    )
    .filter(
      (u) => !/\.(png|jpg|jpeg|gif|svg|webp|css|woff2?|ttf)(\?|$)/i.test(u),
    );

  // de-dupe + keep it short
  const uniq = Array.from(new Set(interesting)).slice(0, 80);

  return new Response(
    JSON.stringify(
      {
        ok: res.ok,
        status: res.status,
        pageUrl,
        htmlBytes: html.length,
        found: uniq.length,
        urls: uniq,
      },
      null,
      2,
    ),
    { headers: { "content-type": "application/json" } },
  );
};
