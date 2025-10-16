import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Access {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  access: Access[];
}

interface Company {
  client_id: number;
  id: number;
  name: string;
}

export interface UserState {
  id: number | null;
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  profile_pic: string | null;
  is_active: boolean;
  role: Role[];
  company: Company[];
}

const initialState: UserState = {
  id: null,
  user_name: "",
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  profile_pic: null,
  is_active: false,
  role: [],
  company: []
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    clearUserProfile: () => initialState,
  },
});

export const { setUserProfile, clearUserProfile } = userSlice.actions;

export default userSlice.reducer;

