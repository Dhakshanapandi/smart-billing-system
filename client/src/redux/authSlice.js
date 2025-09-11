import { createSlice } from "@reduxjs/toolkit";

// Initialize state from localStorage if available
const initialState = {
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || null,
  name: localStorage.getItem("name") || null, // Persist name as well
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, role, name } = action.payload;
      state.token = token;
      state.role = role;
      state.name = name;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.name = null;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
    },
    setUser: (state, action) => {
      state.name = action.payload;
      localStorage.setItem("name", action.payload);
    },
  },
});

export const { loginSuccess, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
