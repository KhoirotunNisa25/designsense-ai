// app/api/analyze/route.ts

import { model } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawBase64 = typeof body.base64 === "string" ? body.base64 : "";
    const rawMimeType = typeof body.mimeType === "string" ? body.mimeType : "";
    const platform = typeof body.platform === "string" ? body.platform : "";
    const promptHint = typeof body.prompt === "string" ? body.prompt : "";

    if (!rawBase64) {
      return Response.json(
        { error: "Missing base64 image data." },
        { status: 400 }
      );
    }

    const base64 = rawBase64.includes(",")
      ? rawBase64.split(",").pop() ?? rawBase64
      : rawBase64;

    const mimeType = rawMimeType || "image/png";

    const prompt =
      "Analyze this UI/UX screenshot for a " +
      (platform || "web") +
      " product. Provide concise professional feedback. Return only valid JSON (no markdown) with keys: overallScore, hierarchy, accessibility, uxIssues, suggestions. Use arrays of short bullet strings for hierarchy, accessibility, uxIssues, suggestions. overallScore must be a number from 1 to 100. Optional user focus: " +
      (promptHint || "none");

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64,
                mimeType,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const text = result.response.text();

    try {
      const data = JSON.parse(text);
      return Response.json({ data });
    } catch (parseError) {
      console.error("Gemini JSON parse failed", {
        parseError,
        textPreview: text.slice(0, 500),
      });
      return Response.json(
        { error: "Gemini returned invalid JSON.", preview: text.slice(0, 500) },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Analyze route failed", error);
    return Response.json(
      { error: "Failed to analyze screenshot." },
      { status: 500 }
    );
  }
}