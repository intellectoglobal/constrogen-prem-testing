// utils/errorHandler.ts
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with a status code outside 2xx
    return (
      error.response.data || error.response.data.message || "Request failed"
    );
  } else if (error.request) {
    // No response received
    return "No response from server";
  } else {
    // Something wrong with request setup
    return error.message || "Request failed";
  }
};

export interface ToastMessage {
  toastType?: "error" | "success" | "info" | "warning";
  message: string;
}

// This will be implemented differently for web and mobile
export type ShowToastFunction = (param: ToastMessage) => void;

