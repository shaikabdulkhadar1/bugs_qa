import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { description, severity } = req.body;
  if (!description || !severity)
    return res
      .status(400)
      .json({ error: "Missing 'description' or 'severity' in request body." });

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const geminiBody = {
    contents: [
      {
        parts: [
          {
            text: `You are an expert QA engineer. Write a detailed, professional bug report in markdown format based on the following information. Include sections: Title, Severity, Description, Steps to Fix, Expected Behavior, Actual Behavior, and Suggestions. Use the provided severity.\n\nBug Description: ${description}\nSeverity: ${severity}`,
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
    res.json({ bugReport: text });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to generate bug report", details: err.message });
  }
}
