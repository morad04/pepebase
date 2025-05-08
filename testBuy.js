import { privateKeyToAccount } from "viem/accounts";
import { wrapFetchWithPayment, decodeXPaymentResponse } from "x402-fetch";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY environment variable is not set");
}

// Convert to hex if it's not already
let privateKey = process.env.PRIVATE_KEY;
if (!privateKey.startsWith("0x")) {
  // Convert to hex and ensure it's 64 characters long
  privateKey = "0x" + Buffer.from(privateKey).toString("hex").padStart(64, "0");
}

const account = privateKeyToAccount(privateKey);
// 0.1 * 10 ** 7 is the maximum amount that can be paid
const fetchWithPayment = wrapFetchWithPayment(fetch, account, 0.1 * 10 ** 7);

const url = "http://localhost:4021/text-to-image?prompt=a%20red%20ball";

fetchWithPayment(url, {
  method: "GET",
})
  .then(async (response) => {
    const body = await response.json();
    console.log("body", body);

    const xPaymentHeader = response.headers.get("x-payment-response");
    if (xPaymentHeader) {
      const paymentResponse = decodeXPaymentResponse(xPaymentHeader);
      console.log("paymentResponse", paymentResponse);
    }
  })
  .catch((error) => {
    console.error("error", error);
  });
