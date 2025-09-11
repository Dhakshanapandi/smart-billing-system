import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, deleteProduct } from "../../redux/productSlice.js";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import Spinner from "../../components/Spinner.jsx";

export default function StaffProducts() {
  const dispatch = useDispatch();
  const { list: products, loading } = useSelector((state) => state.products);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      dispatch(deleteProduct(deleteId));
      setShowModal(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setDeleteId(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
        <Link
          to="/staff/products/add"
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <FiPlus className="mr-2" />
          Add Product
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name"
          className="w-full border p-2 rounded"
        />
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow border border-gray-200">
          <table className="min-w-full table-auto text-sm text-gray-700">
            <thead className="bg-blue-50 text-gray-700">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Price (INR)</th>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p, index) => (
                  <tr
                    key={p._id}
                    className={
                      index % 2 === 0
                        ? "bg-white hover:bg-gray-50"
                        : "bg-gray-50 hover:bg-gray-100"
                    }
                  >
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">₹{parseFloat(p.price).toFixed(2)}</td>
                    <td className="p-3">{p.code}</td>
                    <td className="p-3 text-center">
                      <div className="inline-flex items-center space-x-3">
                        <Link
                          to={`/staff/products/edit/${p._id}`}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(p._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Delete Product</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button onClick={cancelDelete} className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
