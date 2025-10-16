import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosRequestHeaders,
} from "axios";
import { InternalAxiosRequestConfig } from "axios";
import { IStorageService, StorageKeys } from "./storageService";

// Base API URL
const BASE_URL = "https://api.bc.constrogen.com/";
const isDev = import.meta.env.DEV || process.env.NODE_ENV === "development";

// Define type for token error response
interface TokenErrorResponse {
  code: string;
  messages: { message: string }[];
  [key: string]: any;
}

// Create API service
export const createApiService = (
  storageService: IStorageService,
  logoutCallback?: () => void
) => {
  const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 20000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor
  api.interceptors.request.use(
    async (
      config: InternalAxiosRequestConfig
    ): Promise<InternalAxiosRequestConfig> => {
      const authInfo = (await storageService?.get(
        StorageKeys.AUTH_INFO
      )) as any;

      // Ensure headers exist
      config.headers = config.headers || ({} as AxiosRequestHeaders);

      if (authInfo?.isAuthenticated) {
        config.headers["Authorization"] = `Bearer ${
          authInfo?.auth_token?.access || authInfo?.access
        }`;

        if (authInfo.client_id && authInfo.company_id) {
          const encoded = btoa(`${authInfo.client_id}|${authInfo.company_id}`);
          config.headers["x-account"] = encoded;
        }
      }

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
      const resData = error.response?.data as TokenErrorResponse | undefined;

      if (isDev) {
        console.error("API Response Error:", {
          method: error.config?.method?.toUpperCase(),
          url: error.config?.url,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: resData,
          message: error.message,
        });
      }

      if (axios.isAxiosError(error)) {
        // Handle expired token
        if (
          resData?.code === "token_not_valid" &&
          resData.messages?.some(
            (msg) => msg.message === "Token is invalid or expired"
          )
        ) {
          logoutCallback?.();
          return Promise.reject({
            message: "Session expired. Redirecting to login.",
            status: 401,
            data: resData,
            isAxiosError: true,
          });
        }

        return Promise.reject({
          message: resData?.message || error.message,
          status: error.response?.status,
          data: resData,
          isAxiosError: true,
        });
      }

      return Promise.reject(error);
    }
  );

  // Generic request methods
  const get = async <T>(
    endpoint: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await api.get<T>(endpoint, { ...config, params });
    return response.data;
  };

  const post = async <T>(
    endpoint: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await api.post<T>(endpoint, data, config);
    return response.data;
  };

  const put = async <T>(
    endpoint: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await api.put<T>(endpoint, data, config);
    return response.data;
  };

  const del = async <T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await api.delete<T>(endpoint, config);
    return response.data;
  };

  return { get, post, put, del, instance: api };
};
