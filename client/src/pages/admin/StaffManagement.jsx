// src/pages/admin/StaffManagement.jsx
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchStaff, deleteStaff } from "../../redux/staffSlics";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import Spinner from "../../components/Spinner";

export default function StaffManagement() {
  const dispatch = useDispatch();
  const { list: staffList, loading } = useSelector((state) => state.staff);

  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      dispatch(deleteStaff(deleteId));
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
        <h1 className="text-2xl font-semibold text-gray-800">Staff Management</h1>
        <Link
          to="/admin/staff/add"
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <FiPlus className="mr-2" />
          Add Staff
        </Link>
      </div>

      {loading ? <Spinner/> : (
        <div className="overflow-x-auto bg-white rounded shadow border border-gray-200">
          <table className="min-w-full table-auto text-sm text-gray-700">
            <thead className="bg-blue-50 text-gray-700">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No staff available.
                  </td>
                </tr>
              ) : (
                staffList.map((staff, index) => (
                  <tr
                    key={staff._id}
                    className={index % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100"}
                  >
                    <td className="p-3">{staff.name}</td>
                    <td className="p-3">{staff.email}</td>
                    <td className="p-3">{staff.role}</td>
                    <td className="p-3 text-center">
                      <div className="inline-flex items-center space-x-3">
                        <Link
                          to={`/admin/staff/edit/${staff._id}`}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(staff._id)}
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

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Delete Staff</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this staff member? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
