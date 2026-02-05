export const onRequestGet = async () => {
  const url = "https://map.killington.com/lift/service";

  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0",
      accept: "application/json,text/plain,*/*",
      referer: "https://map.killington.com/map/propmap/",
    },
  });

  const text = await res.text();

  // Try to parse JSON if possible
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {}

  const topKeys =
    json && typeof json === "object" && !Array.isArray(json)
      ? Object.keys(json)
      : null;
  const isArray = Array.isArray(json);

  // If it's an array of objects, sample keys of first item
  const firstItemKeys =
    isArray && json.length && typeof json[0] === "object"
      ? Object.keys(json[0])
      : null;

  return new Response(
    JSON.stringify(
      {
        ok: res.ok,
        status: res.status,
        contentType: res.headers.get("content-type"),
        bytes: text.length,
        parsedJson: !!json,
        jsonType: isArray ? "array" : typeof json,
        topKeys,
        firstItemKeys,
        preview: text.slice(0, 1200),
      },
      null,
      2,
    ),
    { headers: { "content-type": "application/json" } },
  );
};
