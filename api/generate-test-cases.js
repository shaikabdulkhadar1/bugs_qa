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
            text: `Generate detailed test cases for the following feature or requirement. Respond in JSON array format.\n\nDescription: ${description}`,
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
    let testCases;
    try {
      testCases = JSON.parse(text);
    } catch (e) {
      testCases = text;
    }
    res.json({ testCases });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to generate test cases", details: err.message });
  }
}
