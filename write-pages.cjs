const fs = require('fs');

const login = `import { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import moneyImg from '../assets/money-received.svg';

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
      localStorage.setItem('fullName', res.data.fullName || '');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-blue-600 flex-col items-center justify-center p-8 lg:p-12">
        <img src={moneyImg} alt="Finance" className="w-48 md:w-64 lg:w-80 mb-6 lg:mb-8" />
        <h2 className="text-white text-2xl lg:text-3xl font-bold text-center">Track your finances</h2>
        <p className="text-blue-100 text-center mt-3 text-base lg:text-lg">Stay on top of your income, expenses and budgets in one place.</p>
      </div>
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-4 md:p-8 bg-gray-50 min-h-screen md:min-h-0">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-6 md:p-8">
          <div className="mb-6 md:mb-8">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-white text-base md:text-lg font-bold">FT</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Welcome back</h1>
            <p className="text-gray-500 text-sm mt-1">Login to your finance tracker</p>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-5 text-sm">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            No account? <Link to="/register" className="text-blue-600 font-medium hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}`;

const register = `import { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import sendMoneyImg from '../assets/send-money.svg';

export default function Register() {
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        fullName: form.fullName, phone: form.phone,
        email: form.email, password: form.password,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('fullName', res.data.fullName || '');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-blue-600 flex-col items-center justify-center p-8 lg:p-12">
        <img src={sendMoneyImg} alt="Send Money" className="w-48 md:w-64 lg:w-80 mb-6 lg:mb-8" />
        <h2 className="text-white text-2xl lg:text-3xl font-bold text-center">Start your journey</h2>
        <p className="text-blue-100 text-center mt-3 text-base lg:text-lg">Join thousands managing their finances smarter every day.</p>
      </div>
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-4 md:p-8 bg-gray-50 min-h-screen md:min-h-0">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-6 md:p-8">
          <div className="mb-5 md:mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-white text-base md:text-lg font-bold">FT</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Create your account</h1>
            <p className="text-gray-500 text-sm mt-1">Start tracking your finances today</p>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleRegister} className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" value={form.fullName} onChange={update('fullName')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" value={form.phone} onChange={update('phone')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+256 700 000 000" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" value={form.email} onChange={update('email')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={form.password} onChange={update('password')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="At least 6 characters" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={update('confirm')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Repeat your password" required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account? <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}`;

const dashboard = `import { useEffect, useState } from 'react';
import api from '../services/api';
import goalsImg from '../assets/goals.svg';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const fullName = localStorage.getItem('fullName') || 'User';

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

  if (loading) return <div className="p-4 md:p-8 text-gray-500">Loading...</div>;

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {});

  const doughnutData = {
    labels: Object.keys(expensesByCategory),
    datasets: [{ data: Object.values(expensesByCategory), backgroundColor: ['#3b82f6','#ef4444','#f59e0b','#10b981','#8b5cf6','#ec4899'], borderWidth: 0 }],
  };

  const last7Days = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toISOString().slice(0, 10); });
  const incomeByDay = last7Days.map(day => transactions.filter(t => t.type === 'income' && t.date.slice(0, 10) === day).reduce((sum, t) => sum + t.amount, 0));
  const expenseByDay = last7Days.map(day => transactions.filter(t => t.type === 'expense' && t.date.slice(0, 10) === day).reduce((sum, t) => sum + t.amount, 0));

  const barData = {
    labels: last7Days.map(d => new Date(d).toLocaleDateString('en-UG', { weekday: 'short' })),
    datasets: [
      { label: 'Income', data: incomeByDay, backgroundColor: '#10b981', borderRadius: 6 },
      { label: 'Expenses', data: expenseByDay, backgroundColor: '#ef4444', borderRadius: 6 },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: { y: { ticks: { callback: (value) => 'UGX ' + value.toLocaleString() } } },
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="bg-blue-600 rounded-2xl p-4 md:p-6 mb-6 md:mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-white">Good day, {fullName}! 👋</h1>
          <p className="text-blue-100 mt-1 text-sm md:text-base">Here is your financial summary</p>
        </div>
        <img src={goalsImg} alt="Goals" className="w-16 md:w-24 lg:w-32 hidden sm:block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 md:mb-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 md:p-6">
          <p className="text-sm text-green-600 font-medium">Total Income</p>
          <p className="text-2xl md:text-3xl font-bold text-green-700 mt-1">UGX {summary?.income?.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 md:p-6">
          <p className="text-sm text-red-600 font-medium">Total Expenses</p>
          <p className="text-2xl md:text-3xl font-bold text-red-700 mt-1">UGX {summary?.expenses?.toLocaleString()}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6 md:col-span-2 lg:col-span-1">
          <p className="text-sm text-blue-600 font-medium">Balance</p>
          <p className="text-2xl md:text-3xl font-bold text-blue-700 mt-1">UGX {summary?.balance?.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-4">Expenses by Category</h2>
          {Object.keys(expensesByCategory).length > 0 ? <Doughnut data={doughnutData} /> : <p className="text-gray-400 text-sm text-center mt-8">No expenses yet</p>}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-4">Last 7 Days</h2>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}`;

