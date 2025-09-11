import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

// Admin imports
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffManagement from "./pages/admin/StaffManagement";
import StaffForm from "./pages/admin/StaffForm";
import InvoicesPage from "./pages/admin/InvoicesPage";
import ReportsPage from "./pages/admin/ReportsPage";
import AdminProducts from "./pages/admin/AdminProducts";
import ProductForm from "./pages/admin/AdminProductForm";

// Staff imports
import StaffLayout from "./layouts/StaffLayout";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffInvoicePage from "./pages/staff/StaffInvoicePage";
import StaffProducts from "./pages/staff/StaffProducts";
import StaffProductForm from "./pages/staff/StaffProductForm";

// Common
import ProtectedRoute from "./pages/ProtectedRoute";
import StaffInvoiceTable from "./pages/staff/StaffInvoiceTable";
import PrintInvoice from "./pages/staff/PrintInvoice";

export default function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="staff" element={<StaffManagement />} />
        <Route path="staff/add" element={<StaffForm />} />
        <Route path="staff/edit/:id" element={<StaffForm />} />
        <Route path="invoices" element={<InvoicesPage />} />
        
        {/* Product Routes */}
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/add" element={<ProductForm />} />
        <Route path="products/edit/:id" element={<ProductForm />} />

        <Route path="reports" element={<ReportsPage />} />
      </Route>

      {/* Staff Routes */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute roles={["staff"]}>
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StaffDashboard />} />
        <Route path="invoices" element={<StaffInvoicePage />} />
        <Route path="invoices/list" element={<StaffInvoiceTable />} />
        <Route path="/staff/invoices/:id/print" element={<PrintInvoice />} />

        {/* Product Routes */}
        <Route path="products" element={<StaffProducts />} />
        <Route path="products/add" element={<StaffProductForm />} />
        <Route path="products/edit/:id" element={<StaffProductForm />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
