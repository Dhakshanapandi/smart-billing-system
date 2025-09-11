import User from "../models/User.js";

// Admin-only: create staff

export const createStaff = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Name, email, password required" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already used" });
    const staff = await User.create({ name, email, password, role: "staff" });
    res.status(201).json({
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: "staff" }).select("-password");
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const staff = await User.findById(id);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    // Update only provided fields
    if (name) staff.name = name;
    if (email) staff.email = email;
    if (password) staff.password = password; // pre-save hook will hash

    await staff.save();

    res.json({
      message: "Updated",
      staff: {
        _id: staff._id,
        name: staff.name,
        email: staff.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await User.findById(id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    await staff.deleteOne(); // <-- use deleteOne instead of remove
    return res.status(200).json({ message: "Staff deleted" });
  } catch (err) {
    console.log("err called", err);
    res.status(500).json({ message: err.message });
  }
};
