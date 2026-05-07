import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Insights from './pages/Insights';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Navbar /><Dashboard /></PrivateRoute>} />
        <Route path="/transactions" element={<PrivateRoute><Navbar /><Transactions /></PrivateRoute>} />
        <Route path="/budgets" element={<PrivateRoute><Navbar /><Budgets /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Navbar /><Profile /></PrivateRoute>} />
        <Route path="/insights" element={<PrivateRoute><Navbar /><Insights /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;