import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { description } = req.body;
  if (!description)
    return res
      .status(400)
      .json({ error: "Missing 'description' in request body." });

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const geminiBody = {
    contents: [
      {
        parts: [
          {
            text: `Analyze the following bug report. Respond in a single JSON object with the following fields: type of bug/error, possible cause, steps to fix (array), suggestions (array).\n\nBug Description: ${description}`,
          },
        ],
      },
    ],
  };

  try {
    const geminiRes = await fetch(geminiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody),
    });
    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      return res
        .status(500)
        .json({ error: "Gemini API error", details: errorText });
    }
    const geminiData = await geminiRes.json();
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (e) {
      analysis = text;
    }
    res.json({ analysis });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to analyze bug", details: err.message });
  }
}