const transactions = `import { useEffect, useState } from 'react';
import api from '../services/api';
import invoicesImg from '../assets/invoices.svg';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ amount: '', type: 'income', category: '', note: '' });
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ amount: '', type: 'income', category: '', note: '' });
  const [editError, setEditError] = useState('');

  const fetchTransactions = () => {
    api.get('/transactions')
      .then(res => setTransactions(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTransactions(); }, []);

  useEffect(() => {
    let result = transactions;
    if (typeFilter !== 'all') result = result.filter(t => t.type === typeFilter);
    if (categoryFilter) result = result.filter(t => t.category.toLowerCase() === categoryFilter.toLowerCase());
    if (search) result = result.filter(t =>
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      (t.note && t.note.toLowerCase().includes(search.toLowerCase()))
    );
    if (fromDate) result = result.filter(t => new Date(t.date) >= new Date(fromDate));
    if (toDate) result = result.filter(t => new Date(t.date) <= new Date(toDate + 'T23:59:59'));
    setFiltered(result);
  }, [typeFilter, categoryFilter, search, fromDate, toDate, transactions]);

  useEffect(() => { setCategoryFilter(''); }, [typeFilter]);

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

  const openEdit = (t) => {
    setEditingId(t.id);
    setEditForm({ amount: t.amount, type: t.type, category: t.category, note: t.note || '' });
    setEditError('');
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setEditError('');
    try {
      await api.put('/transactions/' + editingId, editForm);
      setEditingId(null);
      fetchTransactions();
    } catch (err) {
      setEditError(err.response?.data?.error || 'Failed to update transaction');
    }
  };

  const clearFilters = () => {
    setTypeFilter('all');
    setCategoryFilter('');
    setSearch('');
    setFromDate('');
    setToDate('');
  };

  const visibleCategories = [...new Set(transactions.filter(t => typeFilter === 'all' || t.type === typeFilter).map(t => t.category))];
  const totalIncome = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const hasActiveFilters = typeFilter !== 'all' || categoryFilter || search || fromDate || toDate;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">

      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Edit Transaction</h2>
            {editError && <p className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{editError}</p>}
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (UGX)</label>
                <input type="number" value={editForm.amount}
                  onChange={e => setEditForm({...editForm, amount: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input type="text" value={editForm.category}
                  onChange={e => setEditForm({...editForm, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <input type="text" value={editForm.note}
                  onChange={e => setEditForm({...editForm, note: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingId(null)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-blue-600 rounded-2xl p-4 md:p-6 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-white">Transactions</h1>
          <p className="text-blue-100 mt-1 text-sm md:text-base">Manage your income and expenses</p>
        </div>
        <img src={invoicesImg} alt="Invoices" className="w-16 md:w-24 hidden sm:block" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-4">Add Transaction</h2>
        {error && <p className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="number" placeholder="Amount (UGX)" value={form.amount}
            onChange={e => setForm({...form, amount: e.target.value})}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input type="text" placeholder="Category" value={form.category}
            onChange={e => setForm({...form, category: e.target.value})}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <input type="text" placeholder="Note (optional)" value={form.note}
            onChange={e => setForm({...form, note: e.target.value})}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" className="col-span-1 md:col-span-2 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
            Add Transaction
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base md:text-lg font-semibold text-gray-700">Search & Filter</h2>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-700 font-medium">Clear all</button>
          )}
        </div>
        <input type="text" placeholder="Search by category or note..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">From date</label>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">To date</label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3 mb-4">
          {['all', 'income', 'expense'].map(type => (
            <button key={type} onClick={() => setTypeFilter(type)}
              className={"px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium capitalize transition text-sm " + (typeFilter === type ? type === 'income' ? 'bg-green-500 text-white' : type === 'expense' ? 'bg-red-500 text-white' : 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        {visibleCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
            <span className="text-sm text-gray-500 self-center mr-1">Category:</span>
            <button onClick={() => setCategoryFilter('')} className={"px-3 py-1 rounded-lg text-sm transition " + (categoryFilter === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>All</button>
            {visibleCategories.map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className={"px-3 py-1 rounded-lg text-sm capitalize transition " + (categoryFilter === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-600 font-medium">Filtered Income</p>
          <p className="text-lg md:text-xl font-bold text-green-700">UGX {totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600 font-medium">Filtered Expenses</p>
          <p className="text-lg md:text-xl font-bold text-red-700">UGX {totalExpenses.toLocaleString()}</p>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-3">{filtered.length} transaction{filtered.length !== 1 ? 's' : ''} found</p>

      {loading ? <p className="text-gray-500">Loading...</p> : (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-2">No transactions found</p>
              <p className="text-gray-300 text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            filtered.map(t => (
              <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-3 md:p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800 capitalize text-sm md:text-base">{t.category}</p>
                  <p className="text-xs md:text-sm text-gray-500">{t.note} • {new Date(t.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <span className={"text-sm md:text-base font-bold " + (t.type === 'income' ? 'text-green-600' : 'text-red-600')}>
                    {t.type === 'income' ? '+' : '-'} UGX {t.amount.toLocaleString()}
                  </span>
                  <button onClick={() => openEdit(t)} className="text-xs md:text-sm text-blue-500 hover:text-blue-700 font-medium">Edit</button>
                  <button onClick={() => handleDelete(t.id)} className="text-xs md:text-sm text-red-400 hover:text-red-600">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}`;

