import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, editProduct, fetchProducts } from "../../redux/productSlice.js";
import { useNavigate, useParams } from "react-router-dom";

export default function StaffProductForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.list);
  const product = products.find((p) => p._id === id);

  const [name, setName] = useState(product ? product.name : "");
  const [price, setPrice] = useState(product ? product.price : "");
  const [code, setCode] = useState(product ? product.code : "");
  const [error, setError] = useState(""); // For inline error

  useEffect(() => {
    if (!product && id) {
      dispatch(fetchProducts());
    }
  }, [dispatch, id, product]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setCode(product.code);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error

    if (!name.trim() || !code || price <= 0) {
      setError("Please fill all fields correctly. Price must be greater than 0.");
      return;
    }

    try {
      if (id) {
        // Edit product
        await dispatch(editProduct({ id, data: { name, price, code } })).unwrap();
      } else {
        // Add new product
        await dispatch(addProduct({ name, price, code })).unwrap();
      }

      navigate("/staff/products"); // Navigate after success
    } catch (err) {
      // Show server error inline
      setError(err || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-gradient-to-tr from-white via-gray-100 to-white border border-gray-200 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {id ? "Edit Product" : "Add Product"}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Enter product name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Enter price"
            required
            min="0.01"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Enter product code"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
        >
          {id ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
}
