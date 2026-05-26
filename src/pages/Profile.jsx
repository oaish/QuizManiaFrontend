import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/Loading';
import { User, Mail, Shield, Trophy, Target, BookMarked, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await api.get('/results/dashboard');
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Error fetching profile dashboard data:', err);
        setError('Failed to fetch user metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) return <Loading />;

  const { stats, recentAttempts = [], bookmarks = [] } = data || {};

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Your Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your account credentials and view your overall aptitude metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* User Card */}
        <div className="glass-card p-6 flex flex-col gap-6 items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-500 to-indigo-500"></div>
          
          <div className="h-20 w-20 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 text-3xl font-bold border border-slate-300/40">
            {user?.name.charAt(0).toUpperCase()}
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h3>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{user?.role}</span>
          </div>

          <div className="w-full flex flex-col gap-3 border-t border-slate-200/40 dark:border-slate-800/40 pt-4 text-left text-sm">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-slate-400" />
              <span className="text-slate-600 dark:text-slate-300 font-medium truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-slate-400" />
              <span className="text-slate-600 dark:text-slate-300 font-medium capitalize">Access Level: {user?.role}</span>
            </div>
          </div>
        </div>

        {/* User Stats Card */}
        <div className="glass-card p-6 md:col-span-2 flex flex-col gap-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Overall Statistics Achievements</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-200/20 dark:bg-slate-800/20 border border-slate-200/30 dark:border-slate-800/30 flex items-center gap-3">
              <Trophy className="h-8 w-8 text-brand-500" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Cumulative Score</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{stats?.cumulativeScore || 0} pts</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-200/20 dark:bg-slate-800/20 border border-slate-200/30 dark:border-slate-800/30 flex items-center gap-3">
              <Target className="h-8 w-8 text-emerald-500" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Average Accuracy</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{stats?.averageAccuracy || 0}%</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-200/20 dark:bg-slate-800/20 border border-slate-200/30 dark:border-slate-800/30 flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-blue-500" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Tests Completed</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{stats?.quizzesCompleted || 0}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-200/20 dark:bg-slate-800/20 border border-slate-200/30 dark:border-slate-800/30 flex items-center gap-3">
              <BookMarked className="h-8 w-8 text-indigo-500" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Bookmarked Questions</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{bookmarks?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Split recent activity history list & bookmarked questions list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Recent Attempts History */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Attempts History</h3>
          <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-2">
            {recentAttempts.length > 0 ? (
              recentAttempts.map((att, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-200/20 dark:bg-slate-800/20 border border-slate-200/30 dark:border-slate-800/30">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[12rem]">{att.quizTitle}</span>
                    <span className="text-[10px] text-slate-400">{new Date(att.completedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-bold text-brand-500 block">{att.score} pts</span>
                      <span className="text-[10px] text-slate-400">{att.accuracy}% acc</span>
                    </div>
                    <Link to={`/results/${att.attemptId}`} className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500 hover:bg-brand-500 hover:text-white transition-colors duration-200">
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-xs text-center py-10">No quizzes completed yet.</p>
            )}
          </div>
        </div>

        {/* Bookmarked Questions */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Saved Bookmarked Questions</h3>
          <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-2">
            {bookmarks.length > 0 ? (
              bookmarks.map((q, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-200/20 dark:bg-slate-800/20 border border-slate-200/30 dark:border-slate-800/30">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[15rem]">{q.questionText}</span>
                    <div className="flex gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-500 font-semibold">{q.category}</span>
                      <span className="text-[10px] text-slate-400 capitalize">{q.difficulty}</span>
                    </div>
                  </div>
                  <Link to={`/quiz/practice?bookmark=${q.id}`} className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500 hover:bg-brand-500 hover:text-white transition-colors duration-200" title="Practice this question">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-xs text-center py-10">No bookmarks saved yet.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Profile;
