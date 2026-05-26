import React from 'react';
import { HelpCircle, Award, Compass, HeartHandshake } from 'lucide-react';

const About = () => {
  const cards = [
    {
      title: 'Our Mission',
      desc: 'To deliver a premium, highly scientific training ecosystem that bridges the academic gap and helps students ace corporate aptitude assessments.',
      icon: Compass,
      color: 'text-brand-500'
    },
    {
      title: 'Our Method',
      desc: 'Through randomized questions, immediate performance evaluations, automated error tracking, and gamified leaderboards, we solidify aptitude mechanics.',
      icon: Award,
      color: 'text-emerald-500'
    },
    {
      title: 'Subject Areas',
      desc: 'Comprehensive modules covering Quantitative Math, Deductive Logical Reasoning, Grammar Comprehension, and Chart Data Interpretations.',
      icon: HelpCircle,
      color: 'text-indigo-500'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-16">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto flex flex-col gap-4">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          About QuizMania
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400">
          QuizMania is a state-of-the-art aptitude diagnostic engine designed to help college students, software developers, and GATE candidates sharpen their critical analysis skills.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass-card p-8 flex flex-col gap-4">
              <Icon className={`h-8 w-8 ${card.color}`} />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {card.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {card.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Structured Subjects Section */}
      <section className="glass-card p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-grow flex flex-col gap-4 max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Why Aptitude Evaluation Matters
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Corporate giants like TCS, Infosys, Wipro, Amazon, and Google use aptitude evaluations as primary qualifiers. These tests assess logical speed, quantitative precision, vocabulary agility, and data processing capability. 
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            QuizMania breaks down performance into 8 distinct subjects (e.g. Work Rates, Percentages, Probability, Logical Deduction), showing category accuracy metrics so that candidates can immediately target weak zones.
          </p>
        </div>
        <div className="flex-shrink-0 h-44 w-44 rounded-2xl bg-gradient-to-tr from-brand-500/10 to-indigo-500/10 border border-brand-500/20 flex items-center justify-center">
          <HeartHandshake className="h-16 w-16 text-brand-500" />
        </div>
      </section>

    </div>
  );
};

export default About;
