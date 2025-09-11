import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardSummary } from "../../redux/dashboardSlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Spinner from "../../components/Spinner";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { summary, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  if (loading) return <Spinner />;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 md:p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg rounded-2xl p-4 sm:p-6 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
          <h2 className="text-xs sm:text-sm opacity-90">Total Sales</h2>
          <p className="text-2xl sm:text-3xl font-extrabold mt-1 sm:mt-2">₹{summary.totalSales}</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg rounded-2xl p-4 sm:p-6 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
          <h2 className="text-xs sm:text-sm opacity-90">Invoices Generated</h2>
          <p className="text-2xl sm:text-3xl font-extrabold mt-1 sm:mt-2">{summary.totalInvoices}</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg rounded-2xl p-4 sm:p-6 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
          <h2 className="text-xs sm:text-sm opacity-90">Unique Customers</h2>
          <p className="text-2xl sm:text-3xl font-extrabold mt-1 sm:mt-2">{summary.totalCustomers}</p>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg rounded-2xl p-4 sm:p-6 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
          <h2 className="text-xs sm:text-sm opacity-90">Total Staff</h2>
          <p className="text-2xl sm:text-3xl font-extrabold mt-1 sm:mt-2">{summary.totalStaff}</p>
        </div>
      </div>

      {/* Sales by Staff */}
      <div className="bg-white shadow rounded p-4 sm:p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Sales by Staff</h2>
        <table className="min-w-full table-auto text-sm sm:text-base border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-2 text-left">Staff</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Invoices</th>
              <th className="p-2 text-left">Sales</th>
            </tr>
          </thead>
          <tbody>
            {summary.salesByStaff?.map((staff) => (
              <tr key={staff._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{staff.staffName}</td>
                <td className="p-2">{staff.staffEmail}</td>
                <td className="p-2">{staff.invoiceCount}</td>
                <td className="p-2">₹{staff.totalSales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Products */}
      <div className="bg-white shadow rounded p-4 sm:p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Top Products</h2>
        <table className="min-w-full table-auto text-sm sm:text-base border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-left">Code</th>
              <th className="p-2 text-left">Units Sold</th>
              <th className="p-2 text-left">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {summary.topProducts?.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{product.name || "N/A"}</td>
                <td className="p-2">{product.code || "-"}</td>
                <td className="p-2">{product.totalSold}</td>
                <td className="p-2">₹{product.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Daily Sales Chart */}
      <div className="bg-white shadow rounded p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-4">Daily Sales Trend</h2>
        <div className="w-full h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={summary.dailySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
