// src/redux/invoiceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../interceptors/api.js";

// Fetch invoices (staff sees own, admin sees all)
export const fetchInvoices = createAsyncThunk(
  "invoices/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(
        "https://smart-billing-system.onrender.com/api/invoices/list"
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create a new invoice
export const createInvoice = createAsyncThunk(
  "invoices/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "https://smart-billing-system.onrender.com/api/invoices/create-invoice",
        payload
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const invoiceSlice = createSlice({
  name: "invoices",
  initialState: {
    list: [],
    loading: false,
    error: null,
    createLoading: false,
    createError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchInvoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // createInvoice
      .addCase(createInvoice.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.createLoading = false;
        // Add newly created invoice to list
        state.list.unshift(action.payload);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || action.error.message;
      });
  },
});

export default invoiceSlice.reducer;
