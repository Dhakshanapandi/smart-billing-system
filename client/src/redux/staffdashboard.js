// src/redux/staffSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../interceptors/api.js"; // Your axios instance

// Async thunk to fetch staff dashboard summary
export const getStaffDashboard = createAsyncThunk(
  "staff/getDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/dashboard/staff"); // Backend API
      console.log(res.data);

      return res.data; // { totalSales, totalInvoices, totalCustomers }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const staffSlice = createSlice({
  name: "staffdash",
  initialState: {
    summary: {
      totalSales: 0,
      totalInvoices: 0,
      totalCustomers: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStaffDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStaffDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(getStaffDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default staffSlice.reducer;