const budgets = `import { useEffect, useState } from 'react';
import api from '../services/api';
import digitalCurrencyImg from '../assets/digital-currency.svg';

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
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="bg-blue-600 rounded-2xl p-4 md:p-6 mb-6 md:mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-white">Budgets</h1>
          <p className="text-blue-100 mt-1 text-sm md:text-base">Set limits and track your spending</p>
        </div>
        <img src={digitalCurrencyImg} alt="Budget" className="w-16 md:w-24 hidden sm:block" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6 md:mb-8">
        <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-4">Set a Budget</h2>
        {error && <p className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input type="text" placeholder="Category (e.g. rent)" value={form.category}
            onChange={e => setForm({...form, category: e.target.value})}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <input type="number" placeholder="Limit (UGX)" value={form.limit}
            onChange={e => setForm({...form, limit: e.target.value})}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <input type="month" value={form.month}
            onChange={e => setForm({...form, month: e.target.value})}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <button type="submit" className="col-span-1 md:col-span-2 lg:col-span-3 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
            Add Budget
          </button>
        </form>
      </div>

      <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-4">This month — {currentMonth}</h2>
      <div className="space-y-3">
        {report.map((b, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex justify-between mb-2 flex-wrap gap-2">
              <p className="font-medium text-gray-800 capitalize">{b.category}</p>
              <p className={"text-sm md:text-base font-bold " + (b.overBudget ? 'text-red-600' : 'text-green-600')}>
                UGX {b.spent.toLocaleString()} / UGX {b.limit.toLocaleString()}
              </p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className={"h-2 rounded-full " + (b.overBudget ? 'bg-red-500' : 'bg-green-500')}
                style={{width: Math.min((b.spent / b.limit) * 100, 100) + '%'}}></div>
            </div>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              {b.overBudget ? 'Over budget by UGX ' + (b.spent - b.limit).toLocaleString() : 'UGX ' + b.remaining.toLocaleString() + ' remaining'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}`;

