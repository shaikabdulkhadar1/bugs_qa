import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// Gemini API key from .env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.warn("[WARNING] GEMINI_API_KEY is not set in .env file.");
}

app.post("/api/generate-test-cases", async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res
      .status(400)
      .json({ error: "Missing 'description' in request body." });
  }

  try {
    // Gemini 2.5 Flash API endpoint (update if needed)
    const geminiEndpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      GEMINI_API_KEY;

    // Prepare the request body for Gemini
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
    // Extract the response text
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
    let testCases;
    try {
      testCases = JSON.parse(text);
    } catch (e) {
      // If not valid JSON, return as plain text
      testCases = text;
    }

    res.json({ testCases });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to generate test cases", details: err.message });
  }
});

app.post("/api/analyze-bug", async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res
      .status(400)
      .json({ error: "Missing 'description' in request body." });
  }

  try {
    const geminiEndpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      GEMINI_API_KEY;

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
});

app.post("/api/test-api", async (req, res) => {
  const { method = "GET", url, headers = {}, body } = req.body;
  if (!url) {
    return res.status(400).json({ error: "Missing 'url' in request body." });
  }

  try {
    const fetchOptions = {
      method,
      headers,
    };
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
      responseBody = await response.text(); // keep as string for display
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
});

app.post("/api/generate-bug-report", async (req, res) => {
  const { description, severity } = req.body;
  if (!description || !severity) {
    return res
      .status(400)
      .json({ error: "Missing 'description' or 'severity' in request body." });
  }

  try {
    const geminiEndpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      GEMINI_API_KEY;

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
});

app.post("/api/generate-release-notes", async (req, res) => {
  const { input } = req.body;
  if (!input) {
    return res.status(400).json({ error: "Missing 'input' in request body." });
  }

  try {
    const geminiEndpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      GEMINI_API_KEY;

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
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
