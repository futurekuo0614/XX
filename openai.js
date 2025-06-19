import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 在 Vercel Dashboard > Settings > Environment Variables 設定
});

export default async (req, res) => {
  // 允許 CORS (如僅在同源使用，可刪)
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { text = "", direction = "zh2ja" } = req.body || {};

    if (!text.trim()) {
      return res.status(400).json({ error: "Missing text" });
    }

    const prompt =
      direction === "zh2ja"
        ? "Translate the following Chinese text to Japanese. Only return the translated text."
        : "Translate the following Japanese text to Chinese (Traditional). Only return the translated text.";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: text },
      ],
    });

    res.status(200).json({ result: completion.choices[0].message.content.trim() });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "OpenAI error" });
  }
};