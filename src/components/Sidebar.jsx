import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, BookOpen, Users, PlusCircle, LayoutDashboard, Database } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Questions', path: '/admin/questions', icon: BookOpen },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Quiz Analytics', path: '/admin/analytics', icon: BarChart2 },
  ];

  const isActive = (path) => {
    return location.pathname === path
      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all duration-200';
  };

  return (
    <aside className="w-full md:w-64 glass-card p-4 flex flex-col gap-6 md:min-h-[calc(100vh-8rem)]">
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-3 mb-3">
          Admin Console
        </h3>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${isActive(item.path)}`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-slate-200/40 dark:border-slate-800/40 pt-4">
        <div className="p-3 bg-brand-500/5 dark:bg-brand-500/10 rounded-xl border border-brand-500/10 text-center">
          <Database className="h-6 w-6 text-brand-500 mx-auto mb-2" />
          <span className="text-xs font-semibold text-brand-500 block">
            Prisma & MySQL Mode
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            Status: Fully Connected
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
