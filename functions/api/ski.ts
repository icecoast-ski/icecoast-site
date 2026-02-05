export const onRequestGet = async () => {
  const url =
    "https://www.killington.com/page-data/the-mountain/conditions-weather/webcam/page-data.json";

  const res = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0" },
  });

  const data = await res.json();

  // show a tiny preview so we can see what fields exist
  return new Response(
    JSON.stringify(
      {
        ok: res.ok,
        status: res.status,
        path: data?.path,
        componentChunkName: data?.componentChunkName,
        // keys under result/pageContext are where Gatsby usually stores useful stuff
        resultKeys: data?.result ? Object.keys(data.result) : null,
        pageContextKeys: data?.result?.pageContext
          ? Object.keys(data.result.pageContext)
          : null,
        // small snippet
        snippet: JSON.stringify(data).slice(0, 1200),
      },
      null,
      2,
    ),
    { headers: { "content-type": "application/json" } },
  );
};
