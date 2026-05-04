import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
      <div className="flex gap-6">
        <Link to="/" className="text-gray-700 font-medium hover:text-blue-600">Dashboard</Link>
        <Link to="/transactions" className="text-gray-700 font-medium hover:text-blue-600">Transactions</Link>
        <Link to="/budgets" className="text-gray-700 font-medium hover:text-blue-600">Budgets</Link>
      </div>
      <button onClick={logout} className="text-sm text-red-500 hover:text-red-700">Logout</button>
    </nav>
  );
}