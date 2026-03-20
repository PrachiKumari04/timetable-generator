import { createSlice } from "@reduxjs/toolkit";
// import { useNavigate } from "react-router";

const initialState = {
  isAuthenticated: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      // const navigate = useNavigate();

      // state.userData = action.payload;

      
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
