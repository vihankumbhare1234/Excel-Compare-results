import React, { useMemo, useState } from "react";

export default function ColumnSelector({ headers, selected, setSelected }) {
  const [query, setQuery] = useState("");

  const filteredHeaders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return headers;
    return headers.filter((h) => String(h).toLowerCase().includes(q));
  }, [headers, query]);

  const toggle = (h) => {
    if (selected.includes(h)) setSelected(selected.filter((x) => x !== h));
    else setSelected([...selected, h]);
  };

  const selectAllVisible = () => {
    const visible = filteredHeaders;
    const set = new Set(selected);
    visible.forEach((h) => set.add(h));
    setSelected(Array.from(set));
  };

  const clearAll = () => setSelected([]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              select columns to compare
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              these columns form a <b>composite key</b> to match rows.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={selectAllVisible}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
            >
              select all (visible)
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
            >
              clear
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative w-full md:max-w-sm">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search columns…"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="text-xs text-slate-600">
            selected: <b>{selected.length}</b> • showing:{" "}
            <b>{filteredHeaders.length}</b>
          </div>
        </div>

        {headers.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            upload both files to see common columns.
          </div>
        ) : filteredHeaders.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            no columns match your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredHeaders.map((h) => (
              <label
                key={h}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm cursor-pointer
                  ${
                    selected.includes(h)
                      ? "border-slate-900 bg-slate-50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(h)}
                  onChange={() => toggle(h)}
                  className="h-4 w-4"
                />
                <span className="truncate">{h}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}