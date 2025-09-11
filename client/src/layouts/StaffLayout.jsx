// src/layouts/StaffLayout.jsx
import { Link, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

export default function StaffLayout() {
  const dispatch = useDispatch();
  const UserDetails = useSelector((state) => state.auth);
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  // Custom active link logic
  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path
        ? "bg-gray-200 text-gray-900 shadow-sm"
        : "text-gray-700 hover:bg-gray-100";
    }
    return location.pathname.startsWith(path)
      ? "bg-gray-200 text-gray-900 shadow-sm"
      : "text-gray-700 hover:bg-gray-100";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Staff Panel</h2>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            <Link
              to="/staff"
              className={`block px-4 py-2 rounded-lg font-medium transition ${isActive(
                "/staff",
                true
              )}`}
            >
              🏠 Dashboard
            </Link>

            <Link
              to="/staff/invoices"
              className={`block px-4 py-2 rounded-lg font-medium transition ${isActive(
                "/staff/invoices",
                true
              )}`}
            >
              🧾 Create Invoice
            </Link>

            <Link
              to="/staff/invoices/list"
              className={`block px-4 py-2 rounded-lg font-medium transition ${isActive(
                "/staff/invoices/list",
                true
              )}`}
            >
              📄 List Invoice
            </Link>

            <Link
              to="/staff/products"
              className={`block px-4 py-2 rounded-lg font-medium transition ${isActive(
                "/staff/products" // not exact → covers /add and /edit too
              )}`}
            >
              📦 Products
            </Link>
          </nav>
        </div>

        {/* Footer Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-gray-500 text-sm mb-3">App Version 1.2</div>
          <button
            onClick={handleLogout}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium transition"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Staff Dashboard</h1>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-semibold">
              {UserDetails.name[0].toUpperCase()}
            </div>
            <div className="text-right">
              <p className="text-gray-800 font-medium">{UserDetails.name}</p>
              <p className="text-gray-500 text-sm">{UserDetails.role}</p>
            </div>
          </div>
        </header>

        <main className="p-6 flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
