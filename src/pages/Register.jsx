import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 1. Password mismatch check
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    // 2. Password length check
    if (password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }

    setSubmitting(true);

    try {
      const res = await register(name, email, password);
      if (res.success) {
        setSuccess('Registration successful! Launching performance dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
        
        {/* Glowing border effect */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-500 to-indigo-500"></div>

        {/* Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 shadow-md">
            <UserPlus className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            Create Account
          </h2>
          <p className="text-sm text-slate-400">
            Start solving aptitude challenges immediately
          </p>
        </div>

        {/* Notices */}
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-500 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-500 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase pl-1">
              Your Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                required
                disabled={submitting}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-200/40 dark:bg-slate-800 border border-slate-300/40 dark:border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-slate-800 dark:text-white font-medium transition-all duration-200"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase pl-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                required
                disabled={submitting}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-200/40 dark:bg-slate-800 border border-slate-300/40 dark:border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-slate-800 dark:text-white font-medium transition-all duration-200"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase pl-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="password"
                required
                disabled={submitting}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-200/40 dark:bg-slate-800 border border-slate-300/40 dark:border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-slate-800 dark:text-white font-medium transition-all duration-200"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase pl-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="password"
                required
                disabled={submitting}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-200/40 dark:bg-slate-800 border border-slate-300/40 dark:border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-slate-800 dark:text-white font-medium transition-all duration-200"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 shadow-lg shadow-brand-500/10 flex items-center justify-center gap-2 disabled:opacity-50 transform active:scale-95 transition-all duration-200 mt-2"
          >
            {submitting ? 'Registering...' : 'Create Account'} <ArrowRight className="h-5 w-5" />
          </button>
        </form>

        {/* Toggle navigation */}
        <div className="text-center text-xs text-slate-400 border-t border-slate-200/40 dark:border-slate-800/40 pt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-500 font-semibold hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
