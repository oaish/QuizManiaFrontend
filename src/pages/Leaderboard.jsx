import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import { Trophy, Target, Award, ArrowUp, Medal, Sparkles, AlertCircle } from 'lucide-react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/results/leaderboard');
        if (res.success) {
          setLeaderboard(res.leaderboard);
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to fetch leaderboard. Please verify MySQL connectivity.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <Loading />;

  // Separate top 3 podium entries
  const podium = leaderboard.slice(0, 3);
  const regularRows = leaderboard.slice(3);

  // Podiums colors mapping
  const podiumStyles = [
    { bg: 'from-amber-400 via-amber-300 to-yellow-500', medal: 'text-amber-500 fill-amber-200' }, // Gold
    { bg: 'from-slate-400 via-slate-300 to-slate-500', medal: 'text-slate-400 fill-slate-200' }, // Silver
    { bg: 'from-amber-700 via-amber-600 to-amber-800', medal: 'text-amber-700 fill-amber-900' }, // Bronze
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8 text-amber-500 fill-amber-100 dark:fill-none" /> Global Leaderboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Rankings are calculated dynamically based on overall cumulative score, tied ranks resolved by average accuracy.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-sm text-rose-500 flex items-center gap-2 max-w-md mx-auto">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Top 3 Podium Visual Display */}
      {podium.length > 0 && (
        <div className="flex flex-col md:flex-row justify-center items-end gap-6 mt-4">
          {/* Order: 2nd place (Left), 1st place (Center), 3rd place (Right) */}
          {[1, 0, 2].map((idx) => {
            const runner = podium[idx];
            if (!runner) return null;
            const style = podiumStyles[idx];
            const height = idx === 0 ? 'h-64' : idx === 1 ? 'h-52' : 'h-44';
            const scale = idx === 0 ? 'scale-105 z-10' : '';

            return (
              <div
                key={runner.userId}
                className={`w-full md:w-56 glass-card p-6 flex flex-col gap-4 items-center text-center relative overflow-hidden transition-all duration-300 hover:scale-105 shadow-xl ${scale}`}
              >
                {/* Top thin accent line */}
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${style.bg}`}></div>
                
                {/* Medal rank visual circle */}
                <div className="relative">
                  <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center border-2 border-slate-300 dark:border-slate-700">
                    <span className="text-xl font-black text-slate-700 dark:text-slate-200">
                      {idx + 1}
                    </span>
                  </div>
                  <Medal className={`absolute -bottom-1 -right-1 h-6 w-6 ${style.medal}`} />
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 truncate max-w-[12rem]">
                    {runner.name}
                  </h3>
                  <span className="text-[10px] text-slate-400">Rank #{idx + 1}</span>
                </div>

                <div className="w-full border-t border-slate-200/40 dark:border-slate-800/40 pt-3 mt-1 flex justify-around text-xs">
                  <div>
                    <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">Score</span>
                    <span className="font-extrabold text-brand-500">{runner.cumulativeScore} pts</span>
                  </div>
                  <div className="border-l border-slate-200/40 dark:border-slate-800/40 pl-4">
                    <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider">Accuracy</span>
                    <span className="font-bold text-emerald-500">{runner.avgAccuracy}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ranks 4 to 50 list table */}
      <section className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-200/20 dark:bg-slate-800/20 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 text-center">Rank</th>
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Quizzes Done</th>
                <th className="py-4 px-6 text-right">Avg Accuracy</th>
                <th className="py-4 px-6 text-right">Cumulative Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/30 dark:divide-slate-800/30 text-sm">
              {regularRows.length > 0 ? (
                regularRows.map((runner, idx) => (
                  <tr
                    key={runner.userId}
                    className="hover:bg-slate-200/10 dark:hover:bg-slate-800/10 transition-colors duration-150"
                  >
                    <td className="py-4 px-6 text-center font-bold text-slate-500">
                      #{idx + 4}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-100">
                      {runner.name}
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {runner.quizzesCompleted} Completed
                    </td>
                    <td className="py-4 px-6 text-right text-emerald-500 font-semibold">
                      {runner.avgAccuracy}%
                    </td>
                    <td className="py-4 px-6 text-right text-brand-500 font-extrabold">
                      {runner.cumulativeScore} pts
                    </td>
                  </tr>
                ))
              ) : podium.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400 font-medium">
                    No rank submissions logged yet. Start attempting quizzes to rise up!
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};

export default Leaderboard;
