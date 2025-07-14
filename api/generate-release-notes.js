import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { input } = req.body;
  if (!input)
    return res.status(400).json({ error: "Missing 'input' in request body." });

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const geminiBody = {
    contents: [
      {
        parts: [
          {
            text: `You are a release manager. Generate professional, user-friendly release notes in markdown format from the following commit messages or changelog. Group related changes, highlight new features, bug fixes, improvements, and breaking changes. Use clear section headings.\n\nCommits/Changelog:\n${input}`,
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
    res.json({ releaseNotes: text });
  } catch (err) {
    res
      .status(500)
      .json({
        error: "Failed to generate release notes",
        details: err.message,
      });
  }
}
