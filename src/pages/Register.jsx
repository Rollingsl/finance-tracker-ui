import { useState } from 'react';
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
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 bg-blue-600 flex-col items-center justify-center p-12">
        <img src={sendMoneyImg} alt="Send Money" className="w-80 mb-8" />
        <h2 className="text-white text-3xl font-bold text-center">Start your journey</h2>
        <p className="text-blue-100 text-center mt-3 text-lg">Join thousands managing their finances smarter every day.</p>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
          <div className="mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-white text-lg font-bold">FT</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Create your account</h1>
            <p className="text-gray-500 text-sm mt-1">Start tracking your finances today</p>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleRegister} className="space-y-4">
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
}