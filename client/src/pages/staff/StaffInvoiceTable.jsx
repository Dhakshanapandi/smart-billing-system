// src/pages/staff/StaffInvoiceTable.jsx
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoices } from "../../redux/invoiceSlice";
import { parseISO, isToday, isYesterday, format } from "date-fns";
import api from "../../interceptors/api";

export default function StaffInvoiceTable() {
  const dispatch = useDispatch();
  const { list: invoices, loading, error } = useSelector(
    (state) => state.invoices
  );

  const [selectedDate, setSelectedDate] = useState("all");
  const [customDate, setCustomDate] = useState("");

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  const filterInvoices = () => {
    return invoices.filter((inv) => {
      const invDate = parseISO(inv.invoiceDate);
      if (selectedDate === "today" && !isToday(invDate)) return false;
      if (selectedDate === "yesterday" && !isYesterday(invDate)) return false;
      if (selectedDate === "custom" && customDate) {
        if (format(invDate, "yyyy-MM-dd") !== customDate) return false;
      }
      return true;
    });
  };

  const filteredInvoices = filterInvoices();

  // ✅ Direct Print Function
  const handlePrint = async (id) => {
    const res = await api.get(`/invoices/${id}`);
    const invoice = res.data;

    const newWindow = window.open("", "", "width=800,height=600");
    newWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .invoice-box { width: 100%; border: 1px solid #eee; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            table, th, td { border: 1px solid #ddd; }
            th, td { padding: 8px; text-align: left; }
            h2 { text-align: center; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <h2>Invoice</h2>
            <p><strong>Invoice #:</strong> ${invoice._id}</p>
            <p><strong>Customer:</strong> ${invoice.customerName}</p>
            <p><strong>Date:</strong> ${new Date(invoice.invoiceDate).toLocaleDateString()}</p>

            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.products
                  ?.map(
                    (item) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.price}</td>
                    <td>₹${item.quantity * item.price}</td>
                  </tr>
                `
                  )
                  .join("")}
                <tr>
                  <td colspan="3"><strong>Total</strong></td>
                  <td><strong>₹${invoice.totalAmount}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Invoices</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <div>
          <label className="block text-gray-700 mb-1">Date</label>
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

          {selectedDate === "custom" && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="border rounded px-3 py-2 mt-2 w-full md:w-48"
            />
          )}
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        {loading ? (
          <div className="flex items-center h-64 px-6 justify-center">
            <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mr-4"></div>
            <p className="text-gray-500">Loading invoices...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-red-500">{error}</div>
        ) : (
          <table className="min-w-full table-auto text-sm text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Invoice #</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Total Amount</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-gray-50">
                    <td className="p-3">{inv._id.slice(-6)}</td>
                    <td className="p-3">{inv.customerName}</td>
                    <td className="p-3">₹{inv.totalAmount?.toFixed(2) || 0}</td>
                    <td className="p-3">{format(parseISO(inv.invoiceDate), "yyyy-MM-dd")}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handlePrint(inv._id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Print
                      </button>
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
