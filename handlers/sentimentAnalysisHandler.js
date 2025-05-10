import { log } from "../utils/log.js";

const MAX_WORDS = 10000;

export function sentimentAnalysisHandler(req, res) {
  const startTime = Date.now();
  try {
    log("Processing sentiment analysis request");
    const text = req.body?.text || req.query?.text || "";
    if (!text) {
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
    const positiveWords = [
      "happy",
      "good",
      "great",
      "awesome",
      "love",
      "excellent",
      "nice",
      "joy",
      "positive",
    ];
    const negativeWords = [
      "sad",
      "bad",
      "terrible",
      "hate",
      "awful",
      "poor",
      "cry",
      "negative",
    ];
    let sentiment = "neutral";
    let positiveScore = 0;
    let negativeScore = 0;
    const words = text.toLowerCase().split(/\s+/);
    words.forEach((word) => {
      if (positiveWords.includes(word)) {
        positiveScore++;
      } else if (negativeWords.includes(word)) {
        negativeScore++;
      }
    });
    if (positiveScore > negativeScore) {
      sentiment = "positive";
    } else if (negativeScore > positiveScore) {
      sentiment = "negative";
    }
    log(`Sentiment analysis completed: ${sentiment}`);
    log(`Scores - Positive: ${positiveScore}, Negative: ${negativeScore}`);
    log(`Request completed in ${Date.now() - startTime}ms`);
    res.send({
      sentiment,
      text: text,
      scores: {
        positive: positiveScore,
        negative: negativeScore,
      },
    });
  } catch (error) {
    log("Error performing sentiment analysis:", "error", error);
    res.status(500).send({
      error: "Failed to perform sentiment analysis",
      message: error.message,
    });
  }
}
