import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login/", {
        email,
        password,
      });

      dispatch(
        loginSuccess({ token: res.data.token, role: res.data.role, name: res.data.name })
      );

      navigate(res.data.role === "admin" ? "/admin" : "/staff");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 relative overflow-hidden">
      {/* Optional floating background circles */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-white opacity-10 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white opacity-10 rounded-full animate-pulse"></div>

      {/* Central Card */}
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left: Info */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-b from-blue-600 to-indigo-700 text-white md:w-1/2 p-12">
          <h1 className="text-5xl font-bold mb-4 text-center">Billing App</h1>
          <p className="text-lg mb-8 text-center text-blue-100">
            Efficiently manage your invoices, products, and staff in one place.
          </p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/833/833314.png"
            alt="Billing"
            className="w-64 h-64 opacity-80"
          />
        </div>

        {/* Right: Login Form */}
        <div className="flex-1 p-10 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>
          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition duration-150"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition duration-150"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-150 font-semibold"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
