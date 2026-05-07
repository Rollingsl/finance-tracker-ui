import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({ fullName: '', phone: '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [editSuccess, setEditSuccess] = useState('');
  const [editError, setEditError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  useEffect(() => {
    api.get('/profile')
      .then(res => {
        setUser(res.data);
        setEditForm({ fullName: res.data.fullName, phone: res.data.phone });
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');
    try {
      const res = await api.put('/profile', editForm);
      setUser(res.data);
      localStorage.setItem('fullName', res.data.fullName);
      setEditSuccess('Profile updated successfully!');
    } catch (err) {
      setEditError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');
    if (passForm.newPassword !== passForm.confirm) {
      return setPassError('New passwords do not match');
    }
    try {
      await api.put('/profile/password', {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      });
      setPassSuccess('Password changed successfully!');
      setPassForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setPassError(err.response?.data?.error || 'Failed to change password');
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="bg-blue-600 rounded-2xl p-4 md:p-6 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center">
          <span className="text-blue-600 text-xl md:text-2xl font-bold">
            {user?.fullName?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-white">{user?.fullName}</h1>
          <p className="text-blue-100 text-sm">{user?.email}</p>
          <p className="text-blue-200 text-xs mt-1">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-4">Personal Information</h2>
        {editSuccess && <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg mb-4 text-sm">{editSuccess}</div>}
        {editError && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm">{editError}</div>}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" value={editForm.fullName}
              onChange={e => setEditForm({...editForm, fullName: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input type="tel" value={editForm.phone}
              onChange={e => setEditForm({...editForm, phone: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" value={user?.email} disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-400 cursor-not-allowed" />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">
            Save Changes
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-4">Change Password</h2>
        {passSuccess && <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg mb-4 text-sm">{passSuccess}</div>}
        {passError && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm">{passError}</div>}
        <form onSubmit={handlePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input type="password" value={passForm.currentPassword}
              onChange={e => setPassForm({...passForm, currentPassword: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter current password" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" value={passForm.newPassword}
              onChange={e => setPassForm({...passForm, newPassword: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="At least 6 characters" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input type="password" value={passForm.confirm}
              onChange={e => setPassForm({...passForm, confirm: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Repeat new password" required />
          </div>
          <button type="submit" className="w-full bg-gray-800 text-white py-2.5 rounded-lg font-medium hover:bg-gray-900 transition">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}