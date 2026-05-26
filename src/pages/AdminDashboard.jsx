import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import Sidebar from '../components/Sidebar';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Users, BookOpen, Target, Award, Shield, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.success) {
          setStats(res.stats);
          setChartData(res.chartData.quizPopularity);
        }
      } catch (err) {
        console.error('Error fetching admin dashboard statistics:', err);
        setError('Failed to fetch platform metrics. Verify administrative role privileges.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      
      {/*Collapsible Navigation Sidebar */}
      <Sidebar />

      {/* Main Admin Dashboard Workspace */}
      <main className="flex-grow flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8 text-brand-500" /> Administrative Console
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            System aggregates, resource adjustments, and analytical metrics.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-sm text-rose-500 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Aggregate platform metrics grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 border border-slate-200/30 dark:border-slate-800/30">
            <Users className="h-6 w-6 text-brand-500 mb-2" />
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Active Users</span>
            <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{stats?.totalUsers || 0}</span>
          </div>

          <div className="glass-card p-5 border border-slate-200/30 dark:border-slate-800/30">
            <BookOpen className="h-6 w-6 text-indigo-500 mb-2" />
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Quizzes Count</span>
            <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{stats?.totalQuizzes || 0}</span>
          </div>

          <div className="glass-card p-5 border border-slate-200/30 dark:border-slate-800/30">
            <Target className="h-6 w-6 text-emerald-500 mb-2" />
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Questions Bank</span>
            <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{stats?.totalQuestions || 0}</span>
          </div>

          <div className="glass-card p-5 border border-slate-200/30 dark:border-slate-800/30">
            <Award className="h-6 w-6 text-amber-500 mb-2" />
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Attempts Done</span>
            <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{stats?.totalCompletedAttempts || 0}</span>
          </div>
        </div>

        {/* Split system charts */}
        <div className="grid grid-cols-1 gap-6">
          <div className="glass-card p-6 border border-slate-200/30 dark:border-slate-800/30">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Completed Attempts Popularity by Quiz Title
            </h3>
            <div className="h-72 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="title" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(30, 41, 59, 0.9)',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="attemptsCount" name="Attempts Completed" fill="#4763ff" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
                  No completed attempts popularity charts generated yet.
                </div>
              )}
            </div>
          </div>
        </div>

      </main>

    </div>
  );
};

export default AdminDashboard;
