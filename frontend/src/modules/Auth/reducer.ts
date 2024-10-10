import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { STORAGE_KEY } from "../../utils/constants";
import { IAuth } from "./types";

export interface AuthState {
  id: string;
  email: string;
}

const initState: AuthState = {
  id: "",
  email: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    login: (state: AuthState, action: PayloadAction<IAuth>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      localStorage.setItem(STORAGE_KEY.USER_TOKEN, action.payload.accessToken);
    },
    user: (
      state: AuthState,
      action: PayloadAction<Omit<IAuth, "accessToken">>
    ) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
    },
  },
});

export const { actions, reducer } = authSlice;

export default authSlice;
