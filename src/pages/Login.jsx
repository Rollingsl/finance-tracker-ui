import { useState } from 'react';
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
}