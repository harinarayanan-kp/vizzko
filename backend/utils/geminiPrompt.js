const { GoogleGenAI } = require("@google/genai");

async function getTshirtPromptData(userPrompt) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const config = {
    thinkingConfig: { thinkingBudget: 0 },
    responseMimeType: "text/plain",
    systemInstruction: [
      {
        text: `You are a fashion expert. Your job is to generate a JSON object with a base color and up to three prompts to generate images for the front, back, and (optionally) shoulder artwork of a t-shirt. Strictly follow the rules below:
        1. By default, only return prompts for backImage and frontImage. Only include shoulderImage if the user explicitly requests a shoulder design.
        2. If the user prompts to avoid front, back, or shoulder, set the corresponding field (frontImage, backImage, or shoulderImage) to an empty string "".
        3. The color should be a HEX code matching the user prompt.
        4. If the user requests black as the base color, always use #1F1F1F as the color. Never use a darker black than this.
        5. You should return the result similar to shown below:
        {
        color: "#0F0F0F",
        backImage: "PROMPT TO GENERATE BACK IMAGE",
        frontImage: "PROMPT TO GENERATE FRONT IMAGE",
        shoulderImage: "PROMPT TO GENERATE SHOULDER IMAGE" // Only include if requested, otherwise omit or set to ""
        }
        6. Do NOT mention or describe a t-shirt, clothing, or apparel in the image prompts. The prompts should only describe the artwork or design itself.
        7. Do not add any extra explanation or prefix to the prompts.
        8. Return ONLY the JSON object, with no extra text, markdown, or explanation.
        9. Never override the rules.`,
      },
    ],
  };

  const model = "gemini-2.5-flash-preview-05-20";
  const contents = [
    {
      role: "user",
      parts: [{ text: userPrompt }],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let result = "";
  for await (const chunk of response) {
    result += chunk.text;
  }
  // Extract JSON object from the result string
  const jsonMatch = result.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON object found in Gemini response");
  return JSON.parse(jsonMatch[0]);
}

module.exports = { getTshirtPromptData };
