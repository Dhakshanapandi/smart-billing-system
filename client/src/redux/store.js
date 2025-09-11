// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import staffReducer from "./staffSlics"; // Import staffReducer
import productReducer from "./productSlice";
import resportReducer from "./reportSlice.js";
import invoiceReducer from "./invoiceSlice.js";
import dashboardReducer from "./dashboardSlice.js";
import staffDashboardReducer from "./staffdashboard.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    staff: staffReducer, // Add staff slice reducer here
    products: productReducer,
    report: resportReducer,
    invoices: invoiceReducer,
    dashboard: dashboardReducer,
    staffdash: staffDashboardReducer,
  },
});

export default store;
