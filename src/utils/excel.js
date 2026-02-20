import * as XLSX from "xlsx";

export async function readExcelFile(file) {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return { rows: [], headers: [] };

  const worksheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json(worksheet, {
    defval: "",
    raw: false,
    dateNF: "yyyy-mm-dd",
  });

  let headers = [];
  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:A1");
  const firstRow = range.s.r;

  for (let c = range.s.c; c <= range.e.c; c++) {
    const cell = worksheet[XLSX.utils.encode_cell({ r: firstRow, c })];
    const v = cell?.v;
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      headers.push(String(v).trim());
    }
  }

  if (headers.length === 0) {
    const set = new Set();
    rows.forEach((r) => Object.keys(r).forEach((k) => set.add(k)));
    headers = Array.from(set);
  }

  return { rows, headers };
}

/**
 * Export ONE sheet: not_common_rows
 */
export function exportNotCommonToExcel(notCommonRows, filename = "not_common_rows.xlsx") {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(notCommonRows);
  XLSX.utils.book_append_sheet(wb, ws, "not_common_rows");
  XLSX.writeFile(wb, filename);
}