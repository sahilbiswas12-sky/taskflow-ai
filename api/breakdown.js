import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // Simple production health check
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      service: "TaskFlow AI Breakdown API",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
const apiKey = process.env.GEMINI_API_KEY
  ?.replace(/[\r\n\t]/g, "")
  .trim();

  if (!apiKey) {
  return res.status(500).json({
    error: "GEMINI_API_KEY is missing.",
  });
}

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing");

      return res.status(500).json({
        error: "Gemini API key is not configured.",
      });
    }

    let body = req.body;

    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const title = body?.title?.trim();
    const description =
      body?.description?.trim() || "";

    if (!title) {
      return res.status(400).json({
        error: "Task title is required.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const prompt = `
You are the AI assistant inside TaskFlow AI.

Break this task into 3 to 5 practical subtasks.

Task:
${title}

Description:
${description || "No description provided"}

Return ONLY valid JSON.

Use exactly this structure:

{
  "subtasks": [
    {
      "title": "Short action title",
      "description": "Short explanation",
      "priority": "HIGH",
      "estimatedMinutes": 30,
      "reason": "Why this step matters"
    }
  ]
}

Rules:
- priority must be HIGH, MEDIUM, or LOW
- estimatedMinutes must be a number
- create 3 to 5 useful subtasks
- no markdown
- no code fences
- no text outside the JSON
`;

    console.log(
      "TaskFlow AI: requesting Gemini"
    );

    const response =
      await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

    let text = response.text?.trim();

    if (!text) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    // Safety: Gemini may occasionally wrap JSON
    // inside markdown code fences.
    text = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    const parsed = JSON.parse(text);

    if (
      !Array.isArray(parsed.subtasks) ||
      parsed.subtasks.length === 0
    ) {
      throw new Error(
        "Gemini returned invalid subtasks."
      );
    }

    const subtasks = parsed.subtasks.map(
      (task) => ({
        title:
          String(task.title || "").trim(),

        description:
          String(
            task.description || ""
          ).trim(),

        priority: [
          "HIGH",
          "MEDIUM",
          "LOW",
        ].includes(task.priority)
          ? task.priority
          : "MEDIUM",

        estimatedMinutes:
          Number(
            task.estimatedMinutes
          ) || 30,

        reason:
          String(task.reason || "").trim(),
      })
    );

    console.log(
      `TaskFlow AI: generated ${subtasks.length} subtasks`
    );

    return res.status(200).json({
      subtasks,
    });
  } catch (error) {
    console.error(
      "TaskFlow Gemini production error:",
      error
    );

    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "AI planning failed.",
    });
  }
}