# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
# Finance Tracker UI

A React frontend for the Finance Tracker application. Allows users to track income, expenses, and budgets with a clean dashboard and charts.

## Live URL
https://finance-tracker-ui-mauve.vercel.app

## Tech Stack
- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Charts:** Chart.js + react-chartjs-2
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Deployment:** Vercel

## Features
- User registration with Full Name, Phone, Email and Password
- JWT-based login with persistent session
- Dashboard with income, expenses and balance summary
- Doughnut chart for expenses by category
- Bar chart for last 7 days activity
- Add and delete transactions
- Smart category filter — categories change based on income or expense selection
- Budget tracker with progress bars and over-budget alerts
- Logout confirmation modal
- All amounts displayed in Ugandan Shillings (UGX)

## Project Structure
src/
├── components/
│   └── Navbar.jsx
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Transactions.jsx
│   └── Budgets.jsx
├── services/
│   └── api.js
├── App.jsx
└── main.jsx

## Getting Started

### Prerequisites
- Node.js v20+
- Finance Tracker API running (local or Railway)

### Installation
```bash
# Clone the repository
git clone https://github.com/Rollingsl/finance-tracker-ui.git

# Navigate into the project
cd finance-tracker-ui

# Install dependencies
npm install

# Start the development server
npm run dev
```

### API Configuration
Open `src/services/api.js` and update the `baseURL` to point to your backend:

```js
const api = axios.create({
  baseURL: 'https://your-api-url.up.railway.app/api',
});
```

### Build for Production
```bash
npm run build
```

## Pages
| Route | Page | Auth Required |
|-------|------|---------------|
| /login | Login | No |
| /register | Register | No |
| / | Dashboard | Yes |
| /transactions | Transactions | Yes |
| /budgets | Budgets | Yes |
