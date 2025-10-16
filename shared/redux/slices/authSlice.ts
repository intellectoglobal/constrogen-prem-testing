import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  refresh: string | null;
  user: null | object;
  access: string | null;
  loading: boolean;
  error: string | null;
  module_permissions: string | null | any[];
  isAuthenticated: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginSuccessPayload {
  token: string;
}

export const initialState: AuthState = {
  refresh: null,
  access: null,
  user: null,
  loading: false,
  error: null,
  module_permissions: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    checkRefetchToken: (state, action: PayloadAction<any>) => {
      state.loading = true;
      state.error = null;
    },
    refetchTokenSuccess: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        loading: false,
        ...action?.payload,
      };
    },
    refetchTokenSuccessFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action?.payload;
    },
    logoutRequest: (state) => {
      return {
        ...state,
        ...initialState,
        loading: true,
      };
    },
    logoutSuccess: (state) => {
      return {
        ...initialState,
      };
    },
  },
});

export const {
  checkRefetchToken,
  refetchTokenSuccess,
  refetchTokenSuccessFailure,
  logoutRequest,
  logoutSuccess,
} = authSlice.actions;

export default authSlice.reducer;

