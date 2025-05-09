import express from "express";
import { paymentMiddleware } from "x402-express";
import { facilitator } from "@coinbase/x402";
import dotenv from "dotenv";
import path from "path";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(process.cwd(), "public")));

app.use(express.json());

app.use(
  paymentMiddleware(
    process.env.WALLET_ADDRESS, // your receiving wallet address
    {
      // Route configurations for protected endpoints
      "POST /text-to-image": {
        price: "$0.25",
        network: "base",
      },
      "GET /text-to-image": {
        price: "$0.25",
        network: "base",
      },
      "POST /word-count": {
        price: "$0.01",
        network: "base",
      },
      "GET /word-count": {
        price: "$0.01",
        network: "base",
      },
      "POST /sentiment-analysis": {
        price: "$0.05",
        network: "base",
      },
      "GET /sentiment-analysis": {
        price: "$0.05",
        network: "base",
      },
    },
    facilitator
  )
);

const MAX_WORDS = 10000;

// Centralized logging function
function log(message, level = "info", errorObj = null) {
  const timestamp = new Date().toISOString();
  if (process.env.NODE_ENV !== "production") {
    if (level === "error") {
      if (errorObj) {
        console.error(`[${timestamp}] ERROR: ${message}`, errorObj);
      } else {
        console.error(`[${timestamp}] ERROR: ${message}`);
      }
    } else {
      console.log(`[${timestamp}] ${message}`);
    }
  } else {
    // In production, only log errors
    if (level === "error") {
      if (errorObj) {
        console.error(`[${timestamp}] ERROR: ${message}`, errorObj);
      } else {
        console.error(`[${timestamp}] ERROR: ${message}`);
      }
    }
  }
}

// Add request logging middleware (only in development)
app.use((req, res, next) => {
  const start = Date.now();
  log(`${req.method} ${req.url}`);
  log(`Request Headers: ${JSON.stringify(req.headers)}`);
  res.on("finish", () => {
    const duration = Date.now() - start;
    log(`${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Shared handler for text-to-image
async function textToImageHandler(req, res) {
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
}
app.post("/text-to-image", textToImageHandler);
app.get("/text-to-image", textToImageHandler);

// Shared handler for word-count
function wordCountHandler(req, res) {
  const startTime = Date.now();
  try {
    log("Processing word count request");
    const text = req.body.text || req.query.text;
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
app.post("/word-count", wordCountHandler);
app.get("/word-count", wordCountHandler);

// Shared handler for sentiment-analysis
function sentimentAnalysisHandler(req, res) {
  const startTime = Date.now();
  try {
    log("Processing sentiment analysis request");
    const text = req.body.text || req.query.text;
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
app.post("/sentiment-analysis", sentimentAnalysisHandler);
app.get("/sentiment-analysis", sentimentAnalysisHandler);

// Serve the home page
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Add this line at the end of the file
export default app;

// Add this block to run the server locally
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4021;
  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
}
