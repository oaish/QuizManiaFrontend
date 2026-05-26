import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import Sidebar from '../components/Sidebar';
import { BarChart2, Shield, Eye, Clock, Award, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuizAnalytics = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizCompletions = async () => {
      try {
        const res = await api.get('/quizzes');
        if (res.success) {
          setQuizzes(res.data);
        }
      } catch (err) {
        console.error('Error fetching quizzes analytics:', err);
        setError('Failed to fetch platform quiz metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizCompletions();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace */}
      <main className="flex-grow flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart2 className="h-8 w-8 text-brand-500" /> Platform Quiz Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Evaluate popularity statistics, time limits, and question aggregates by quiz title.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-sm text-rose-500 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Quiz listings analytics card */}
        <section className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-200/20 dark:bg-slate-800/20 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Quiz Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6 text-center">Time Limit</th>
                  <th className="py-4 px-6 text-center">Questions</th>
                  <th className="py-4 px-6 text-center">Completions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/30 dark:divide-slate-800/30 text-xs font-medium">
                {quizzes.length > 0 ? (
                  quizzes.map((quiz) => (
                    <tr
                      key={quiz.id}
                      className="hover:bg-slate-200/10 dark:hover:bg-slate-800/10 transition-colors"
                    >
                      <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-100">
                        {quiz.title}
                        {quiz.isDailyChallenge && (
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-extrabold text-[9px] uppercase tracking-wide">
                            Daily Challenge
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {quiz.category?.name || 'General Aptitude'}
                      </td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-400 font-semibold flex items-center justify-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" /> {Math.ceil(quiz.timeLimit / 60)} Mins
                      </td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-400 font-bold">
                        {quiz._count?.questions || 0} Questions
                      </td>
                      <td className="py-4 px-6 text-center text-brand-500 font-extrabold">
                        {quiz._count?.attempts || 0} Attempts
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400 font-semibold">
                      No quizzes registered on the platform.
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

export default QuizAnalytics;
