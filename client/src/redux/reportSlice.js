// src/redux/reportSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../interceptors/api.js";

// Fetch daily report
export const fetchDailyReport = createAsyncThunk(
  "report/daily",
  async (date, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `https://smart-billing-system.onrender.com/api/reports/daily?date=${date}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Fetch range report
export const fetchRangeReport = createAsyncThunk(
  "report/range",
  async ({ from, to }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `https://smart-billing-system.onrender.com/api/reports/range?from=${from}&to=${to}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState: {
    daily: null,
    range: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Daily
      .addCase(fetchDailyReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyReport.fulfilled, (state, action) => {
        state.loading = false;
        state.daily = action.payload;
      })
      .addCase(fetchDailyReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })
      // Range
      .addCase(fetchRangeReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRangeReport.fulfilled, (state, action) => {
        state.loading = false;
        state.range = action.payload;
      })
      .addCase(fetchRangeReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      });
  },
});

export default reportSlice.reducer;
