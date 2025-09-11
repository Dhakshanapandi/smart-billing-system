import Invoice from "../models/Invoice.js";
import User from "../models/User.js";
export const getDashboardReport = async (req, res) => {
  try {
    // Run all queries in parallel for speed
    const [
      totalSales,
      totalInvoices,
      totalCustomers,
      salesByStaff,
      topProducts,
      dailySales,
      totalStaff,
    ] = await Promise.all([
      // 1. Total Sales
      Invoice.aggregate([
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),

      // 2. Total Invoices
      Invoice.countDocuments(),

      // 3. Total Customers (unique)
      Invoice.distinct("customerMobile"),

      // 4. Sales by Staff
      Invoice.aggregate([
        {
          $group: {
            _id: "$staffId",
            totalSales: { $sum: "$totalAmount" },
            invoiceCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "staff",
          },
        },
        { $unwind: "$staff" },
        {
          $project: {
            staffName: "$staff.name",
            staffEmail: "$staff.email",
            totalSales: 1,
            invoiceCount: 1,
          },
        },
      ]),

      // 5. Top Products
      Invoice.aggregate([
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.productId",
            name: { $first: "$products.name" },
            code: { $first: "$products.code" },
            totalSold: { $sum: "$products.quantity" },
            revenue: {
              $sum: { $multiply: ["$products.price", "$products.quantity"] },
            },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
      ]),

      // 6. Daily Sales Trend
      Invoice.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$invoiceDate" },
            },
            total: { $sum: "$totalAmount" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      // 7 total staff
      User.countDocuments({ role: "staff" }),
    ]);

    // Send response
    res.json({
      totalSales: totalSales[0]?.total || 0,
      totalInvoices,
      totalCustomers: totalCustomers.length,
      salesByStaff,
      topProducts,
      dailySales,
      totalStaff,
    });
  } catch (error) {
    console.error("Dashboard report error:", error);
    res.status(500).json({ message: "Error fetching dashboard report" });
  }
};
