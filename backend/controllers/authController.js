import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const genToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const login = async (req, res) => {
  console.log("login called");
  
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: genToken(user._id, user.role),
      });
    }
    return res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Optional one-time admin creation for first run
export const createAdminIfNotExists = async (req, res) => {
  try {
    console.log(req.body);

    const admin = await User.findOne({ role: "admin" });
    if (admin) return res.json({ message: "Admin exists" });
    const {
      name = "Admin",
      email = "admin@example.com",
      password = "admin123",
    } = req.body || {};
    const newAdmin = await User.create({
      name,
      email,
      password,
      role: "admin",
    });
    res.json({
      message: "Admin created",
      admin: { _id: newAdmin._id, email: newAdmin.email },
    });
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ message: err.message });
  }
};
