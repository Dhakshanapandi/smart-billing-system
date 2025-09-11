import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
    const { name, code, price } = req.body;
    if (!name || !code || price == null)
      return res.status(400).json({ message: "name, code, price required" });
    const exists = await Product.findOne({ code });
    if (exists)
      return res.status(400).json({ message: "Product code already used" });
    const p = await Product.create({
      name,
      code,
      price,
      createdBy: req.user._id,
    });
    res.status(201).json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, code, price } = req.body;

    if (name) product.name = name;
    if (code) product.code = code;
    if (price != null) product.price = price;

    await product.save();
    res.json(product);
  } catch (err) {
    // Handle duplicate key error for 'code'
    if (err.code === 11000 && err.keyPattern && err.keyPattern.code) {
      return res.status(400).json({ message: "Product code already used" });
    }
    res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
