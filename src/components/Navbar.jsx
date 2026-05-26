import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, Menu, X, User, BarChart2, BookOpen, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-brand-500 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors duration-200';
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel-light dark:glass-panel-dark border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Branding */}
          <div className="flex items-center">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-extrabold shadow-lg shadow-brand-500/20 transform group-hover:scale-105 transition-transform duration-200">
                QM
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent tracking-tight">
                Quiz<span className="text-brand-500">Mania</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Linkages */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/about" className={isActive("/about")}>About</Link>
            {user ? (
              <>
                <Link to="/dashboard" className={isActive("/dashboard")}>Dashboard</Link>
                <Link to="/leaderboard" className={isActive("/leaderboard")}>Leaderboard</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20 text-xs font-semibold hover:bg-brand-500 hover:text-white transition-all duration-300">
                    <Shield className="h-3.5 w-3.5" /> Admin Panel
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors duration-200">Login</Link>
                <Link to="/register" className="px-4 py-2 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600 shadow-md shadow-brand-500/10 transform active:scale-95 transition-all duration-200">
                  Register
                </Link>
              </>
            )}

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400 transition-all duration-200"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user && (
              <div className="flex items-center gap-4 border-l border-slate-200/60 dark:border-slate-800/60 pl-6">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold border border-slate-300/40 group-hover:border-brand-500 transition-colors duration-200">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-brand-500 transition-colors duration-200">
                    {user.name}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Drawer Trigger */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-lg text-slate-500">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel-light dark:glass-panel-dark border-b border-slate-200/50 dark:border-slate-800/50 px-4 pt-2 pb-4 space-y-2">
          <Link to="/about" className="block px-3 py-2 rounded-lg text-base hover:bg-slate-200/50 dark:hover:bg-slate-800/50" onClick={() => setMobileMenuOpen(false)}>About</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="block px-3 py-2 rounded-lg text-base hover:bg-slate-200/50 dark:hover:bg-slate-800/50" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <Link to="/leaderboard" className="block px-3 py-2 rounded-lg text-base hover:bg-slate-200/50 dark:hover:bg-slate-800/50" onClick={() => setMobileMenuOpen(false)}>Leaderboard</Link>
              <Link to="/profile" className="block px-3 py-2 rounded-lg text-base hover:bg-slate-200/50 dark:hover:bg-slate-800/50" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="block px-3 py-2 rounded-lg text-base text-brand-500 font-semibold hover:bg-slate-200/50" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>
              )}
              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full text-left block px-3 py-2 rounded-lg text-base text-rose-500 hover:bg-rose-500/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 rounded-lg text-base hover:bg-slate-200/50 dark:hover:bg-slate-800/50" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className="block px-3 py-2 rounded-lg text-base text-brand-500 font-semibold hover:bg-slate-200/50" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
