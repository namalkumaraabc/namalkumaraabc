export async function handler(event, context) {
  const apiKey = process.env.GEMINI_API_KEY;
  const body = JSON.parse(event.body);
  const query = body.query;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Give me 3 movies related to "${query}". Return only JSON as an array of objects with exactly these fields: 
                    "name" (movie title), 
                    "description" (short movie description), 
                    "link" (Wikipedia URL). 
                  Do not include anything else, no explanations or markdown.`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // Optional: clean up ```json or ``` if present
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed = [];
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse Gemini response:", err, text);
    }

    return { statusCode: 200, body: JSON.stringify(parsed) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
