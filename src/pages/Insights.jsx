import { useEffect, useState } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Insights() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/transactions')
      .then(res => setTransactions(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getMonthlyData = () => {
    const map = {};
    transactions.forEach(t => {
      const date = new Date(t.date);
      const key = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!map[key]) map[key] = { month: key, income: 0, expenses: 0 };
      if (t.type === 'income') map[key].income += t.amount;
      else map[key].expenses += t.amount;
    });
    return Object.values(map).slice(-6);
  };

  const getCategoryData = () => {
    const map = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      if (!map[t.category]) map[t.category] = { category: t.category, amount: 0 };
      map[t.category].amount += t.amount;
    });
    return Object.values(map).sort((a, b) => b.amount - a.amount).slice(0, 6);
  };

  const monthlyData = getMonthlyData();
  const categoryData = getCategoryData();

  const thisMonth = monthlyData[monthlyData.length - 1] || { income: 0, expenses: 0 };
  const lastMonth = monthlyData[monthlyData.length - 2] || { income: 0, expenses: 0 };

  const incomeChange = lastMonth.income ? (((thisMonth.income - lastMonth.income) / lastMonth.income) * 100).toFixed(1) : 0;
  const expenseChange = lastMonth.expenses ? (((thisMonth.expenses - lastMonth.expenses) / lastMonth.expenses) * 100).toFixed(1) : 0;

  const formatUGX = (v) => 'UGX ' + v.toLocaleString();

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
      <div style={{background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)'}} className="rounded-2xl p-4 md:p-6 mb-6">
        <h1 className="text-lg md:text-2xl font-bold text-white">Spending Insights</h1>
        <p className="text-blue-100 mt-1 text-sm">Monthly breakdown and trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-2xl p-4 text-white">
          <p className="text-sm text-blue-100 mb-1">This Month Income</p>
          <p className="text-xl font-bold">UGX {thisMonth.income.toLocaleString()}</p>
          <p className={"text-xs mt-1 font-medium " + (incomeChange >= 0 ? 'text-green-300' : 'text-red-300')}>
            {incomeChange >= 0 ? '▲' : '▼'} {Math.abs(incomeChange)}% vs last month
          </p>
        </div>
        <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-2xl p-4 text-white">
          <p className="text-sm text-blue-100 mb-1">This Month Expenses</p>
          <p className="text-xl font-bold">UGX {thisMonth.expenses.toLocaleString()}</p>
          <p className={"text-xs mt-1 font-medium " + (expenseChange <= 0 ? 'text-green-300' : 'text-red-300')}>
            {expenseChange >= 0 ? '▲' : '▼'} {Math.abs(expenseChange)}% vs last month
          </p>
        </div>
        <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-2xl p-4 text-white">
          <p className="text-sm text-blue-100 mb-1">This Month Savings</p>
          <p className={"text-xl font-bold " + (thisMonth.income - thisMonth.expenses >= 0 ? 'text-green-300' : 'text-red-300')}>
            UGX {(thisMonth.income - thisMonth.expenses).toLocaleString()}
          </p>
          <p className="text-xs mt-1 text-blue-200">Income minus expenses</p>
        </div>
      </div>

      <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-2xl p-4 md:p-6 mb-6">
        <h2 className="text-base font-semibold text-white mb-4">Monthly Income vs Expenses</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" tick={{ fill: '#93c5fd', fontSize: 12 }} />
            <YAxis tickFormatter={v => 'UGX ' + (v/1000).toFixed(0) + 'k'} tick={{ fill: '#93c5fd', fontSize: 11 }} />
            <Tooltip formatter={formatUGX} contentStyle={{ background: '#1e3a5f', border: 'none', borderRadius: '12px', color: 'white' }} />
            <Legend wrapperStyle={{ color: '#93c5fd' }} />
            <Bar dataKey="income" name="Income" fill="#34d399" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#f87171" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-2xl p-4 md:p-6 mb-6">
        <h2 className="text-base font-semibold text-white mb-4">Balance Trend</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" tick={{ fill: '#93c5fd', fontSize: 12 }} />
            <YAxis tickFormatter={v => 'UGX ' + (v/1000).toFixed(0) + 'k'} tick={{ fill: '#93c5fd', fontSize: 11 }} />
            <Tooltip formatter={formatUGX} contentStyle={{ background: '#1e3a5f', border: 'none', borderRadius: '12px', color: 'white' }} />
            <Line type="monotone" dataKey="income" stroke="#34d399" strokeWidth={2} dot={{ fill: '#34d399' }} name="Income" />
            <Line type="monotone" dataKey="expenses" stroke="#f87171" strokeWidth={2} dot={{ fill: '#f87171' }} name="Expenses" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-2xl p-4 md:p-6">
        <h2 className="text-base font-semibold text-white mb-4">Top Expense Categories</h2>
        {categoryData.length === 0 ? (
          <p className="text-blue-200 text-sm">No expense data yet</p>
        ) : (
          <div className="space-y-3">
            {categoryData.map((cat, i) => {
              const total = categoryData.reduce((sum, c) => sum + c.amount, 0);
              const pct = ((cat.amount / total) * 100).toFixed(1);
              const colors = ['#f87171','#fb923c','#fbbf24','#34d399','#60a5fa','#a78bfa'];
              return (
                <div key={cat.category}>
                  <div className="flex justify-between text-sm text-white mb-1">
                    <span className="capitalize font-medium">{cat.category}</span>
                    <span className="text-blue-200">UGX {cat.amount.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-10 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all duration-500" style={{ width: pct + '%', background: colors[i] }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}