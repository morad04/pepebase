import { log } from "../utils/log.js";

const MAX_WORDS = 10000;

export async function textToImageHandler(openai) {
  return async function (req, res) {
    const startTime = Date.now();
    try {
      log("Processing text-to-image request");
      log(`Request body: ${JSON.stringify(req.body)}`);
      log(`Request query: ${JSON.stringify(req.query)}`);
      const prompt =
        req.body?.prompt || req.query?.prompt || "a beautiful landscape";
      log(`Using prompt: ${prompt}`);
      const promptWordCount = prompt.trim().split(/\s+/).length;
      if (promptWordCount > MAX_WORDS) {
        log("Error: Prompt exceeds word limit");
        return res.status(400).send({
          error: `Prompt exceeds maximum word count of ${MAX_WORDS} words.`,
        });
      }
      log("Calling OpenAI API");
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        quality: "standard",
        size: "1024x1024",
      });
      const imageUrl = response.data[0].url;
      log("Image generated successfully");
      log(`Request completed in ${Date.now() - startTime}ms`);
      res.send({
        image: imageUrl,
        prompt: prompt,
      });
    } catch (error) {
      log("Error generating image:", "error", error);
      res.status(500).send({
        error: "Failed to generate image",
        message: error.message,
      });
    }
  };
}
