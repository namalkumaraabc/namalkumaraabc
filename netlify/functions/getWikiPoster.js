import { JSDOM } from "jsdom";

export async function handler(event, context) {
  const body = JSON.parse(event.body);
  const wikiLink = body.link; // Wikipedia URL from Gemini

  try {
    const res = await fetch(wikiLink);
    const html = await res.text();

    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Get the first <td class="infobox-image"> inside the infobox
    const infoboxImageTd = document.querySelector(
      "table.infobox.vevent td.infobox-image img"
    );

    const imageUrl = infoboxImageTd
      ? infoboxImageTd.src.startsWith("http")
        ? infoboxImageTd.src
        : "https:" + infoboxImageTd.src
      : "";

    return {
      statusCode: 200,
      body: JSON.stringify({ image: imageUrl }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
