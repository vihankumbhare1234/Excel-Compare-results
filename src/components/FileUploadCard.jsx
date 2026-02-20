import React from "react";

export default function FileUploadCard({ file, onChange }) {
  return (
    <div className="space-y-3">
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        className="block w-full text-sm text-slate-700
                   file:mr-4 file:rounded-xl file:border-0
                   file:bg-slate-900 file:px-4 file:py-2
                   file:text-sm file:font-semibold file:text-white
                   hover:file:bg-slate-800"
      />

      <div className="text-xs text-slate-600">
        <span className="font-semibold">selected:</span>{" "}
        {file ? file.name : "none"}
      </div>
    </div>
  );
}