# 402 API

This project is a demonstration of a Node.js Express server that integrates the [X402 payment protocol](https://www.x402.org/) for monetizing API endpoints. It uses the `x402-express` middleware and `@coinbase/x402` facilitator.

## Features

- **Static File Serving**: Serves static files from the `public` directory (e.g., `index.html`).
- **JSON Parsing**: Handles JSON request bodies.
- **X402 Payment Middleware**: Protects specified API routes, requiring payment for access.
  - Wallet address for payments is configured via `process.env.WALLET_ADDRESS`.
- **Environment Variable Configuration**: Uses `dotenv` for managing environment variables (e.g., `OPENAI_API_KEY`).

## API Endpoints

The server exposes the following API endpoints:

### `GET /text-to-image`

- **Description**: Generates an image based on a text prompt using OpenAI's DALL-E 3 model.
- **Payment Required**: Yes (e.g., $0.25 on Base network).
- **Query Parameters**:
  - `prompt` (string): The text prompt for image generation (defaults to "a beautiful landscape").
- **Word Limit**: The prompt is limited to a maximum of 10,000 words.
- **Returns**: JSON object with `image` URL and `prompt`.

### `POST /word-count`

- **Description**: Counts the number of words in a given text.
- **Payment Required**: Yes (e.g., $0.01 on Base network).
- **Request Body**:
  - `text` (string): The text for which to count words.
- **Word Limit**: The input text is limited to a maximum of 10,000 words.
- **Returns**: JSON object with `wordCount` and original `text`.

### `POST /sentiment-analysis`

- **Description**: Performs basic sentiment analysis on the provided text, classifying it as positive, negative, or neutral.
- **Payment Required**: Yes (e.g., $0.50 on Base network).
- **Request Body**:
  - `text` (string): The text to analyze.
- **Word Limit**: The input text is limited to a maximum of 10,000 words.
- **Returns**: JSON object with `sentiment`, original `text`, and `scores` (positive and negative word counts).

### `GET /`

- **Description**: Serves the `index.html` page from the `public` directory.

## Setup and Running

1.  **Install Dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```
2.  **Environment Variables**:
    Create a `.env` file in the root of the project with the following variables:

    ```bash
    # Your wallet address that will receive payments
    WALLET_ADDRESS=your_wallet_address_here

    # OpenAI API key for DALL-E image generation
    OPENAI_API_KEY=your_openai_api_key_here

    # CDP API key ID
    CDP_API_KEY_ID=your_cdp_api_key_id_here

    # CDP API key secret
    CDP_API_KEY_SECRET=your_cdp_api_key_secret_here
    ```

`3.  **Start the Server**:
   `bash
node server.js
```    The server will start on`http://localhost:4021`.

## Dependencies

- `express`: Web framework for Node.js.
- `x402-express`: Express middleware for X402 payments.
- `@coinbase/x402`: Facilitator for X402 protocol.
- `dotenv`: Loads environment variables from a `.env` file.
- `openai`: OpenAI Node.js library for accessing the DALL-E API.

---

Learn more about the 402 payment protocol at [x402.org](https://www.x402.org/).
