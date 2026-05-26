import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import Sidebar from '../components/Sidebar';
import { Users, Shield, Trash2, ShieldAlert, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch users function
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch user database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update user role action
  const handleUpdateRole = async (id, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    const confirmChange = window.confirm(
      `Are you sure you want to change this user's privilege access level to: ${nextRole.toUpperCase()}?`
    );
    if (!confirmChange) return;

    try {
      const res = await api.put(`/admin/users/${id}/role`, { role: nextRole });
      if (res.success) {
        setSuccess(`User role updated successfully to ${nextRole}.`);
        fetchUsers();
        setTimeout(() => setSuccess(''), 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to update user role.');
    }
  };

  // Delete user account action
  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      'Are you absolutely sure you want to permanently delete this user account? All corresponding quiz history will be erased!'
    );
    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/admin/users/${id}`);
      if (res.success) {
        setSuccess('User account successfully deleted.');
        fetchUsers();
        setTimeout(() => setSuccess(''), 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete user.');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Admin Workspace */}
      <main className="flex-grow flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8 text-brand-500" /> Platform User Manager
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View active user profiles, adjust administrative privileges, and delete records.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-sm text-rose-500 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            {success}
          </div>
        )}

        {/* Users list table layout */}
        <section className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-200/20 dark:bg-slate-800/20 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Role Privilege</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/30 dark:divide-slate-800/30 text-xs">
                {users.length > 0 ? (
                  users.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-200/10 dark:hover:bg-slate-800/10 transition-colors"
                    >
                      <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-100">
                        {item.name}
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-medium">
                        {item.email}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase tracking-wide ${item.role === 'admin' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-400'}`}
                        >
                          {item.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400 font-medium">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right flex justify-end gap-3">
                        {/* Toggle privilege */}
                        <button
                          onClick={() => handleUpdateRole(item.id, item.role)}
                          className="p-1.5 rounded-lg text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                          title="Toggle Role"
                        >
                          <ShieldAlert className="h-4 w-4" />
                        </button>
                        {/* Delete account */}
                        <button
                          onClick={() => handleDeleteUser(item.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400 font-medium">
                      No user accounts present.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>

    </div>
  );
};

export default UserManagement;