const navbar = `import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const fullName = localStorage.getItem('fullName') || 'User';
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const [showConfirm, setShowConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={{background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 60%, #1d4ed8 100%)'}} className="px-4 md:px-8 py-0 sticky top-0 z-40 shadow-lg">
        <div className="flex justify-between items-center h-16 md:h-18">

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white bg-opacity-20 backdrop-blur rounded-xl flex items-center justify-center border border-white border-opacity-30 shadow">
              <span style={{fontFamily: 'Georgia, serif'}} className="text-white text-sm font-bold">FT</span>
            </div>
            <span style={{fontFamily: 'Georgia, serif', letterSpacing: '0.5px'}} className="font-bold text-white text-base md:text-lg tracking-wide">Finance Tracker</span>
          </div>

          <div className="hidden md:flex items-center gap-1 lg:gap-2 bg-white bg-opacity-10 rounded-2xl px-2 py-1.5 backdrop-blur">
            {[['/', 'Dashboard'], ['/transactions', 'Transactions'], ['/budgets', 'Budgets'], ['/profile', 'Profile']].map(([path, label]) => (
              <Link key={path} to={path} style={{fontFamily: 'system-ui, sans-serif'}}
                className={"px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 " +
                  (isActive(path)
                    ? 'bg-white text-blue-700 shadow-md'
                    : 'text-white text-opacity-90 hover:bg-white hover:bg-opacity-20')}>
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/profile" className="flex items-center gap-2.5 bg-white bg-opacity-10 hover:bg-opacity-20 transition rounded-2xl px-3 py-1.5 border border-white border-opacity-20 backdrop-blur group">
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow">
                <span className="text-blue-700 text-xs font-bold">{initials}</span>
              </div>
              <span style={{fontFamily: 'system-ui, sans-serif'}} className="text-sm text-white font-medium">{fullName}</span>
            </Link>
            <button onClick={() => setShowConfirm(true)}
              className="flex items-center gap-1.5 text-sm text-white text-opacity-80 hover:text-opacity-100 hover:bg-white hover:bg-opacity-10 font-medium transition px-3 py-1.5 rounded-xl border border-white border-opacity-0 hover:border-opacity-20">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl hover:bg-white hover:bg-opacity-10 transition">
            <div className={"w-5 h-0.5 bg-white transition-all duration-300 " + (menuOpen ? 'rotate-45 translate-y-1.5' : '')}></div>
            <div className={"w-5 h-0.5 bg-white my-1 transition-all duration-300 " + (menuOpen ? 'opacity-0' : '')}></div>
            <div className={"w-5 h-0.5 bg-white transition-all duration-300 " + (menuOpen ? '-rotate-45 -translate-y-1.5' : '')}></div>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-white border-opacity-20 pt-3 space-y-1">
            <div className="flex items-center gap-3 px-2 py-3 mb-1">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow">
                <span className="text-blue-700 text-sm font-bold">{initials}</span>
              </div>
              <div>
                <p style={{fontFamily: 'system-ui, sans-serif'}} className="text-sm font-semibold text-white">{fullName}</p>
                <p className="text-xs text-white text-opacity-60">View profile</p>
              </div>
            </div>
            {[['/', 'Dashboard'], ['/transactions', 'Transactions'], ['/budgets', 'Budgets'], ['/profile', 'Profile']].map(([path, label]) => (
              <Link key={path} to={path} onClick={() => setMenuOpen(false)}
                className={"flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition " +
                  (isActive(path) ? 'bg-white text-blue-700' : 'text-white text-opacity-90 hover:bg-white hover:bg-opacity-10')}>
                {label}
              </Link>
            ))}
            <div className="pt-2 mt-1 border-t border-white border-opacity-20">
              <button onClick={() => { setMenuOpen(false); setShowConfirm(true); }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-white hover:bg-opacity-10 transition w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-sm text-center">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h2 style={{fontFamily: 'Georgia, serif'}} className="text-xl font-bold text-gray-800 mb-2">Logging out</h2>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to log out of your account?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition text-sm">Cancel</button>
              <button onClick={logout} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-medium hover:bg-red-600 transition text-sm">Yes, Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}`;

