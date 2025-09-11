// src/pages/staff/StaffDashboard.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStaffDashboard } from "../../redux/staffdashboard.js"; // Slice we created
import Spinner from "../../components/Spinner.jsx";
import { FaMoneyBillWave, FaFileInvoice, FaUsers } from "react-icons/fa";

export default function StaffDashboard() {
  const dispatch = useDispatch();
  const { summary, loading, error } = useSelector((state) => state.staffdash);

  useEffect(() => {
    dispatch(getStaffDashboard());
  }, [dispatch]);

  if (loading) return <Spinner />;

  if (error) return <p className="text-red-500 text-center mt-6">{error}</p>;

  // Safe checks before accessing summary properties
  const totalSales = summary?.totalSales || 0;
  const totalInvoices = summary?.totalInvoices || 0;
  const totalCustomers = summary?.totalCustomers || 0;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Sales */}
        <div className="bg-green-500 text-white rounded-lg shadow-lg p-6 flex items-center space-x-4">
          <FaMoneyBillWave size={40} className="opacity-80" />
          <div>
            <p className="text-sm uppercase font-semibold">Total Sales</p>
            <p className="text-2xl font-bold">₹{totalSales.toLocaleString()}</p>
          </div>
        </div>

        {/* Total Invoices */}
        <div className="bg-blue-500 text-white rounded-lg shadow-lg p-6 flex items-center space-x-4">
          <FaFileInvoice size={40} className="opacity-80" />
          <div>
            <p className="text-sm uppercase font-semibold">Total Invoices</p>
            <p className="text-2xl font-bold">{totalInvoices}</p>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-yellow-500 text-white rounded-lg shadow-lg p-6 flex items-center space-x-4">
          <FaUsers size={40} className="opacity-80" />
          <div>
            <p className="text-sm uppercase font-semibold">Total Customers</p>
            <p className="text-2xl font-bold">{totalCustomers}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
