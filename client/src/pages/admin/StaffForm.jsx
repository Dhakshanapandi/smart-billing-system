import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addStaff, editStaff, fetchStaff } from "../../redux/staffSlics.js";
import { useNavigate, useParams } from "react-router-dom";

export default function StaffForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const staffList = useSelector((state) => state.staff.list);

  const staff = staffList.find((s) => s._id === id);

  const [name, setName] = useState(staff ? staff.name : "");
  const [email, setEmail] = useState(staff ? staff.email : "");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!staff && id) {
      dispatch(fetchStaff());
    }
  }, [dispatch, id, staff]);

  useEffect(() => {
    if (staff) {
      setName(staff.name);
      setEmail(staff.email);
    }
  }, [staff]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await dispatch(
        editStaff({ id, data: { name, email, password: password || undefined } })
      );
    } else {
      await dispatch(addStaff({ name, email, password }));
    }
    navigate("/admin/staff");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-md shadow-sm">
      <h1 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        {id ? "Edit Staff" : "Add Staff"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
            placeholder="Enter staff name"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
            placeholder="Enter email address"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            {id ? "New Password (leave blank to keep unchanged)" : "Password"}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
            placeholder={id ? "Enter new password" : "Enter password"}
            {...(!id && { required: true })}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-150"
        >
          {id ? "Update Staff" : "Add Staff"}
        </button>
      </form>
    </div>
  );
}
