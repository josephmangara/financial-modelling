# Interactive Financial Modelling Dashboard

A client-side financial modelling application that translates Excel-based financial models into interactive web components using JavaScript and React. The project allows users to adjust financial assumptions, generate projections, visualize results, and compare different business scenarios.

## Features

- **Interactive assumptions:** Adjust customer acquisition, revenue per customer, churn rate, gross margin, staffing, and operating costs.
- **Financial calculations:** Calculate monthly revenue, expenses, profit, cash flow, and balance sheet projections using JavaScript modules.
- **Financial dashboard:** Display key performance indicators (KPIs) and visualize monthly financial performance.
- **Scenario comparison:** Compare base, optimistic, and pessimistic financial projections.
- **Unit testing:** Use Vitest to test the financial calculation engine.
- **Client-side architecture:** Run calculations directly in the browser without a separate backend or database.

## Tech Stack

- React
- Vite
- JavaScript (ES Modules)
- Tailwind CSS
- Recharts
- Vitest
- xlsx
- html-to-image
- jspdf

## Getting Started

### Prerequisites

Install [Node.js](https://nodejs.org/) and npm. npm is included with Node.js.

Verify your installations:

```
node -v
npm -v
```

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/josephmangara/financial-modelling
   ```

2. Navigate into the project directory:

   ```
   cd financial-modelling
   ```

3. Install the project dependencies:

   ```
   npm install
   ```

4. If the dependencies have not already been installed, install Recharts and Vitest and the following xlsx and export libraries:

   ```
   npm install recharts
   npm install -D vitest
   npm install xlsx html-to-image jspdf jspdf-autotable
   ```

### Running the Development Server

Start the Vite development server:

```
npm run dev
```

Open the local URL printed in the terminal, usually `http://localhost:5173/`.

Vite provides hot module replacement, allowing changes to the source files to appear in the browser during development.

### Running Tests

Run the Vitest test suite:

```
npm test
```

To run tests once without entering watch mode:

```
npx vitest run
```

The tests cover the financial calculation engine, including monthly projections and financial consistency checks.

## Project Structure

```
src/
├── calculations/
│   ├── revenue.js
│   ├── expenses.js
│   ├── profit.js
│   └── financialModel.js
├── components/
│   ├── AssumptionsPanel.jsx
│   ├── FinancialCharts.jsx
│   ├── FinancialKPIs.jsx
│   └── ScenarioComparison.jsx
├── data/
│   └── defaultModel.js
├── tests/
│   └── financialModel.test.js
├── App.jsx
├── main.jsx
└── index.css
```

## How It Works

1. Default financial assumptions are defined in JavaScript.
2. The calculation modules process the assumptions to generate monthly financial projections.
3. React components display the calculated results through KPI cards, charts, and tables.
4. Users modify assumptions through the interface, triggering recalculation and updating the displayed projections.
5. Scenario comparison applies alternative assumptions to separate copies of the model to illustrate potential outcomes.

## Architecture

The application uses a client-side architecture. Financial calculations are performed in JavaScript, and React manages the user interface and application state.

No backend, API server, or database is required.

User changes currently exist in application state and are not automatically synchronized across devices. Persistent storage can be added separately if required.

## Development Notes

- Keep financial calculations in the `calculations/` directory, separate from React components.
- Write unit tests for new calculation functions and important edge cases.
- Keep default assumptions in `data/defaultModel.js`.
- Use the existing calculation engine when adding new dashboard features.
- Treat projections as estimates based on the model's assumptions, not as financial advice.
- The application is a learning and development project for exploring financial modelling, JavaScript calculations, data visualization, and interactive user interfaces.

## License

This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/).

Copyright (c) 2026 Joseph Mang’ara

You are free to share and adapt this material for non-commercial purposes, provided appropriate credit is given and any changes are indicated. Commercial use is not permitted under this license.