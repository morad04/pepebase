// --- Configuration ---
const API_BASE_URL = "https://basepepe.vercel.app"; // Replace with your API base URL

// --- Data for API Endpoints ---
const apiEndpoints = [
  {
    id: "text-to-image",
    path: "/text-to-image",
    cost: "$0.25",
    description:
      "Generates an image based on a text prompt using OpenAI's DALL-E 3 model.",
    parameters: [
      {
        name: "prompt",
        description:
          'The text prompt for image generation. (e.g., "a beautiful landscape")',
        inputType: "text",
        placeholder: "e.g., a blue ball",
      },
    ],
    exampleReturn: `{
    "image": "https://oaidalleapiprodscus.blob.core.windows.net/...",
    "prompt": "a beautiful landscape"
}`,
  },
  {
    id: "word-count",
    path: "/word-count",
    cost: "$0.01",
    description: "Counts the number of words in a given text.",
    parameters: [
      {
        name: "text",
        description: "The text for which to count words.",
        inputType: "textarea",
        rows: 3,
        placeholder: "Enter text here...",
      },
    ],
    exampleReturn: `{
    "wordCount": 5,
    "text": "This is a sample text."
}`,
  },
  {
    id: "sentiment-analysis", // Corresponds to your original id="text-sa" vicinity
    path: "/sentiment-analysis",
    cost: "$0.05",
    description:
      "Performs basic sentiment analysis on the provided text, classifying it as positive, negative, or neutral.",
    parameters: [
      {
        name: "text",
        description: "The text to analyze.",
        inputType: "textarea",
        rows: 3,
        placeholder: "Enter text here...",
      },
    ],
    exampleReturn: `{
    "sentiment": "positive",
    "text": "This is a happy and wonderful day!",
    "scores": {
        "positive": 3,
        "negative": 0
    }
}`,
  },
];
