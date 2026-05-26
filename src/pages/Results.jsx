import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, CheckCircle, XCircle, HelpCircle, ArrowRight, BarChart2, Target, Trophy, Clock, Check, AlertCircle } from 'lucide-react';

const Results = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get(`/results/attempts/${attemptId}`);
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Error fetching results:', err);
        setError(err.message || 'Failed to compile results report.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [attemptId]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 glass-card text-center flex flex-col gap-4">
        <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold">Report Compilation Error</h2>
        <p className="text-sm text-slate-400">{error}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2 bg-brand-500 text-white rounded-xl font-semibold shadow hover:bg-brand-600"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const { result, review, startedAt, completedAt, quizTitle } = data || {};
  
  // Format Category Performance data for Recharts
  const categoryChartData = [];
  if (result?.categoryAnalysis) {
    Object.keys(result.categoryAnalysis).forEach(catId => {
      const cat = result.categoryAnalysis[catId];
      if (cat.totalQuestions > 0) {
        categoryChartData.push({
          name: cat.name.split(' ')[0], // short name
          accuracy: parseFloat(cat.accuracy || 0.0),
          correct: cat.correct,
          attempted: cat.attempted
        });
      }
    });
  }

  // Time taken formatting
  const durationSecs = Math.max(0, Math.floor((new Date(completedAt) - new Date(startedAt)) / 1000));
  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m} Mins ${s} Secs`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      
      {/* Header Description */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs px-2.5 py-1 rounded bg-brand-500/10 text-brand-500 font-bold uppercase tracking-wider">
            Quiz Completed
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            {quizTitle}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Completed on {new Date(completedAt).toLocaleDateString()} at {new Date(completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <Link
          to="/dashboard"
          className="px-5 py-2.5 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 shadow-md shadow-brand-500/10 text-sm transform active:scale-95 transition-all duration-200"
        >
          Return to Dashboard
        </Link>
      </div>

      {/* Aggregate Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Score with negative marking indicator */}
        <div className="glass-card p-6 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-r from-brand-500 to-indigo-500"></div>
          <div className="h-12 w-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Total Score</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{result?.totalScore} pts</span>
          </div>
        </div>

        {/* Accuracy Gauge card */}
        <div className="glass-card p-6 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-1.5 w-full bg-emerald-500"></div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Accuracy Rate</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{result?.accuracy}%</span>
          </div>
        </div>

        {/* Percentile ranking */}
        <div className="glass-card p-6 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-1.5 w-full bg-indigo-500"></div>
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Percentile Ranks</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">~ {Math.ceil(result?.percentile || 99.0)}%</span>
          </div>
        </div>

        {/* Duration Taken */}
        <div className="glass-card p-6 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-1.5 w-full bg-slate-400"></div>
          <div className="h-12 w-12 rounded-2xl bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Time Taken</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">{formatDuration(durationSecs)}</span>
          </div>
        </div>

      </div>

      {/* Answer counts stats panel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 glass-card bg-slate-200/20 dark:bg-slate-800/10">
        <div className="text-center py-2">
          <span className="text-2xl font-extrabold text-slate-700 dark:text-slate-200 block">{result?.attemptedCount}</span>
          <span className="text-[10px] text-slate-400 uppercase font-bold">Attempted</span>
        </div>
        <div className="text-center py-2 border-l border-slate-200/40 dark:border-slate-800/40">
          <span className="text-2xl font-extrabold text-emerald-500 block">{result?.correctCount}</span>
          <span className="text-[10px] text-slate-400 uppercase font-bold">Correct</span>
        </div>
        <div className="text-center py-2 border-l border-slate-200/40 dark:border-slate-800/40">
          <span className="text-2xl font-extrabold text-rose-500 block">{result?.incorrectCount}</span>
          <span className="text-[10px] text-slate-400 uppercase font-bold">Incorrect</span>
        </div>
        <div className="text-center py-2 border-l border-slate-200/40 dark:border-slate-800/40">
          <span className="text-2xl font-extrabold text-slate-400 block">{result?.skippedCount}</span>
          <span className="text-[10px] text-slate-400 uppercase font-bold">Skipped</span>
        </div>
      </div>

      {/* Recharts Analytics Breakdown */}
      {categoryChartData.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <BarChart2 className="h-5 w-5 text-brand-500" /> Category-wise Accuracy Rates
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
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
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Detailed Question Keys & Step-by-Step Explanations Review */}
      <section className="flex flex-col gap-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Detailed Question Keys Review
        </h3>
        <div className="flex flex-col gap-6">
          {review && review.map((q, idx) => {
            
            // Determine question badge status
            const hasSkipped = q.selectedOptionId === null;
            let statusBadge = (
              <span className="px-3 py-1 rounded-lg bg-slate-200/60 dark:bg-slate-800 text-slate-500 font-semibold text-xs flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5" /> Skipped
              </span>
            );
            
            if (!hasSkipped) {
              statusBadge = q.isCorrect ? (
                <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 font-semibold text-xs flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Correct (+{q.marks})
                </span>
              ) : (
                <span className="px-3 py-1 rounded-lg bg-rose-500/10 text-rose-500 font-semibold text-xs flex items-center gap-1">
                  <XCircle className="h-3.5 w-3.5" /> Incorrect (-{q.negativeMarks})
                </span>
              );
            }

            return (
              <div key={q.id} className="glass-card p-6 md:p-8 flex flex-col gap-4 border border-slate-200/30 dark:border-slate-800/30">
                
                {/* Badge Header Row */}
                <div className="flex justify-between items-center gap-4 flex-wrap">
                  <div className="flex gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-brand-500/10 text-brand-500 font-bold text-xs uppercase tracking-wide">
                      Q{idx + 1}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-400">{q.category}</span>
                  </div>
                  {statusBadge}
                </div>

                {/* Question Text */}
                <h4 className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                  {q.questionText}
                </h4>

                {/* Options Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {q.options.map(opt => {
                    let optClass = 'bg-slate-200/40 dark:bg-slate-800/60 border-slate-300/40 dark:border-slate-700 text-slate-700 dark:text-slate-300';
                    let markIcon = null;

                    if (opt.isCorrect) {
                      optClass = 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold ring-1 ring-emerald-500';
                      markIcon = <Check className="h-4.5 w-4.5 text-emerald-500" />;
                    } else if (opt.isSelected && !opt.isCorrect) {
                      optClass = 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 font-semibold ring-1 ring-rose-500';
                      markIcon = <XCircle className="h-4.5 w-4.5 text-rose-500" />;
                    }

                    return (
                      <div key={opt.id} className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all duration-200 ${optClass}`}>
                        <span className="text-sm font-medium">{opt.optionText}</span>
                        {markIcon}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation block */}
                {q.explanation && (
                  <div className="p-4 rounded-2xl bg-brand-500/5 border border-brand-500/10 mt-2">
                    <span className="text-xs font-extrabold text-brand-500 block mb-1">
                      Step-by-Step Mathematical Explanation:
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default Results;
