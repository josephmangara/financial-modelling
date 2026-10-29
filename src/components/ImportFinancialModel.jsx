
import { useState } from "react";
import { importFinancialModel } from "../utils/importFinancialModel";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);

export default function ImportFinancialModel({ model, onImport }) {
  const [parsedModel, setParsedModel] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];

    setParsedModel(null);
    setFileName("");
    setError("");

    if (!file) return;

    setLoading(true);

    try {
      const imported = await importFinancialModel(file, model);

      setParsedModel(imported);
      setFileName(file.name);
    } catch (err) {
      setError(err.message || "Unable to import this workbook.");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  }

  function handleImport() {
    if (!parsedModel) return;

    onImport(parsedModel);
    setParsedModel(null);
    setFileName("");
    setError("");
  }

  return (
    <section className="rounded-xl border border-(--border) p-5">
      <div className="mb-4">
        <h2 className="font-semibold">Import financial model</h2>
        <p className="mt-1 text-sm text-(--muted)">
          Upload your Excel workbook to populate the dashboard.
        </p>
      </div>

      <label className="block text-sm font-medium">
        Excel workbook
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          disabled={loading}
          className="mt-2 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-(--surface) file:px-4 file:py-2 file:font-medium file:text-(--text) hover:file:opacity-80"
        />
      </label>

      {loading && (
        <p className="mt-3 text-sm text-(--muted)">
          Reading workbook...
        </p>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-500">
          {error}
        </p>
      )}

      {parsedModel && (
        <div className="mt-5 space-y-4">
          <div className="rounded-lg bg-(--surface) p-4">
            <p className="text-sm font-medium">{fileName}</p>
            <p className="mt-1 text-sm text-(--muted)">
              Workbook recognized. Review the imported values below.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-(--muted)">Opening cash</p>
                <p className="mt-1 font-medium">
                  {formatCurrency(parsedModel.opening.cash)}
                </p>
              </div>

              <div>
                <p className="text-xs text-(--muted)">January new customers</p>
                <p className="mt-1 font-medium">
                  {parsedModel.newCustomers[0]}
                </p>
              </div>

              <div>
                <p className="text-xs text-(--muted)">December new customers</p>
                <p className="mt-1 font-medium">
                  {parsedModel.newCustomers[11]}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleImport}
              className="rounded-md bg-(--accent) px-4 py-2 text-sm font-medium text-black"
            >
              Apply imported model
            </button>

            <button
              type="button"
              onClick={() => {
                setParsedModel(null);
                setFileName("");
                setError("");
              }}
              className="rounded-md border border-(--border) px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
