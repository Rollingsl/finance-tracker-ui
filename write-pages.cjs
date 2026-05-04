const fs = require('fs');

const login = `import { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back</h1>
        <p className="text-gray-500 mb-6">Login to your finance tracker</p>
        {error && <p className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="password" required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          No account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}`;

const register = `import { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Create account</h1>
        <p className="text-gray-500 mb-6">Start tracking your finances today</p>
        {error && <p className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="password" required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}`;

const dashboard = `import { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/transactions/summary'),
      api.get('/transactions'),
    ]).then(([summaryRes, txRes]) => {
      setSummary(summaryRes.data);
      setTransactions(txRes.data);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const doughnutData = {
    labels: Object.keys(expensesByCategory),
    datasets: [{
      data: Object.values(expensesByCategory),
      backgroundColor: ['#3b82f6','#ef4444','#f59e0b','#10b981','#8b5cf6','#ec4899'],
      borderWidth: 0,
    }],
  };

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const incomeByDay = last7Days.map(day =>
    transactions.filter(t => t.type === 'income' && t.date.slice(0, 10) === day)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const expenseByDay = last7Days.map(day =>
    transactions.filter(t => t.type === 'expense' && t.date.slice(0, 10) === day)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const barData = {
    labels: last7Days.map(d => new Date(d).toLocaleDateString('en-UG', { weekday: 'short' })),
    datasets: [
      {
        label: 'Income',
        data: incomeByDay,
        backgroundColor: '#10b981',
        borderRadius: 6,
      },
      {
        label: 'Expenses',
        data: expenseByDay,
        backgroundColor: '#ef4444',
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: {
      y: {
        ticks: {
          callback: (value) => 'UGX ' + value.toLocaleString(),
        },
      },
    },
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <p className="text-sm text-green-600 font-medium">Total Income</p>
          <p className="text-3xl font-bold text-green-700 mt-1">UGX {summary?.income?.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-sm text-red-600 font-medium">Total Expenses</p>
          <p className="text-3xl font-bold text-red-700 mt-1">UGX {summary?.expenses?.toLocaleString()}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <p className="text-sm text-blue-600 font-medium">Balance</p>
          <p className="text-3xl font-bold text-blue-700 mt-1">UGX {summary?.balance?.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Expenses by Category</h2>
          {Object.keys(expensesByCategory).length > 0 ? (
            <Doughnut data={doughnutData} />
          ) : (
            <p className="text-gray-400 text-sm text-center mt-8">No expenses yet</p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Last 7 Days</h2>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}`;

const transactions = `import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ amount: '', type: 'income', category: '', note: '' });
  const [error, setError] = useState('');

  const fetchTransactions = () => {
    api.get('/transactions')
      .then(res => setTransactions(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTransactions(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/transactions', { ...form, amount: parseFloat(form.amount) });
      setForm({ amount: '', type: 'income', category: '', note: '' });
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add transaction');
    }
  };

  const handleDelete = async (id) => {
    await api.delete('/transactions/' + id);
    fetchTransactions();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Transactions</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Transaction</h2>
        {error && <p className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input type="number" placeholder="Amount (UGX)" value={form.amount}
            onChange={e => setForm({...form, amount: e.target.value})}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required />
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input type="text" placeholder="Category" value={form.category}
            onChange={e => setForm({...form, category: e.target.value})}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required />
          <input type="text" placeholder="Note (optional)" value={form.note}
            onChange={e => setForm({...form, note: e.target.value})}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit"
            className="col-span-2 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
            Add Transaction
          </button>
        </form>
      </div>

      {loading ? <p className="text-gray-500">Loading...</p> : (
        <div className="space-y-3">
          {transactions.map(t => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800 capitalize">{t.category}</p>
                <p className="text-sm text-gray-500">{t.note} • {new Date(t.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={t.type === 'income' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                  {t.type === 'income' ? '+' : '-'} UGX {t.amount.toLocaleString()}
                </span>
                <button onClick={() => handleDelete(t.id)} className="text-sm text-red-400 hover:text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`;

const budgets = `import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Budgets() {
  const [report, setReport] = useState([]);
  const [form, setForm] = useState({ category: '', limit: '', month: '' });
  const [error, setError] = useState('');
  const currentMonth = new Date().toISOString().slice(0, 7);

  const fetchBudgets = () => {
    api.get('/budgets/check?month=' + currentMonth).then(res => setReport(res.data));
  };

  useEffect(() => { fetchBudgets(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/budgets', { ...form, limit: parseFloat(form.limit) });
      setForm({ category: '', limit: '', month: '' });
      fetchBudgets();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add budget');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Budgets</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Set a Budget</h2>
        {error && <p className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
          <input type="text" placeholder="Category (e.g. rent)" value={form.category}
            onChange={e => setForm({...form, category: e.target.value})}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required />
          <input type="number" placeholder="Limit (UGX)" value={form.limit}
            onChange={e => setForm({...form, limit: e.target.value})}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required />
          <input type="month" value={form.month}
            onChange={e => setForm({...form, month: e.target.value})}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required />
          <button type="submit"
            className="col-span-3 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
            Add Budget
          </button>
        </form>
      </div>

      <h2 className="text-lg font-semibold text-gray-700 mb-4">This month — {currentMonth}</h2>
      <div className="space-y-3">
        {report.map((b, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex justify-between mb-2">
              <p className="font-medium text-gray-800 capitalize">{b.category}</p>
              <p className={b.overBudget ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
                UGX {b.spent.toLocaleString()} / UGX {b.limit.toLocaleString()}
              </p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className={b.overBudget ? 'bg-red-500 h-2 rounded-full' : 'bg-green-500 h-2 rounded-full'}
                style={{width: Math.min((b.spent / b.limit) * 100, 100) + '%'}}>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {b.overBudget ? 'Over budget by UGX ' + (b.spent - b.limit).toLocaleString() : 'UGX ' + b.remaining.toLocaleString() + ' remaining'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}`;

const navbar = `import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
      <div className="flex gap-6">
        <Link to="/" className="text-gray-700 font-medium hover:text-blue-600">Dashboard</Link>
        <Link to="/transactions" className="text-gray-700 font-medium hover:text-blue-600">Transactions</Link>
        <Link to="/budgets" className="text-gray-700 font-medium hover:text-blue-600">Budgets</Link>
      </div>
      <button onClick={logout} className="text-sm text-red-500 hover:text-red-700">Logout</button>
    </nav>
  );
}`;

fs.writeFileSync('./src/pages/Login.jsx', login);
fs.writeFileSync('./src/pages/Register.jsx', register);
fs.writeFileSync('./src/pages/Dashboard.jsx', dashboard);
fs.writeFileSync('./src/pages/Transactions.jsx', transactions);
fs.writeFileSync('./src/pages/Budgets.jsx', budgets);
fs.writeFileSync('./src/components/Navbar.jsx', navbar);

console.log('All pages written successfully!');