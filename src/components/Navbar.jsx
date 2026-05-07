import { Link, useNavigate, useLocation } from 'react-router-dom';
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
            {[['/', 'Dashboard'], ['/transactions', 'Transactions'], ['/budgets', 'Budgets'], ['/insights', 'Insights'], ['/profile', 'Profile']].map(([path, label]) => (
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
            {[['/', 'Dashboard'], ['/transactions', 'Transactions'], ['/budgets', 'Budgets'], ['/insights', 'Insights'], ['/profile', 'Profile']].map(([path, label]) => (
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
}