import { useEffect, useState } from 'react';
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
}