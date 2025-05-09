import { privateKeyToAccount } from "viem/accounts";
import { wrapFetchWithPayment, decodeXPaymentResponse } from "x402-fetch";
import dotenv from "dotenv";

dotenv.config();

// Set your private key in .env file
const account = privateKeyToAccount(process.env.PRIVATE_KEY);
// Set max payment amount to 1 USDC in base units
const fetchWithPayment = wrapFetchWithPayment(
  fetch,
  account
  //   BigInt(0.1 * 10 ** 7)
);

// Example API call
const url = "https://402api.com/word-count?text=hello%20world";

fetchWithPayment(url, {
  method: "GET",
})
  .then(async (response) => {
    const body = await response.json();
    console.log(body);
  })
  .catch((error) => {
    console.error(error);
  });
