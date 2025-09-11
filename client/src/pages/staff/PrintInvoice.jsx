// src/pages/staff/PrintInvoice.jsx

import React,{ useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../../interceptors/api";
import Spinner from "../../components/Spinner";

export default function PrintInvoice() {
  const { id } = useParams();
  const [invoice, setInvoice] = React.useState(null);
  const invoiceRef = useRef();

  useEffect(() => {
    const fetchInvoice = async () => {
      const res = await api.get(`/invoices/${id}`);
      setInvoice(res.data);
      console.log(invoice);
      
    };
    fetchInvoice();
  }, [id]);

  const handlePrint = () => {
    const printContents = invoiceRef.current.innerHTML;
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
          ${printContents}
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  };

  if (!invoice) {
    return <Spinner/>
  }

  return (
    <div className="p-6">
      {/* Invoice Content */}
      <div ref={invoiceRef} className="invoice-box bg-white shadow-lg p-6 rounded-lg">
        <h2>Invoice</h2>
        <p><strong>Invoice #:</strong> {invoice._id}</p>
        <p><strong>Customer:</strong> {invoice.customerName}</p>
        <p><strong>Date:</strong> {new Date(invoice.invoiceDate).toLocaleDateString()}</p>

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
            {invoice.items?.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price}</td>
                <td>₹{item.quantity * item.price}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="3"><strong>Total</strong></td>
              <td><strong>₹{invoice.totalAmount}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
      >
        Print
      </button>
    </div>
  );
}
