import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const fullName = localStorage.getItem('fullName') || 'User';
  const [showConfirm, setShowConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path
    ? 'text-blue-600 font-semibold'
    : 'text-gray-600 hover:text-blue-600';

  return (
    <>
      <nav className="bg-white shadow-sm px-4 md:px-8 py-3 md:py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">FT</span>
            </div>
            <span className="font-bold text-gray-800 text-sm md:text-base">Finance Tracker</span>
          </div>

          <div className="hidden md:flex gap-4 lg:gap-6">
            <Link to="/" className={isActive('/')}>Dashboard</Link>
            <Link to="/transactions" className={isActive('/transactions')}>Transactions</Link>
            <Link to="/budgets" className={isActive('/budgets')}>Budgets</Link>
          </div>

          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <span className="text-sm text-gray-600">Hi, <span className="font-medium text-blue-600">{fullName}</span></span>
            <button onClick={() => setShowConfirm(true)} className="text-sm text-red-500 hover:text-red-700 font-medium">Logout</button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <div className={"w-5 h-0.5 bg-gray-600 transition-all " + (menuOpen ? 'rotate-45 translate-y-1.5' : '')}></div>
            <div className={"w-5 h-0.5 bg-gray-600 my-1 " + (menuOpen ? 'opacity-0' : '')}></div>
            <div className={"w-5 h-0.5 bg-gray-600 transition-all " + (menuOpen ? '-rotate-45 -translate-y-1.5' : '')}></div>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-3 pb-2 border-t border-gray-100 pt-3 space-y-2">
            <p className="text-sm text-gray-500 pb-1">Hi, <span className="font-medium text-blue-600">{fullName}</span></p>
            <Link to="/" onClick={() => setMenuOpen(false)} className={"block py-2 text-sm " + isActive('/')}>Dashboard</Link>
            <Link to="/transactions" onClick={() => setMenuOpen(false)} className={"block py-2 text-sm " + isActive('/transactions')}>Transactions</Link>
            <Link to="/budgets" onClick={() => setMenuOpen(false)} className={"block py-2 text-sm " + isActive('/budgets')}>Budgets</Link>
            <button onClick={() => { setMenuOpen(false); setShowConfirm(true); }} className="text-sm text-red-500 font-medium py-2 block">Logout</button>
          </div>
        )}
      </nav>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-sm text-center">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-xl md:text-2xl">👋</span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Logging out</h2>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to log out of your account?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition text-sm">Cancel</button>
              <button onClick={logout} className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition text-sm">Yes, Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}