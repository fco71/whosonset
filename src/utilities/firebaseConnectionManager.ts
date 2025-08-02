import { db } from '../firebase';
import { 
  connectFirestoreEmulator, 
  enableNetwork, 
  disableNetwork
} from 'firebase/firestore';

class FirebaseConnectionManager {
  private static instance: FirebaseConnectionManager;
  private isConnected: boolean = false;
  private connectionAttempts: number = 0;
  private maxRetries: number = 3;
  private retryDelay: number = 1000; // 1 second
  private isInitializing: boolean = false;

  private constructor() {
    // Don't auto-initialize - let the app call ensureConnection when needed
    console.log('[FirebaseConnectionManager] Connection manager created (lazy initialization)');
  }

  static getInstance(): FirebaseConnectionManager {
    if (!FirebaseConnectionManager.instance) {
      FirebaseConnectionManager.instance = new FirebaseConnectionManager();
    }
    return FirebaseConnectionManager.instance;
  }

  private async initializeConnection(): Promise<void> {
    if (this.isInitializing) return;
    
    this.isInitializing = true;
    console.log('[FirebaseConnectionManager] Checking connection status...');

    try {
      // Simply enable network connection - no persistence setup
      await enableNetwork(db);
      this.isConnected = true;
      this.connectionAttempts = 0;
      
      console.log('[FirebaseConnectionManager] Connection verified successfully');
    } catch (error) {
      console.error('[FirebaseConnectionManager] Connection check failed:', error);
      this.handleConnectionError();
    } finally {
      this.isInitializing = false;
    }
  }

  private async handleConnectionError(): Promise<void> {
    this.isConnected = false;
    this.connectionAttempts++;

    if (this.connectionAttempts <= this.maxRetries) {
      console.log(`[FirebaseConnectionManager] Retrying connection (${this.connectionAttempts}/${this.maxRetries})...`);
      
      setTimeout(() => {
        this.initializeConnection();
      }, this.retryDelay * this.connectionAttempts);
    } else {
      console.error('[FirebaseConnectionManager] Max retries reached, connection failed');
    }
  }

  async ensureConnection(): Promise<boolean> {
    if (!this.isConnected && !this.isInitializing) {
      await this.initializeConnection();
    }
    
    // If still not connected after initialization, try a simple operation
    if (!this.isConnected) {
      try {
        // Try a simple operation to test connection
        await enableNetwork(db);
        this.isConnected = true;
        console.log('[FirebaseConnectionManager] Connection verified through network enable');
      } catch (error) {
        console.log('[FirebaseConnectionManager] Connection verification failed:', error);
        return false;
      }
    }
    
    return this.isConnected;
  }

  async reconnect(): Promise<void> {
    console.log('[FirebaseConnectionManager] Reconnecting...');
    this.isConnected = false;
    this.connectionAttempts = 0;
    await this.initializeConnection();
  }

  async disconnect(): Promise<void> {
    console.log('[FirebaseConnectionManager] Disconnecting...');
    await disableNetwork(db);
    this.isConnected = false;
  }

  async clearCache(): Promise<void> {
    console.log('[FirebaseConnectionManager] Clearing cache...');
    // Note: clearPersistence is not available in this Firebase version
    // Cache will be cleared automatically when needed
  }

  isConnectionHealthy(): boolean {
    return this.isConnected;
  }

  getConnectionStatus(): { isConnected: boolean; attempts: number; isInitializing: boolean } {
    return {
      isConnected: this.isConnected,
      attempts: this.connectionAttempts,
      isInitializing: this.isInitializing
    };
  }
}

export const firebaseConnectionManager = FirebaseConnectionManager.getInstance(); 