export const onRequestGet = async () => {
  const base = "https://www.killington.com";

  const pageDataUrl =
    base +
    "/page-data/the-mountain/conditions-weather/current-conditions-weather/page-data.json";

  const pageRes = await fetch(pageDataUrl, {
    headers: { "user-agent": "Mozilla/5.0" },
  });
  const pageData: any = await pageRes.json();

  const hashes: string[] = pageData?.staticQueryHashes || [];
  const hash = hashes[0];

  // Gatsby usually serves static queries here
  const sqUrls = [
    `${base}/page-data/sq/d/${hash}.json`,
    `${base}/_bluedrop/page-data/sq/d/${hash}.json`,
  ];

  const tries: any[] = [];
  for (const url of sqUrls) {
    const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
    const text = await r.text(); // keep as text so we can preview even if not JSON
    tries.push({
      url,
      status: r.status,
      preview: text.slice(0, 600),
    });
    if (r.ok) break;
  }

  return new Response(
    JSON.stringify(
      {
        pageDataOk: pageRes.ok,
        pageDataStatus: pageRes.status,
        staticQueryHashes: hashes,
        staticQueryTries: tries,
      },
      null,
      2,
    ),
    { headers: { "content-type": "application/json" } },
  );
};
