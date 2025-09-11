import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../interceptors/api.js";

// Async thunk to fetch dashboard summary
export const fetchDashboardSummary = createAsyncThunk(
  "dashboard/fetchSummary",
  async () => {
    const res = await api.get("/dashboard/admin");
    return res.data;
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    summary: {
      totalSales: 0,
      totalInvoices: 0,
      totalCustomers: 0,
      totalStaff: 0,
      salesByStaff: [],
      topProducts: [],
      dailySales: [],
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload; // full object stored here
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dashboardSlice.reducer;
