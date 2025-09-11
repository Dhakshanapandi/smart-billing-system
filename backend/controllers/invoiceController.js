import Invoice from "../models/Invoice.js";
import Product from "../models/Product.js";

// staff creates invoice
export const createInvoice = async (req, res) => {
  try {
    const { customerName, customerMobile, invoiceDate, products } = req.body;
    if (
      !customerName ||
      !customerMobile ||
      !products ||
      products.length === 0
    ) {
      return res.status(400).json({
        message: "customerName, customerMobile, and products required",
      });
    }

    // expand product details
    const detailed = await Promise.all(
      products.map(async (p) => {
        const pr = await Product.findById(p.productId);
        if (!pr) throw new Error(`Product not found: ${p.productId}`);
        return {
          productId: pr._id,
          name: pr.name,
          code: pr.code,
          price: pr.price,
          quantity: p.quantity || 1,
        };
      })
    );

    const totalAmount = detailed.reduce(
      (s, cur) => s + cur.price * cur.quantity,
      0
    );

    const inv = await Invoice.create({
      staffId: req.user._id,
      customerName,
      customerMobile,
      invoiceDate: invoiceDate ? new Date(invoiceDate) : new Date(),
      products: detailed,
      totalAmount,
    });

    res.status(201).json(inv);
  } catch (err) {
    // if thrown from inside Promise.all product not found -> 500
    res.status(500).json({ message: err.message });
  }
};

// list invoices - staff sees own, admin sees all
export const listInvoices = async (req, res) => {
  try {
     
    if (req.user.role === "admin") {
      const all = await Invoice.find()
        .populate("staffId", "name email")
        .sort({ createdAt: -1 });
      return res.json(all);
    }
    const mine = await Invoice.find({ staffId: req.user._id })
      .populate("staffId", "name email")
      .sort({ createdAt: -1 });
    res.json(mine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get single invoice by id - admin can view any, staff only their own
export const getInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const inv = await Invoice.findById(id).populate("staffId", "name email");
    if (!inv) return res.status(404).json({ message: "Invoice not found" });
    if (
      req.user.role !== "admin" &&
      inv.staffId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(inv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
