import { useEffect, useState } from 'react';
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
}