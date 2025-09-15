// staffSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../interceptors/api.js";

// Async thunk to fetch staff
export const fetchStaff = createAsyncThunk("staff/fetchStaff", async () => {
  const res = await api.get(
    "https://smart-billing-system.onrender.com/api/staff/get-staff"
  );
  console.log(res);

  return res.data;
});

// Async thunk to add staff
export const addStaff = createAsyncThunk(
  "staff/addStaff",
  async (staffData) => {
    const res = await api.post(
      "https://smart-billing-system.onrender.com/api/staff/staff-create/",
      staffData
    );
    return res.data;
  }
);

// Async thunk to edit staff
export const editStaff = createAsyncThunk(
  "staff/editStaff",
  async ({ id, data }) => {
    const res = await api.put(
      `https://smart-billing-system.onrender.com/api/staff/edit-staff/${id}`,
      data
    );
    return res.data;
  }
);

// Async thunk to delete staff
export const deleteStaff = createAsyncThunk("staff/deleteStaff", async (id) => {
  await api.delete(
    `https://smart-billing-system.onrender.com/api/staff/delete-staff/${id}`
  );
  return id;
});

const staffSlice = createSlice({
  name: "staff",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addStaff.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editStaff.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (staff) => staff._id === action.payload._id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        console.log("deletestaff", action.payload);

        state.list = state.list.filter((staff) => staff._id !== action.payload);
      });
  },
});

export default staffSlice.reducer; // ✅ Export the reducer
