import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Trophy, BarChart2, ShieldAlert, CheckCircle, ArrowRight, Zap, Target } from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();

  const features = [
    {
      title: 'Practice Mode',
      desc: 'Hone your speed and accuracy with categorized aptitude questions, topic-wise practice, and detailed explanations.',
      icon: BookOpen,
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: 'Daily Challenges',
      desc: 'Participate in time-pressured daily sprints. Build streaks, scale levels, and earn placements rankings.',
      icon: Zap,
      color: 'bg-amber-500/10 text-amber-500',
    },
    {
      title: 'Deep-dive Analytics',
      desc: 'Get breakdown performance charts using Recharts. Track accuracy gaps, percentile ratios, and focus areas.',
      icon: BarChart2,
      color: 'bg-emerald-500/10 text-emerald-500',
    },
    {
      title: 'Global Leaderboards',
      desc: 'Compete live with peers. Achieve cumulative ranks and share scores directly to professional networks.',
      icon: Trophy,
      color: 'bg-purple-500/10 text-purple-500',
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-between">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/10 h-72 w-72 rounded-full bg-brand-500/5 blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/10 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl -z-10 animate-pulse delay-700"></div>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 pb-12 flex-grow flex flex-col justify-center items-center gap-6">
        
        {/* Placements badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold border border-brand-500/20 shadow-sm">
          <Target className="h-3.5 w-3.5" /> Placements & GATE Aptitude Preparation Engine
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none text-slate-900 dark:text-white max-w-4xl">
          Conquer Placements with <br />
          <span className="bg-gradient-to-r from-brand-500 via-indigo-500 to-indigo-600 bg-clip-text text-transparent">
            Aptitude Mastery
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl">
          QuizMania combines detailed multiple-choice question modules, real-time response evaluations, robust resume systems, and state-of-the-art gamification to elevate your cognitive agility.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
          {user ? (
            <Link
              to="/dashboard"
              className="px-8 py-4 rounded-2xl bg-brand-500 text-white font-semibold hover:bg-brand-600 shadow-xl shadow-brand-500/20 flex items-center justify-center gap-2 transform active:scale-95 transition-all duration-200"
            >
              Go to Performance Dashboard <ArrowRight className="h-5 w-5" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="px-8 py-4 rounded-2xl bg-brand-500 text-white font-semibold hover:bg-brand-600 shadow-xl shadow-brand-500/20 flex items-center justify-center gap-2 transform active:scale-95 transition-all duration-200"
              >
                Get Started for Free <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 rounded-2xl bg-slate-200/60 dark:bg-slate-800 text-slate-800 dark:text-white font-semibold hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-300/40 dark:border-slate-700 flex items-center justify-center transition-all duration-200"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="glass-card p-6 flex flex-col gap-4 glow-on-hover hover:-translate-y-1"
              >
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold ${feat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust & Company Tags Footer */}
      <footer className="w-full py-8 border-t border-slate-200/40 dark:border-slate-800/40 text-center text-xs text-slate-400">
        <p className="mb-3">Prepare for recruitments at top global innovators</p>
        <div className="flex flex-wrap justify-center gap-6 opacity-40 grayscale select-none">
          <span>Google</span>
          <span>Amazon</span>
          <span>TCS</span>
          <span>Infosys</span>
          <span>Accenture</span>
          <span>Microsoft</span>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
