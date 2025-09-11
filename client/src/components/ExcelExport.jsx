// src/components/ExcelExport.jsx
import * as XLSX from "xlsx";

export default function ExcelExport({ data, fileName = "data.xlsx" }) {
  const exportToExcel = () => {
    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    console.log(data)
    // ✅ If there's a "Date" column, mark it properly
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const header = ws[XLSX.utils.encode_cell({ r: 0, c: C })].v;
      if (header.toLowerCase().includes("invoiceDate")) {
        for (let R = 1; R <= range.e.r; ++R) {
          const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
          if (ws[cellRef]) {
            ws[cellRef].t = "d"; // mark as date type
            ws[cellRef].z = "yyyy-mm-dd"; // date format
          }
        }
      }
    }

    XLSX.writeFile(wb, fileName);
  };

  return (
    <button
      onClick={exportToExcel}
      className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
    >
      Export as Excel
    </button>
  );
}