const profile = `import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({ fullName: '', phone: '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [editSuccess, setEditSuccess] = useState('');
  const [editError, setEditError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  useEffect(() => {
    api.get('/profile')
      .then(res => {
        setUser(res.data);
        setEditForm({ fullName: res.data.fullName, phone: res.data.phone });
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');
    try {
      const res = await api.put('/profile', editForm);
      setUser(res.data);
      localStorage.setItem('fullName', res.data.fullName);
      setEditSuccess('Profile updated successfully!');
    } catch (err) {
      setEditError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');
    if (passForm.newPassword !== passForm.confirm) {
      return setPassError('New passwords do not match');
    }
    try {
      await api.put('/profile/password', {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      });
      setPassSuccess('Password changed successfully!');
      setPassForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setPassError(err.response?.data?.error || 'Failed to change password');
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="bg-blue-600 rounded-2xl p-4 md:p-6 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center">
          <span className="text-blue-600 text-xl md:text-2xl font-bold">
            {user?.fullName?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-white">{user?.fullName}</h1>
          <p className="text-blue-100 text-sm">{user?.email}</p>
          <p className="text-blue-200 text-xs mt-1">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-4">Personal Information</h2>
        {editSuccess && <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg mb-4 text-sm">{editSuccess}</div>}
        {editError && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm">{editError}</div>}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" value={editForm.fullName}
              onChange={e => setEditForm({...editForm, fullName: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input type="tel" value={editForm.phone}
              onChange={e => setEditForm({...editForm, phone: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" value={user?.email} disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-400 cursor-not-allowed" />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">
            Save Changes
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-4">Change Password</h2>
        {passSuccess && <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg mb-4 text-sm">{passSuccess}</div>}
        {passError && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm">{passError}</div>}
        <form onSubmit={handlePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input type="password" value={passForm.currentPassword}
              onChange={e => setPassForm({...passForm, currentPassword: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter current password" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" value={passForm.newPassword}
              onChange={e => setPassForm({...passForm, newPassword: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="At least 6 characters" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input type="password" value={passForm.confirm}
              onChange={e => setPassForm({...passForm, confirm: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Repeat new password" required />
          </div>
          <button type="submit" className="w-full bg-gray-800 text-white py-2.5 rounded-lg font-medium hover:bg-gray-900 transition">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}`;

fs.writeFileSync('./src/pages/Login.jsx', login);
fs.writeFileSync('./src/pages/Register.jsx', register);
fs.writeFileSync('./src/pages/Dashboard.jsx', dashboard);
fs.writeFileSync('./src/pages/Transactions.jsx', transactions);
fs.writeFileSync('./src/pages/Budgets.jsx', budgets);
fs.writeFileSync('./src/components/Navbar.jsx', navbar);
fs.writeFileSync('./src/pages/Profile.jsx', profile);

console.log('All pages written successfully!');