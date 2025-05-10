import { log } from "../utils/log.js";

const MAX_WORDS = 10000;

export function wordCountHandler(req, res) {
  const startTime = Date.now();
  try {
    log("Processing word count request");
    const text = req.body?.text || req.query?.text || "";

    if (!text || text.trim() === "") {
      log("Error: No text provided");
      return res.status(400).send({
        error: "No text provided",
      });
    }

    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount > MAX_WORDS) {
      log("Error: Text exceeds word limit");
      return res.status(400).send({
        error: `Text exceeds maximum word count of ${MAX_WORDS} words.`,
      });
    }

    log(`Word count calculated: ${wordCount}`);
    log(`Request completed in ${Date.now() - startTime}ms`);
    res.send({
      wordCount,
      text: text,
    });
  } catch (error) {
    log("Error counting words:", "error", error);
    res.status(500).send({
      error: "Failed to count words",
      message: error.message,
    });
  }
}
