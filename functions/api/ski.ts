export const onRequestGet = async () => {
  const url = "https://www.killington.com/the-mountain/mountain-report";

  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0",
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
