import { createApiService } from "@shared/services/apiService";
import { createAuthApi } from "@shared/services/authApi";
import { storageService } from "../store";
import store from "../store";
import { logoutRequest } from "@shared/redux/slices/authSlice";

// Create API service with web storage
const logoutCallback = () => {
  store.dispatch(logoutRequest());
};

export const apiService = createApiService(storageService, logoutCallback);

// Create Auth API
export const authApi = createAuthApi(apiService);

export default apiService;

