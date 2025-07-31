import { onRequest } from "firebase-functions/v2/https";

export const simpleTest = onRequest(async (req, res) => {
  res.json({ message: "Hello from Firebase Functions!", timestamp: new Date().toISOString() });
}); 