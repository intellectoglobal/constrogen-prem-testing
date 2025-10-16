/**
 * Platform-agnostic storage service interface
 * Implementations should be provided for web (localStorage) and mobile (SecureStore)
 */
export interface IStorageService {
  set(key: string, value: any): Promise<void>;
  get(key: string): Promise<any>;
  remove(key: string): Promise<void>;
  isAvailable(): Promise<boolean>;
}

/**
 * Commonly used storage keys
 */
export const StorageKeys = {
  AUTH_INFO: "authInfo",
};

/**
 * Web implementation using localStorage with encryption simulation
 */
export class WebStorageService implements IStorageService {
  async set(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      localStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Storage set error for key "${key}":`, error);
      throw error;
    }
  }

  async get(key: string): Promise<any> {
    try {
      const jsonValue = localStorage.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Storage get error for key "${key}":`, error);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Storage remove error for key "${key}":`, error);
      throw error;
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const testKey = "__storage_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.error("Storage availability check error:", error);
      return false;
    }
  }
}

