import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/productSlice";
import { createInvoice } from "../../redux/invoiceSlice";
import Spinner from "../../components/Spinner.jsx";

export default function StaffInvoicePage() {
  const dispatch = useDispatch();
  const { list: allProducts, loading: productsLoading } = useSelector((state) => state.products);
  const { createLoading, createError } = useSelector((state) => state.invoices);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [invoiceProducts, setInvoiceProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({});

  const [showToast, setShowToast] = useState(false); // Toast state

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filtered products by search
  const filteredProducts = allProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add / Remove / Qty Change
  const handleAddProduct = (product) => {
    const exists = invoiceProducts.find((p) => p._id === product._id);
    if (exists) {
      setInvoiceProducts((prev) =>
        prev.map((p) => (p._id === product._id ? { ...p, qty: p.qty + 1 } : p))
      );
    } else {
      setInvoiceProducts([...invoiceProducts, { ...product, qty: 1 }]);
    }
  };

  const handleRemoveProduct = (id) => {
    setInvoiceProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const handleQtyChange = (id, delta) => {
    setInvoiceProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p))
    );
  };

  const totalPerProduct = (price, qty) => parseFloat(price) * qty;
  const grandTotal = invoiceProducts.reduce(
    (sum, p) => sum + totalPerProduct(p.price, p.qty),
    0
  );

  // Validation
  const validate = () => {
    const errs = {};
    if (!customerName.trim()) errs.customerName = "Customer name is required";
    if (!customerPhone.match(/^\d{10}$/))
      errs.customerPhone = "Enter a valid 10-digit phone number";
    if (invoiceProducts.length === 0) errs.products = "Add at least one product to invoice";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save invoice
  const handleSave = async () => {
    if (!validate()) return;

    const payload = {
      customerName,
      customerMobile: customerPhone,
      products: invoiceProducts.map((p) => ({
        productId: p._id,
        quantity: p.qty,
      })),
      invoiceDate: new Date(),
    };

    try {
      await dispatch(createInvoice(payload)).unwrap();
      // Show toast for 3 seconds
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      // Reset form
      setCustomerName("");
      setCustomerPhone("");
      setInvoiceProducts([]);
      setSearchTerm("");
      setErrors({});
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex gap-6 relative">
      {/* Left: Invoice Form */}
      <div className="flex-1 p-4 overflow-auto">
        <h2 className="text-2xl font-bold mb-6">Create Invoice</h2>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="border p-2 rounded w-full"
            />
            {errors.customerName && (
              <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Customer Phone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="border p-2 rounded w-full"
            />
            {errors.customerPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
            )}
          </div>
        </div>

        {/* Invoice Products */}
        <table className="w-full border mb-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoiceProducts.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No products added.
                </td>
              </tr>
            )}
            {invoiceProducts.map((prod) => (
              <tr key={prod._id}>
                <td className="border p-2">{prod.name}</td>
                <td className="border p-2">₹{prod.price}</td>
                <td className="border p-2 flex items-center space-x-2 justify-center">
                  <button
                    onClick={() => handleQtyChange(prod._id, -1)}
                    className="bg-gray-300 px-2 rounded hover:bg-gray-400"
                  >
                    -
                  </button>
                  <span>{prod.qty}</span>
                  <button
                    onClick={() => handleQtyChange(prod._id, 1)}
                    className="bg-gray-300 px-2 rounded hover:bg-gray-400"
                  >
                    +
                  </button>
                </td>
                <td className="border p-2">₹{totalPerProduct(prod.price, prod.qty)}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleRemoveProduct(prod._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {errors.products && (
          <p className="text-red-500 text-sm mb-2">{errors.products}</p>
        )}
        <div className="text-right mb-4 font-semibold text-lg">
          Grand Total: ₹{grandTotal}
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={createLoading}
        >
          {createLoading ? "Saving..." : "Save Invoice"}
        </button>
      </div>

      {/* Right: Available Products */}
      <div className="w-1/3 p-4 border-l border-gray-200 overflow-auto max-h-[calc(100vh-100px)]">
        <h3 className="text-xl font-semibold mb-4">Available Products</h3>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        {productsLoading ? (
          <Spinner />
        ) : filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <ul className="space-y-2">
            {filteredProducts.map((prod) => (
              <li
                key={prod._id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <div>
                  <p className="font-medium">{prod.name}</p>
                  <p className="text-gray-500 text-sm">
                    ₹{parseFloat(prod.price).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleAddProduct(prod)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  + Add
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Toast / Modal */}
    {showToast && (
  <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
    <div className="bg-green-600 text-white px-6 py-3 rounded shadow-lg pointer-events-auto animate-fade-in">
      Invoice created successfully!
    </div>
  </div>
)}
    </div>
  );
}

