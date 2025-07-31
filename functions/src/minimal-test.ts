import { onRequest } from "firebase-functions/v2/https";

export const minimalTest = onRequest((req, res) => {
  res.json({ message: "Minimal test successful", timestamp: new Date().toISOString() });
}); 