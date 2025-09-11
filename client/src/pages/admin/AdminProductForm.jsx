import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, editProduct, fetchProducts } from "../../redux/productSlice.js";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.list);
  const product = products.find((p) => p._id === id);

  const [name, setName] = useState(product ? product.name : "");
  const [price, setPrice] = useState(product ? product.price : "");
  const [code, setCode] = useState(product ? product.code : "");
  const [error, setError] = useState(""); // ✅ local error state

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
    setError(""); // clear previous error

    if (!name.trim() || !code || price <= 0) {
      setError("Please fill all fields correctly. Price must be greater than 0.");
      return;
    }

    try {
      if (id) {
        await dispatch(editProduct({ id, data: { name, price, code } })).unwrap();
      } else {
        await dispatch(addProduct({ name, price, code })).unwrap();
      }
      navigate("/admin/products");
    } catch (err) {
      // ✅ Catch backend error from rejectWithValue
      setError(err || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-md shadow-sm">
      <h1 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        {id ? "Edit Product" : "Add Product"}
      </h1>

      {error && (
        <div className="mb-4 p-2 text-sm text-red-700 bg-red-100 border border-red-300 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
            placeholder="Enter product name"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
            placeholder="Enter price"
            required
            min="0.01"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Product Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
            placeholder="Enter product code"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-150"
        >
          {id ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
}
