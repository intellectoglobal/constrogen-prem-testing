const AUTH = "auth/";
export const AUTH_REQUEST_OPT = `${AUTH}otp/`;
export const AUTH_VERIFY_OTP = `${AUTH}verify-otp/`;

export interface ApiClient {
  get: <T>(endpoint: string, params?: Record<string, any>) => Promise<T>;
  post: <T>(endpoint: string, data?: Record<string, any>) => Promise<T>;
}

/**
 * Create Auth API with injected API client
 * This allows using the same API logic for both web and mobile
 */
export const createAuthApi = (apiClient: ApiClient) => ({
  async verifyEmail(data: any): Promise<string | void> {
    try {
      console.log("Verifying email:", data?.email);
      const res = (await apiClient.get(AUTH_REQUEST_OPT, data)) as any;
      return res;
    } catch (error: any) {
      let message = "";
      if (error?.data) {
        message = error?.data?.email?.[0] || error?.data?.message || error?.message;
      } else {
        message = error?.message || "An error occurred";
      }
      return { message, isAxiosError: error?.isAxiosError } as any;
    }
  },

  async verifyOTP(data: any): Promise<string | void> {
    try {
      console.log("Verifying OTP:", data);
      const res = (await apiClient.post(AUTH_REQUEST_OPT, data)) as any;
      return res;
    } catch (error: any) {
      let message = "";
      if (error?.data) {
        message = error?.data?.error || error?.data?.message || error?.message;
      } else {
        message = error?.message || "An error occurred";
      }
      return { message, isAxiosError: error?.isAxiosError } as any;
    }
  },

  async verifyOtp(otp: any): Promise<string> {
    console.log("Verifying OTP:", otp);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return "mock-auth-token";
  },
});

