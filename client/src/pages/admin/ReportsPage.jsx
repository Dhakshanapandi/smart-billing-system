// src/pages/ReportPage.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDailyReport, fetchRangeReport } from "../../redux/reportSlice";
import Spinner from "../../components/Spinner";
import ExcelExport from "../../components/ExcelExport"; // ✅ Import ExcelExport

export default function ReportPage() {
  const dispatch = useDispatch();
  const { daily, range, loading, error } = useSelector((state) => state.report);

  const [dailyDate, setDailyDate] = useState("");
  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");
  const [dailyError, setDailyError] = useState("");
  const [rangeError, setRangeError] = useState("");

  const handleDailySubmit = (e) => {
    e.preventDefault();
    if (!dailyDate) {
      setDailyError("Please select a date.");
      return;
    }
    setDailyError("");
    dispatch(fetchDailyReport(dailyDate));
  };

  const handleRangeSubmit = (e) => {
    e.preventDefault();
    if (!rangeFrom || !rangeTo) {
      setRangeError("Please select both start and end dates.");
      return;
    }
    if (new Date(rangeFrom) > new Date(rangeTo)) {
      setRangeError("Start date cannot be after end date.");
      return;
    }
    setRangeError("");
    dispatch(fetchRangeReport({ from: rangeFrom, to: rangeTo }));
  };

  const renderInvoicesTable = (invoices) => {
    if (!invoices || invoices.length === 0) {
      return (
        <tr>
          <td colSpan="4" className="p-2 border text-center text-gray-500">
            No invoices found
          </td>
        </tr>
      );
    }

    return invoices.map((inv) => (
      <tr key={inv._id}>
        <td className="p-2 border">{inv._id.slice(-6)}</td>
        <td className="p-2 border">{inv.customerName}</td>
        <td className="p-2 border">₹{inv.totalAmount?.toFixed(2) || 0}</td>
        <td className="p-2 border">{new Date(inv.invoiceDate).toLocaleDateString()}</td>
      </tr>
    ));
  };

  // ✅ Prepare data for Excel export for daily report
  const dailyExportData = daily
    ? daily.invoices.map((inv) => ({
        "Invoice #": inv._id.slice(-6),
        Customer: inv.customerName,
        "Total Amount": inv.totalAmount?.toFixed(2) || 0,
        Date: new Date(inv.invoiceDate).toLocaleDateString(),
      }))
    : [];

  // ✅ Prepare data for Excel export for range report
  const rangeExportData = range
    ? range.invoices.map((inv) => ({
        "Invoice #": inv._id.slice(-6),
        Customer: inv.customerName,
        "Total Amount": inv.totalAmount?.toFixed(2) || 0,
        Date: new Date(inv.invoiceDate).toLocaleDateString(),
      }))
    : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      <h2 className="text-2xl font-semibold text-gray-800">Reports</h2>

      {/* Daily Report */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-medium mb-4">Daily Report</h3>
        <form onSubmit={handleDailySubmit} className="flex space-x-3 mb-4 flex-wrap">
          <input
            type="date"
            value={dailyDate}
            onChange={(e) => setDailyDate(e.target.value)}
            className="border px-3 py-2 rounded-lg w-full md:w-auto"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Fetch
          </button>
        </form>
        {dailyError && <p className="text-red-500 mb-4">{dailyError}</p>}

        {loading && <Spinner />}
        {error && <p className="text-red-500">{error}</p>}

        {daily && (
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p><strong>Date:</strong> {daily.date}</p>
                <p><strong>Total Sales:</strong> ₹{daily.totalSales?.toFixed(2) || 0}</p>
                <p><strong>Invoices Count:</strong> {daily.count || 0}</p>
              </div>
              <ExcelExport
                data={dailyExportData}
                fileName={`daily-report-${daily.date}.xlsx`}
              />
            </div>

            <table className="w-full border mt-4 text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Invoice #</th>
                  <th className="p-2 border">Customer</th>
                  <th className="p-2 border">Total Amount</th>
                  <th className="p-2 border">Date</th>
                </tr>
              </thead>
              <tbody>{renderInvoicesTable(daily.invoices)}</tbody>
            </table>
          </div>
        )}
      </div>

      {/* Range Report */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-medium mb-4">Range Report</h3>
        <form onSubmit={handleRangeSubmit} className="flex space-x-3 mb-4 flex-wrap">
          <input
            type="date"
            value={rangeFrom}
            onChange={(e) => setRangeFrom(e.target.value)}
            className="border px-3 py-2 rounded-lg w-full md:w-auto"
          />
          <input
            type="date"
            value={rangeTo}
            onChange={(e) => setRangeTo(e.target.value)}
            className="border px-3 py-2 rounded-lg w-full md:w-auto"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Fetch
          </button>
        </form>
        {rangeError && <p className="text-red-500 mb-4">{rangeError}</p>}

        {loading && <Spinner />}
        {error && <p className="text-red-500">{error}</p>}

        {range && (
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p><strong>From:</strong> {range.from} <strong>To:</strong> {range.to}</p>
                <p><strong>Total Sales:</strong> ₹{range.totalSales?.toFixed(2) || 0}</p>
                <p><strong>Invoices Count:</strong> {range.count || 0}</p>
              </div>
              <ExcelExport
                data={rangeExportData}
                fileName={`range-report-${range.from}-to-${range.to}.xlsx`}
              />
            </div>

            <table className="w-full border mt-4 text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Invoice #</th>
                  <th className="p-2 border">Customer</th>
                  <th className="p-2 border">Total Amount</th>
                  <th className="p-2 border">Date</th>
                </tr>
              </thead>
              <tbody>{renderInvoicesTable(range.invoices)}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
