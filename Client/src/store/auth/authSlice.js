import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login:async (state, action) => {
      // state.userData = action.payload;

      //login theough API
      const url = "/api/v1/users/login";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action.payload),
      };

      const response = await fetch(url, options);
      const data = await response.json();

      console.log("Responce data -->",data);
      

      
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
