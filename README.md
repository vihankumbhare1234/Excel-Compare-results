# Excel Compare Results

A small React + Vite web app to compare Excel files and view differences in a clear, paginated UI.

Key features
- Upload two Excel files (XLSX/CSV)
- Select which columns to compare
- View added, removed, and changed rows in a paginated results panel
- Export comparison results

Quick demo
1. Open the app (`npm run dev`) and navigate to the local server.
2. Use the file card to upload two spreadsheets.
3. Pick columns to compare and review the differences in the results panel.

Getting started

Prerequisites
- Node.js 16+ and npm (or yarn)

Install

```bash
git clone https://github.com/vihankumbhare1234/Excel-Compare-results.git
cd Excel-Compare-results
npm install
```

Run (development)

```bash
npm run dev
```

Build (production)

```bash
npm run build
```

Usage
- Open the app in your browser (the dev server URL is shown by Vite).
- On the main screen use the file upload card to add the two files you want to compare.
- Select columns with the `ColumnSelector` if you only want to compare specific fields.
- Results appear in the `ResultsPanel` with pagination and export options.

Project structure (key files)
- `src/components/FileUploadCard.jsx` — file upload UI and validation
- `src/components/ColumnSelector.jsx` — choose columns to compare
- `src/components/ResultsPanel.jsx` — shows comparison output and controls
- `src/components/PaginatedResults.jsx` — handles pagination of results
- `src/utils/excel.js` — helpers for reading Excel/CSV files
- `src/utils/compare.js` — comparison logic (core algorithm)

Notes
- The app is intentionally lightweight and client-side: Excel parsing and comparison are performed in the browser.
- For very large files, browser memory limits may apply; consider a server-side approach for huge datasets.