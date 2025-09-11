// src/layouts/AdminLayout.jsx
import { Link, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

export default function AdminLayout() {
  const dispatch = useDispatch();
  const UserDetails = useSelector((state) => state.auth);
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin"
        ? "bg-white text-gray-900 shadow-md"
        : "text-gray-300 hover:text-white hover:bg-gray-700";
    }
    return location.pathname.startsWith(path)
      ? "bg-white text-gray-900 shadow-md"
      : "text-gray-300 hover:text-white hover:bg-gray-700";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
          </div>

          <nav className="p-4 space-y-2">
            <Link
              to="/admin"
              className={`block px-4 py-2 rounded-lg font-medium transition ${isActive("/admin")}`}
            >
              🏠 Home
            </Link>
            <Link
              to="/admin/staff"
              className={`block px-4 py-2 rounded-lg font-medium transition ${isActive("/admin/staff")}`}
            >
              👥 Staff Management
            </Link>
            <Link
              to="/admin/products"
              className={`block px-4 py-2 rounded-lg font-medium transition ${isActive("/admin/products")}`}
            >
              📦 Products
            </Link>
            <Link
              to="/admin/reports"
              className={`block px-4 py-2 rounded-lg font-medium transition ${isActive("/admin/reports")}`}
            >
              📊 Reports
            </Link>
            <Link
              to="/admin/invoices"
              className={`block px-4 py-2 rounded-lg font-medium transition ${isActive("/admin/invoices")}`}
            >
              🧾 Invoices
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="text-gray-400 text-sm mb-3">App Version 1.2</div>
          <div className="mb-3">
            <Link
              to="/admin/support"
              className="text-gray-400 hover:text-white text-sm transition"
            >
              Support
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 text-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10 border-b border-gray-700">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-700 text-white rounded-full flex items-center justify-center font-semibold">
              {UserDetails.name ? UserDetails.name[0].toUpperCase() : "U"}
            </div>
            <div className="text-right">
              <p className="text-white font-medium">{UserDetails.name || "User"}</p>
              <p className="text-gray-400 text-sm">{UserDetails.role || "role"}</p>
            </div>
          </div>
        </header>

        <main className="p-6 flex-1 overflow-y-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
