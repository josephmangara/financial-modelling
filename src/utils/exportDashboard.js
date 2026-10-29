
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const FINANCIAL_METRICS = [
  ["Revenue", "revenue"],
  ["Cost of Revenue", "costOfRevenue"],
  ["Gross Profit", "grossProfit"],
  ["Gross Margin", "grossMargin"],
  ["Payroll", "payroll"],
  ["Depreciation", "depreciation"],
  ["Operating Costs", "operatingCosts"],
  ["Total Operating Expenses", "totalOperatingExpenses"],
  ["Operating Income", "operatingIncome"],
  ["Net Income", "netIncome"],
  ["Closing Cash", "closingCash"],
  ["Accounts Receivable", "accountsReceivable"],
  ["Accounts Payable", "accountsPayable"],
  ["Fixed Assets", "fixedAssets"],
  ["Total Assets", "totalAssets"],
  ["Total Liabilities", "totalLiabilities"],
  ["Total Equity", "totalEquity"],
  ["Balance Check", "balanceCheck"],
  ["Months of Runway", "monthsOfRunway"],
];

function getChartElements() {
  return Array.from(
    document.querySelectorAll("[data-export-chart]")
  );
}

function getChartName(element, index) {
  return (
    element.dataset.exportChart ||
    `Chart ${index + 1}`
  );
}

async function captureCharts() {
  const elements = getChartElements();

  if (!elements.length) {
    throw new Error(
      "No exportable charts found. Add data-export-chart to each chart container."
    );
  }

  const charts = [];

  for (const [index, element] of elements.entries()) {
    const dataUrl = await toPng(element, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#ffffff",
    });

    charts.push({
      name: getChartName(element, index),
      dataUrl,
    });
  }

  return charts;
}

function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

function safeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function exportDashboardCharts() {
  const charts = await captureCharts();

  charts.forEach((chart) => {
    downloadDataUrl(
      chart.dataUrl,
      `${safeFilename(chart.name)}.png`
    );
  });
}

function formatValue(value, metric) {
  if (value == null || value === "") return "—";

  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);

  if (metric === "grossMargin") {
    return `${(number * 100).toFixed(1)}%`;
  }

  if (metric === "monthsOfRunway") {
    return number.toFixed(1);
  }

  return number.toLocaleString("en-KE", {
    maximumFractionDigits: 2,
  });
}

export async function exportFinancialReportPdf(results) {
  const charts = await captureCharts();

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Cover heading
  pdf.setFontSize(20);
  pdf.text("Financial Model Report", 14, 18);

  pdf.setFontSize(10);
  pdf.text(
    `Generated: ${new Date().toLocaleDateString()}`,
    14,
    25
  );

  // Add each dashboard chart to its own page
  for (const chart of charts) {
    pdf.addPage();

    pdf.setFontSize(15);
    pdf.text(chart.name, 14, 18);

    const image = new Image();
    image.src = chart.dataUrl;

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    const margin = 14;
    const maxWidth = 297 - margin * 2;
    const maxHeight = 210 - 36;
    const ratio = Math.min(
      maxWidth / image.width,
      maxHeight / image.height
    );

    const width = image.width * ratio;
    const height = image.height * ratio;

    pdf.addImage(
      chart.dataUrl,
      "PNG",
      (297 - width) / 2,
      26,
      width,
      height
    );
  }

  // Financial results table
  pdf.addPage();

  pdf.setFontSize(16);
  pdf.text("Financial Results", 14, 18);

  const months = results.map(
    (_, index) => MONTHS[index] || `Month ${index + 1}`
  );

  const body = FINANCIAL_METRICS.map(([label, key]) => [
    label,
    ...results.map((month) => formatValue(month[key], key)),
  ]);

  autoTable(pdf, {
    startY: 25,
    head: [["Metric", ...months]],
    body,
    theme: "grid",
    styles: {
      fontSize: 7,
      cellPadding: 2,
      overflow: "linebreak",
    },
    headStyles: {
      fontSize: 7,
    },
    columnStyles: {
      0: { cellWidth: 42 },
    },
    margin: {
      left: 10,
      right: 10,
    },
  });

  pdf.save("financial-model-report.pdf");
}
