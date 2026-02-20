import React, { useMemo, useState } from "react";

export default function PaginatedResults({ rows }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, safePage, pageSize]);

  const columns = useMemo(() => {
    if (!pageRows.length) return [];
    const keys = Object.keys(pageRows[0]);
    return keys.includes("__source")
      ? ["__source", ...keys.filter((k) => k !== "__source")]
      : keys;
  }, [pageRows]);

  const go = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900">
            rows not common between files
          </h3>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700">
            {total}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="font-medium">page size</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-slate-200"
          >
            {[10, 25, 50, 100, 200].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {total === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          no non-common rows found.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full text-xs">
              <thead className="bg-slate-50">
                <tr>
                  {columns.map((c) => (
                    <th
                      key={c}
                      className="whitespace-nowrap border-b border-slate-200 px-3 py-2 text-left font-semibold text-slate-800"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    {columns.map((c) => (
                      <td
                        key={c}
                        className="whitespace-nowrap border-b border-slate-100 px-3 py-2 text-slate-700"
                      >
                        {String(r?.[c] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => go(1)}
              disabled={safePage === 1}
              type="button"
            >
              first
            </button>
            <button
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => go(safePage - 1)}
              disabled={safePage === 1}
              type="button"
            >
              prev
            </button>

            <div className="text-xs text-slate-700">
              page <b>{safePage}</b> of <b>{totalPages}</b>
            </div>

            <button
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => go(safePage + 1)}
              disabled={safePage === totalPages}
              type="button"
            >
              next
            </button>
            <button
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => go(totalPages)}
              disabled={safePage === totalPages}
              type="button"
            >
              last
            </button>
          </div>
        </>
      )}
    </div>
  );
}