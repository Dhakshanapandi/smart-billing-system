import Invoice from "../models/Invoice.js";
import mongoose from "mongoose";

// daily report by date string YYYY-MM-DD
export const dailyReport = async (req, res) => {
  console.log("daily repost called");

  try {
    const { date } = req.query; // expected like 2025-09-08
    if (!date)
      return res
        .status(400)
        .json({ message: "date query required e.g. ?date=YYYY-MM-DD" });

    const start = new Date(date + "T00:00:00.000Z");
    const end = new Date(date + "T23:59:59.999Z");

    const invoices = await Invoice.find({
      invoiceDate: { $gte: start, $lte: end },
    });
    const totalSales = invoices.reduce((s, i) => s + i.totalAmount, 0);
    console.log(invoices);

    res.json({ date, totalSales, count: invoices.length, invoices });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// range report ?from=YYYY-MM-DD&to=YYYY-MM-DD
export const rangeReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to)
      return res.status(400).json({ message: "from and to required" });
    const start = new Date(from + "T00:00:00.000Z");
    const end = new Date(to + "T23:59:59.999Z");
    const invoices = await Invoice.find({
      invoiceDate: { $gte: start, $lte: end },
    });
    const totalSales = invoices.reduce((s, i) => s + i.totalAmount, 0);
    res.json({ from, to, totalSales, count: invoices.length, invoices });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
