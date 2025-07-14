import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { method = "GET", url, headers = {}, body } = req.body;
  if (!url)
    return res.status(400).json({ error: "Missing 'url' in request body." });

  try {
    const fetchOptions = { method, headers };
    if (body && method !== "GET") {
      fetchOptions.body =
        typeof body === "string" ? body : JSON.stringify(body);
    }
    const start = Date.now();
    const response = await fetch(url, fetchOptions);
    const responseTime = Date.now() - start;
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    let responseBody;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      responseBody = await response.text();
    } else {
      responseBody = await response.text();
    }
    res.json({
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
      responseTime,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to test API", details: err.message });
  }
}
