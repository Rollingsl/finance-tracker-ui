import { useEffect, useState } from 'react';
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

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;

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
    <div className="p-8 max-w-5xl mx-auto">
      <div className="bg-blue-600 rounded-2xl p-6 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Good day, {fullName}! 👋</h1>
          <p className="text-blue-100 mt-1">Here is your financial summary</p>
        </div>
        <img src={goalsImg} alt="Goals" className="w-32 hidden md:block" />
      </div>

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
          {Object.keys(expensesByCategory).length > 0 ? <Doughnut data={doughnutData} /> : <p className="text-gray-400 text-sm text-center mt-8">No expenses yet</p>}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Last 7 Days</h2>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}