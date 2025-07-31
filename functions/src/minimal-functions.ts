import * as admin from "firebase-admin";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

admin.initializeApp();

// Minimal test function
export const testMinimalFunction = onDocumentCreated("test/{docId}", async (event) => {
  console.log("Minimal function triggered!");
  return;
}); 