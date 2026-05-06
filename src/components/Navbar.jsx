import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const fullName = localStorage.getItem('fullName') || 'User';
  const [showConfirm, setShowConfirm] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <div className="flex gap-6">
          <Link to="/" className="text-gray-700 font-medium hover:text-blue-600">Dashboard</Link>
          <Link to="/transactions" className="text-gray-700 font-medium hover:text-blue-600">Transactions</Link>
          <Link to="/budgets" className="text-gray-700 font-medium hover:text-blue-600">Budgets</Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hi, <span className="font-medium text-blue-600">{fullName}</span></span>
          <button onClick={() => setShowConfirm(true)}
            className="text-sm text-red-500 hover:text-red-700 font-medium">
            Logout
          </button>
        </div>
      </nav>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">👋</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Logging out</h2>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to log out of your account?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={logout}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition">
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}