import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, } from "axios";
import { IStorageService, StorageKeys } from "./storageService";

// Configure your base API URL
const BASE_URL = "https://api.bc.constrogen.com/";

// Determine if the environment is development
const isDev = import.meta.env.DEV || process.env.NODE_ENV === "development";

/**
 * Create API service with storage dependency injection
 * This allows using different storage implementations (localStorage for web, SecureStore for mobile)
 */
export const createApiService = (storageService: IStorageService, logoutCallback?: () => void) => {
  // Create axios instance with base configuration
  const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 20000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor
  api.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
      const authInfo = (await storageService?.get(StorageKeys.AUTH_INFO)) as any;
      
      if (authInfo?.isAuthenticated) {
        config.headers.Authorization = `Bearer ${authInfo?.auth_token?.access || authInfo?.access}`;
        if (authInfo.client_id && authInfo.company_id) {
          // Use btoa for browser compatibility (Buffer is Node.js specific)
          const encoded = btoa(`${authInfo.client_id}|${authInfo.company_id}`);
          config.headers["x-account"] = encoded;
        }
      }

      // Log request details in development mode
      if (isDev) {
        console.log("API Request:", {
          method: config.method?.toUpperCase(),
          url: `${config.baseURL}${config.url}`,
          headers: config.headers,
          params: config.params,
          data: config.data,
        });
      }

      return config;
    },
    (error: AxiosError) => {
      if (isDev) {
        console.error("API Request Error:", {
          error: error.message,
          config: error.config,
        });
      }
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      if (isDev) {
        console.log("API Response:", {
          method: response.config.method?.toUpperCase(),
          url: response.config.url,
          status: response.status,
          statusText: response.statusText,
          data: response.data,
        });
      }
      return response;
    },
    async (error: AxiosError) => {
      const res = error.response;
      
      if (isDev) {
        console.error("API Response Error:", {
          method: error.config?.method?.toUpperCase(),
          url: error.config?.url,
          status: res?.status,
          statusText: res?.statusText,
          data: res?.data,
          message: error.message,
        });
      }

      if (axios.isAxiosError(error)) {
        // Handle expired token
        if (
          res?.data?.code === "token_not_valid" &&
          res?.data?.messages?.some(
            (msg: any) => msg.message === "Token is invalid or expired"
          )
        ) {
          // Trigger logout callback if provided
          if (logoutCallback) {
            logoutCallback();
          }

          return Promise.reject({
            message: "Session expired. Redirecting to login.",
            status: 401,
            data: res.data,
            isAxiosError: true,
          });
        }

        return Promise.reject({
          message: error.response?.data?.message || error.message,
          status: error.response?.status,
          data: error.response?.data,
          isAxiosError: true,
        });
      }
      return Promise.reject(error);
    }
  );

  return {
    // GET request
    get: async <T>(
      endpoint: string,
      params?: Record<string, any>,
      config?: AxiosRequestConfig
    ): Promise<T> => {
      try {
        const response = await api.get<T>(endpoint, { ...config, params });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // POST request
    post: async <T>(
      endpoint: string,
      data?: Record<string, any>,
      config?: AxiosRequestConfig
    ): Promise<T> => {
      try {
        const response = await api.post<T>(endpoint, data, config);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // PUT request
    put: async <T>(
      endpoint: string,
      data?: Record<string, any>,
      config?: AxiosRequestConfig
    ): Promise<T> => {
      try {
        const response = await api.put<T>(endpoint, data, config);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // DELETE request
    del: async <T>(
      endpoint: string,
      config?: AxiosRequestConfig
    ): Promise<T> => {
      try {
        const response = await api.delete<T>(endpoint, config);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // Export axios instance
    instance: api,
  };
};

