import React from "react";

function TablePreview({ title, rows }) {
  const cols = rows?.length ? Object.keys(rows[0]) : [];

  return (
    <div style={styles.panel}>
      <div style={styles.panelHeader}>
        <h3 style={{ margin: 0, fontSize: 15 }}>{title}</h3>
        <span style={styles.badge}>{rows.length}</span>
      </div>

      {rows.length === 0 ? (
        <div style={styles.empty}>No rows</div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {cols.slice(0, 8).map((c) => (
                  <th key={c} style={styles.th}>{c}</th>
                ))}
                {cols.length > 8 && <th style={styles.th}>…</th>}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 10).map((r, idx) => (
                <tr key={idx}>
                  {cols.slice(0, 8).map((c) => (
                    <td key={c} style={styles.td}>{String(r[c] ?? "")}</td>
                  ))}
                  {cols.length > 8 && <td style={styles.td}>…</td>}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={styles.note}>Preview shows first 10 rows and first 8 columns.</div>
        </div>
      )}
    </div>
  );
}

export default function ResultsPanel({ onlyInA, onlyInB }) {
  return (
    <div style={styles.grid}>
      <TablePreview title="rows only in file a" rows={onlyInA} />
      <TablePreview title="rows only in file b" rows={onlyInB} />
    </div>
  );
}

const styles = {
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  panel: {
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 14,
    background: "white",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  },
  panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  badge: {
    border: "1px solid #e5e7eb",
    borderRadius: 999,
    padding: "4px 10px",
    fontSize: 12,
    color: "#111827",
    background: "#f9fafb",
  },
  empty: { marginTop: 12, color: "#6b7280", fontSize: 13 },
  tableWrap: { marginTop: 12, overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 12 },
  th: { textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: 8, color: "#111827" },
  td: { borderBottom: "1px solid #f3f4f6", padding: 8, color: "#374151" },
  note: { marginTop: 8, fontSize: 12, color: "#6b7280" },
};