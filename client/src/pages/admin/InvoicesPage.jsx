import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoices } from "../../redux/invoiceSlice";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import ExcelExport from "../../components/ExcelExport";
import Spinner from "../../components/Spinner";

export default function InvoicePage() {
  const dispatch = useDispatch();
  const { list: invoices, loading, error } = useSelector(
    (state) => state.invoices
  );
  const user = useSelector((state) => state.auth);

  const [selectedDate, setSelectedDate] = useState("all");
  const [customDate, setCustomDate] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("all");

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  const staffOptions = [
    ...new Set(
      invoices
        .filter((inv) => inv.staffId !== null)
        .map((inv) => inv.staffId._id)
    ),
  ].map((id) => {
    return invoices.find((inv) => inv.staffId && inv.staffId._id === id)
      ?.staffId;
  });

  const filterInvoices = () => {
    let filtered = invoices;

    if (selectedStaff !== "all") {
      filtered = filtered.filter(
        (inv) => inv.staffId && inv.staffId._id === selectedStaff
      );
    }

    if (selectedDate === "today") {
      filtered = filtered.filter((inv) => isToday(parseISO(inv.invoiceDate)));
    } else if (selectedDate === "yesterday") {
      filtered = filtered.filter((inv) =>
        isYesterday(parseISO(inv.invoiceDate))
      );
    } else if (selectedDate === "custom" && customDate) {
      filtered = filtered.filter(
        (inv) => format(parseISO(inv.invoiceDate), "yyyy-MM-dd") === customDate
      );
    }

    return filtered;
  };

  const filteredInvoices = filterInvoices();
  const totalAmount = filteredInvoices.reduce(
    (sum, inv) => sum + (inv.totalAmount || 0),
    0
  );

  const exportData = filteredInvoices.map((inv) => ({
    "Invoice #": inv._id.slice(-6),
    Customer: inv.customerName,
    Staff: inv.staffId?.name || "N/A",
    "Total Amount": inv.totalAmount || 0,
    invoiceDate: inv.invoiceDate
      ? format(parseISO(inv.invoiceDate), "yyyy-MM-dd")
      : "N/A",
  }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Invoices</h1>

      {/* Filters Section */}
      <div className="bg-white rounded shadow border border-gray-200 p-4 mb-6 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <div>
          <label className="block text-gray-700 mb-1">Date Filter</label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-3 py-2 w-full md:w-48"
          >
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="custom">Select Date</option>
          </select>
        </div>

        {selectedDate === "custom" && (
          <div>
            <label className="block text-gray-700 mb-1">Pick Date</label>
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="border rounded px-3 py-2 w-full md:w-48"
            />
          </div>
        )}

        {user.role === "admin" && (
          <div>
            <label className="block text-gray-700 mb-1">Staff</label>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="border rounded px-3 py-2 w-full md:w-48"
            >
              <option value="all">All</option>
              {staffOptions.map((staff) => (
                <option key={staff._id} value={staff._id}>
                  {staff.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div className="bg-white rounded shadow border border-gray-200 p-4 mb-6 flex justify-between items-center">
        <div>
          <p>
            <strong>Total Invoices:</strong> {filteredInvoices.length}
          </p>
          <p>
            <strong>Total Amount:</strong> ₹{totalAmount.toFixed(2)}
          </p>
        </div>

        <ExcelExport data={exportData} fileName="invoices.xlsx" />
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded shadow border border-gray-200 overflow-x-auto">
        {loading ? <Spinner/> : error ? (
          <div className="p-6 text-red-500">{error}</div>
        ) : (
          <table className="min-w-full table-auto text-sm text-gray-700">
            <thead className="bg-blue-50 text-gray-700">
              <tr>
                <th className="p-3 text-left">Invoice #</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Staff</th>
                <th className="p-3 text-left">Total Amount</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No invoices found
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-gray-50">
                    <td className="p-3">{inv._id.slice(-6)}</td>
                    <td className="p-3">{inv.customerName}</td>
                    <td className="p-3">{inv.staffId?.name || "N/A"}</td>
                    <td className="p-3">₹{inv.totalAmount?.toFixed(2) || 0}</td>
                    <td className="p-3">
                      {format(parseISO(inv.invoiceDate), "yyyy-MM-dd")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
