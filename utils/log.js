export function log(message, level = "info", errorObj = null) {
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
