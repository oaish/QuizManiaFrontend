import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';
import { BookOpen, Trophy, BarChart2, ShieldAlert, ArrowRight, Zap, Target, BookMarked, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [dailyQuiz, setDailyQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, quizzesRes, dailyRes] = await Promise.all([
          api.get('/results/dashboard'),
          api.get('/quizzes'),
          api.get('/quizzes/daily-challenge').catch(() => null), // Safely fall back if not set
        ]);

        if (dashboardRes.success) {
          setData(dashboardRes);
        }
        if (quizzesRes.success) {
          setQuizzes(quizzesRes.data);
        }
        if (dailyRes && dailyRes.success) {
          setDailyQuiz(dailyRes);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard metrics. Connecting to MySQL...');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;

  // Destructure loaded data
  const { stats, categoryAnalytics = [], recentAttempts = [], bookmarks = [] } = data || {};

  // Standard Quizzes mapping
  const regularQuizzes = quizzes.filter(q => !q.isDailyChallenge);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monitor scores, accuracy trends, topic progress, and bookmarks.
          </p>
        </div>
      </div>

      {/* Daily Challenge Banner */}
      {dailyQuiz && dailyQuiz.quiz && (
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-700 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -z-10 translate-x-12 -translate-y-12"></div>
          <div className="flex flex-col gap-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold w-fit border border-white/10">
              <Zap className="h-3.5 w-3.5 fill-white" /> Daily Sprint Challenge
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              {dailyQuiz.quiz.title}
            </h2>
            <p className="text-sm text-brand-100 leading-relaxed">
              {dailyQuiz.quiz.description}
            </p>
            <div className="flex gap-4 text-xs font-medium text-brand-200 mt-2">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {Math.ceil(dailyQuiz.quiz.timeLimit / 60)} Mins Limit</span>
              <span className="flex items-center gap-1"><Target className="h-3.5 w-3.5" /> {dailyQuiz.quiz._count?.questions || 5} MCQs</span>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 flex-shrink-0">
            {dailyQuiz.completedToday ? (
              <div className="flex flex-col gap-1 items-end">
                <span className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" /> Submitted Today
                </span>
                <span className="text-xs text-brand-200">Score: {dailyQuiz.userScore} pts</span>
              </div>
            ) : (
              <Link
                to={`/quiz/${dailyQuiz.quiz.id}`}
                className="px-6 py-3 rounded-2xl bg-white text-brand-700 font-semibold hover:bg-brand-50 shadow-lg text-sm flex items-center gap-2 transform active:scale-95 transition-all duration-200"
              >
                Attempt Sprint Challenge <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Aggregate Score Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Cumulative Score</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats?.cumulativeScore || 0}</span>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Average Accuracy</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats?.averageAccuracy || 0}%</span>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Tests Completed</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats?.quizzesCompleted || 0}</span>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
            <BookMarked className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Bookmarked Questions</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{bookmarks?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Split Charts & Category Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recharts Graphical Trends */}
        <div className="glass-card p-6 lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-brand-500" /> Topic Performance & Accuracy Breakdown
          </h3>
          <div className="h-72 w-full mt-2">
            {categoryAnalytics.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(30, 41, 59, 0.9)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="accuracy" name="Accuracy %" fill="#4763ff" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="correct" name="Correct Answers" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl text-slate-400 text-sm">
                No attempt metrics available. Complete a quiz to populate analytical insights.
              </div>
            )}
          </div>
        </div>

        {/* Categories Progress Cards */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Topic Achievements
          </h3>
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[17.5rem] pr-2">
            {categoryAnalytics.length > 0 ? (
              categoryAnalytics.map((cat, idx) => (
                <div key={idx} className="flex flex-col gap-1.5 border-b border-slate-200/40 dark:border-slate-800/40 pb-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{cat.name}</span>
                    <span className={`font-bold ${cat.accuracy >= 70 ? 'text-emerald-500' : cat.accuracy >= 45 ? 'text-amber-500' : 'text-rose-500'}`}>
                      {cat.accuracy}% Accuracy
                    </span>
                  </div>
                  {/* Visual Progress Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full progress-bar-fluid ${cat.accuracy >= 70 ? 'bg-emerald-500' : cat.accuracy >= 45 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${cat.accuracy}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-xs text-center py-10">No topic achievements locked yet.</p>
            )}
          </div>
        </div>

      </div>

      {/* Available Practice Sets & General Quizzes */}
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Active General Practice Quizzes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {regularQuizzes.length > 0 ? (
            regularQuizzes.map((quiz, idx) => (
              <div key={idx} className="glass-card p-6 flex flex-col justify-between gap-4 border border-slate-200/30 dark:border-slate-800/30 hover:border-brand-500/20 transition-all duration-300">
                <div className="flex flex-col gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold text-xs w-fit">
                    {quiz.category?.name || 'General Aptitude'}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {quiz.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed min-h-[2.5rem]">
                    {quiz.description}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200/30 dark:border-slate-800/30 pt-4 mt-2">
                  <span className="text-xs text-slate-400">{quiz._count?.questions || 10} Questions</span>
                  <Link
                    to={`/quiz/${quiz.id}`}
                    className="px-4 py-2 rounded-xl bg-slate-200/60 dark:bg-slate-800 text-brand-500 hover:bg-brand-500 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all duration-200"
                  >
                    Start Test <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-slate-400 text-sm">
              No active practice quizzes uploaded yet.
            </div>
          )}
        </div>
      </section>

      {/* Split recent activity history list & bookmarked questions list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Recent Attempts History */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Recent Attempts History
          </h3>
          <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-2">
            {recentAttempts.length > 0 ? (
              recentAttempts.map((att, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-200/20 dark:bg-slate-800/20 border border-slate-200/30 dark:border-slate-800/30">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[12rem]">
                      {att.quizTitle}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(att.completedAt).toLocaleDateString()} at {new Date(att.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-bold text-brand-500 block">{att.score} pts</span>
                      <span className="text-[10px] text-slate-400">{att.accuracy}% acc</span>
                    </div>
                    <Link
                      to={`/results/${att.attemptId}`}
                      className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500 hover:bg-brand-500 hover:text-white transition-colors duration-200"
                    >
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
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Bookmarked Questions
          </h3>
          <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-2">
            {bookmarks.length > 0 ? (
              bookmarks.map((q, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-200/20 dark:bg-slate-800/20 border border-slate-200/30 dark:border-slate-800/30">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[15rem]">
                      {q.questionText}
                    </span>
                    <div className="flex gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-500 font-semibold">{q.category}</span>
                      <span className="text-[10px] text-slate-400 capitalize">{q.difficulty}</span>
                    </div>
                  </div>
                  <Link
                    to={`/quiz/practice?bookmark=${q.id}`}
                    className="p-1.5 rounded-lg bg-brand-500/10 text-brand-500 hover:bg-brand-500 hover:text-white transition-colors duration-200"
                    title="Practice this question"
                  >
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

export default Dashboard;
