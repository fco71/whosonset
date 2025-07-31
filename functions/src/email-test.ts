import { onRequest } from "firebase-functions/v2/https";
import * as functions from 'firebase-functions';

export const emailTest = onRequest(async (req, res) => {
  try {
    // Get Firebase Functions config
    const config = functions.config();
    
    res.json({ 
      message: "Email configuration test", 
      config: {
        smtp: {
          host: config.smtp?.host,
          port: config.smtp?.port,
          user: config.smtp?.user,
          // Don't include password for security
        },
        email: {
          from: config.email?.from
        }
      },
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}); 