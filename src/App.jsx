import React, { useEffect, useMemo, useState } from "react";
import FileUploadCard from "./components/FileUploadCard.jsx";
import ColumnSelector from "./components/ColumnSelector.jsx";
import PaginatedResults from "./components/PaginatedResults.jsx";
import { readExcelFile, exportNotCommonToExcel } from "./utils/excel.js";
import { compareNotCommon } from "./utils/compare.js";
// Main App Component
export default function App() {
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);

  const [dataA, setDataA] = useState({ rows: [], headers: [] });
  const [dataB, setDataB] = useState({ rows: [], headers: [] });

  const [selectedCols, setSelectedCols] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notCommonRows, setNotCommonRows] = useState([]);

  // Load File A
  useEffect(() => {
    let cancelled = false;

    async function loadA() {
      if (!fileA) {
        setDataA({ rows: [], headers: [] });
        return;
      }
      setLoading(true);
      try {
        const res = await readExcelFile(fileA);
        if (!cancelled) setDataA(res);
      } catch (e) {
        if (!cancelled) setError("failed to read file a");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadA();
    return () => {
      cancelled = true;
    };
  }, [fileA]);

  // Load File B
  useEffect(() => {
    let cancelled = false;

    async function loadB() {
      if (!fileB) {
        setDataB({ rows: [], headers: [] });
        return;
      }
      setLoading(true);
      try {
        const res = await readExcelFile(fileB);
        if (!cancelled) setDataB(res);
      } catch (e) {
        if (!cancelled) setError("failed to read file b");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadB();
    return () => {
      cancelled = true;
    };
  }, [fileB]);

  // Common headers
  const commonHeaders = useMemo(() => {
    const setA = new Set(dataA.headers);
    return dataB.headers.filter((h) => setA.has(h));
  }, [dataA.headers, dataB.headers]);

  useEffect(() => {
    setSelectedCols((prev) =>
      prev.filter((col) => commonHeaders.includes(col))
    );
  }, [commonHeaders]);

  const canCompare =
    dataA.rows.length > 0 &&
    dataB.rows.length > 0 &&
    selectedCols.length > 0 &&
    !loading;

  const handleCompare = () => {
    if (!canCompare) return;
    const result = compareNotCommon(
      dataA.rows,
      dataB.rows,
      selectedCols
    );
    setNotCommonRows(result);
  };

  const handleExport = () => {
    if (notCommonRows.length === 0) return;
    exportNotCommonToExcel(notCommonRows);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Excel File Comparer
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Upload two excel files → choose columns → view rows not common.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold mb-3">File A</h2>
            <FileUploadCard
              file={fileA}
              onChange={(f) => {
                setFileA(f);
                setNotCommonRows([]);
              }}
            />
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold mb-3">File B</h2>
            <FileUploadCard
              file={fileB}
              onChange={(f) => {
                setFileB(f);
                setNotCommonRows([]);
              }}
            />
          </div>
        </div>

        {/* Column Selector */}
        <ColumnSelector
          headers={commonHeaders}
          selected={selectedCols}
          setSelected={setSelectedCols}
        />

        {/* Error / Loading */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700">
            reading excel...
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCompare}
            disabled={!canCompare}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition
              ${
                canCompare
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "bg-slate-200 text-slate-500 cursor-not-allowed"
              }`}
          >
            Compare
          </button>

          <button
            onClick={handleExport}
            disabled={notCommonRows.length === 0}
            className={`rounded-xl px-4 py-2 text-sm font-semibold border
              ${
                notCommonRows.length > 0
                  ? "bg-white text-slate-900 border-slate-200 hover:bg-slate-50"
                  : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
              }`}
          >
            Export Excel
          </button>

          <div className="ml-auto text-sm text-slate-700">
            Not common rows:{" "}
            <span className="font-semibold">
              {notCommonRows.length}
            </span>
          </div>
        </div>

        {/* Results */}
        <PaginatedResults rows={notCommonRows} />
      </div>
    </div>
  );
}