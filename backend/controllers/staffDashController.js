// controllers/staffController.js
import Invoice from "../models/Invoice.js";

export const getStaffDashboardReport = async (req, res) => {
  try {
    const staffId = req.user._id; // Logged-in staff

    // Run queries in parallel
    const [totalSalesAgg, totalInvoices, totalCustomers] = await Promise.all([
      // 1. Total Sales for this staff
      Invoice.aggregate([
        { $match: { staffId } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),

      // 2. Total invoices by this staff
      Invoice.countDocuments({ staffId }),

      // 3. Total unique customers handled by this staff
      Invoice.distinct("customerMobile", { staffId }),
    ]);

    res.json({
      totalSales: totalSalesAgg[0]?.total || 0,
      totalInvoices,
      totalCustomers: totalCustomers.length,
    });
  } catch (error) {
    console.error("Staff dashboard error:", error);
    res.status(500).json({ message: "Error fetching staff dashboard report" });
  }
};
