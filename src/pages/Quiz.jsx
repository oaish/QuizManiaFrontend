import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import { ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, CheckCircle2, AlertTriangle, AlertCircle, Clock, Zap } from 'lucide-react';

const Quiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Quiz Timer State
  const [remainingTime, setRemainingTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const timerRef = useRef(null);

  // Answers State: maps questionId to selectedOptionId
  const [answers, setAnswers] = useState({});
  const [bookmarks, setBookmarks] = useState({});
  const [timeSpentOnQuestion, setTimeSpentOnQuestion] = useState({});
  
  // Tracking time spent on active question
  const questionTimeRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  // 1. Initial Load of Quiz Attempt
  useEffect(() => {
    const initQuiz = async () => {
      try {
        const res = await api.post('/quizzes/start', { quizId: parseInt(quizId) });
        if (res.success) {
          setAttemptId(res.attemptId);
          setQuestions(res.questions);
          setRemainingTime(res.remainingTime);
          setTotalTime(res.quiz.timeLimit);

          // Populate answers & bookmarks already synced
          const ansMap = {};
          const bookMap = {};
          const spentMap = {};

          res.savedAnswers.forEach(ans => {
            if (ans.selectedOptionId) ansMap[ans.questionId] = ans.selectedOptionId;
            bookMap[ans.questionId] = ans.bookmarked;
            spentMap[ans.questionId] = ans.timeSpent;
          });

          setAnswers(ansMap);
          setBookmarks(bookMap);
          setTimeSpentOnQuestion(spentMap);
        }
      } catch (err) {
        console.error('Quiz start error:', err);
        setError(err.message || 'Failed to start quiz. Check your connection.');
      } finally {
        setLoading(false);
      }
    };

    initQuiz();

    return () => {
      clearInterval(timerRef.current);
      clearInterval(questionTimeRef.current);
    };
  }, [quizId]);

  // 2. Active Clock Countdown Trigger
  useEffect(() => {
    if (loading || error || submitting || remainingTime <= 0) return;

    timerRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit(); // Force submit when timer expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [loading, error, submitting, remainingTime]);

  // 3. Question Timer tracking (timeSpent calculation)
  useEffect(() => {
    if (loading || error || submitting || questions.length === 0) return;

    const currentQ = questions[currentIndex];
    
    // Stop previous question counter
    clearInterval(questionTimeRef.current);

    // Initialize timer for this question if empty
    if (timeSpentOnQuestion[currentQ.id] === undefined) {
      setTimeSpentOnQuestion(prev => ({ ...prev, [currentQ.id]: 0 }));
    }

    questionTimeRef.current = setInterval(() => {
      setTimeSpentOnQuestion(prev => ({
        ...prev,
        [currentQ.id]: (prev[currentQ.id] || 0) + 1
      }));
    }, 1000);

    return () => clearInterval(questionTimeRef.current);
  }, [currentIndex, loading, error, submitting, questions]);

  // 4. Autosave selection answers immediately
  const handleSelectOption = async (optionId) => {
    const currentQ = questions[currentIndex];
    const newAnswers = { ...answers, [currentQ.id]: optionId };
    setAnswers(newAnswers);

    // Dynamic sync to database (anti-loss autosave)
    try {
      await api.post(`/quizzes/attempts/${attemptId}/sync`, {
        questionId: currentQ.id,
        selectedOptionId: optionId,
        timeSpent: timeSpentOnQuestion[currentQ.id] || 0,
        bookmarked: !!bookmarks[currentQ.id],
        remainingTime: remainingTime
      });
    } catch (err) {
      console.warn('Sync failed:', err.message);
    }
  };

  // Skip question action
  const handleSkipQuestion = async () => {
    const currentQ = questions[currentIndex];
    const newAnswers = { ...answers };
    delete newAnswers[currentQ.id];
    setAnswers(newAnswers);

    try {
      await api.post(`/quizzes/attempts/${attemptId}/sync`, {
        questionId: currentQ.id,
        selectedOptionId: null,
        timeSpent: timeSpentOnQuestion[currentQ.id] || 0,
        bookmarked: !!bookmarks[currentQ.id],
        remainingTime: remainingTime
      });
    } catch (err) {
      console.warn('Sync failed:', err.message);
    }

    handleNext();
  };

  // Toggle question bookmark
  const handleToggleBookmark = async () => {
    const currentQ = questions[currentIndex];
    const nextBookmarkedState = !bookmarks[currentQ.id];
    
    setBookmarks(prev => ({ ...prev, [currentQ.id]: nextBookmarkedState }));

    try {
      await api.post(`/quizzes/attempts/${attemptId}/sync`, {
        questionId: currentQ.id,
        selectedOptionId: answers[currentQ.id] || null,
        timeSpent: timeSpentOnQuestion[currentQ.id] || 0,
        bookmarked: nextBookmarkedState,
        remainingTime: remainingTime
      });
    } catch (err) {
      console.warn('Sync bookmark failed:', err.message);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Force automatic submission on clock expiration
  const handleAutoSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await api.post(`/quizzes/attempts/${attemptId}/submit`);
      if (res.success) {
        navigate(`/results/${attemptId}`);
      }
    } catch (err) {
      console.error('Auto submission failed:', err);
      setError('Evaluation error. Quiz was ended.');
    }
  };

  // Manual Submission action with warning triggers
  const handleManualSubmit = async () => {
    const unansweredCount = questions.length - Object.keys(answers).length;

    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredCount} unanswered questions remaining. Are you sure you want to submit your quiz?`
      );
      if (!confirmSubmit) return;
    } else {
      const confirmSubmit = window.confirm('Are you ready to submit your quiz for scoring and analysis?');
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/quizzes/attempts/${attemptId}/submit`);
      if (res.success) {
        navigate(`/results/${attemptId}`);
      }
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  
  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 glass-card text-center flex flex-col gap-4">
        <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold">Quiz Session Interrupted</h2>
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

  const currentQuestion = questions[currentIndex];
  const selectedOptionId = answers[currentQuestion.id] || null;
  const isBookmarked = !!bookmarks[currentQuestion.id];

  // Helper formatting for remaining time
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Visual warning colors for timer
  const isTimeLow = remainingTime < 60; // Less than 1 minute left
  const timerColor = isTimeLow
    ? 'text-rose-500 animate-pulse bg-rose-500/10 border-rose-500/20'
    : remainingTime < 180
    ? 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    : 'text-slate-700 dark:text-slate-300 bg-slate-200/50 dark:bg-slate-800 border-slate-300/40 dark:border-slate-700';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6">
      
      {/* Top Header Information Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-card p-4">
        <div className="flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold text-sm">
            {currentIndex + 1}
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate max-w-[15rem] sm:max-w-xs">
              Question {currentIndex + 1} of {questions.length}
            </h2>
            <span className="text-[10px] text-slate-400 capitalize">Difficulty: {currentQuestion.difficulty}</span>
          </div>
        </div>

        {/* Countdown Timer with Dynamic Styles */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm font-bold transition-all duration-300 ${timerColor}`}>
          <Clock className="h-4 w-4" />
          <span>{formatTime(remainingTime)}</span>
        </div>
      </div>

      {/* Main Question Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Hand side questions cards grid for quick jumping */}
        <div className="glass-card p-4 grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-4 gap-2">
          {questions.map((q, idx) => {
            const hasAnswer = answers[q.id] !== undefined;
            const qBookmarked = !!bookmarks[q.id];
            
            let btnClass = 'bg-slate-200/50 dark:bg-slate-800 border-slate-300/40 dark:border-slate-700 hover:border-brand-500 text-slate-600 dark:text-slate-400';
            if (idx === currentIndex) {
              btnClass = 'bg-brand-500 text-white shadow shadow-brand-500/20 border-brand-500';
            } else if (hasAnswer) {
              btnClass = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 dark:text-emerald-400 hover:bg-emerald-500/20';
            } else if (qBookmarked) {
              btnClass = 'bg-brand-500/10 border-brand-500/30 text-brand-500 hover:bg-brand-500/20';
            }

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-9 w-9 rounded-lg border font-semibold text-xs flex items-center justify-center relative transition-all duration-200 ${btnClass}`}
              >
                {idx + 1}
                {qBookmarked && <span className="absolute top-0 right-0 h-1.5 w-1.5 bg-brand-500 rounded-full"></span>}
              </button>
            );
          })}
        </div>

        {/* Central Question Display Panel */}
        <div className="lg:col-span-3 glass-card p-6 md:p-8 flex flex-col gap-6 relative">
          
          {/* Question Text */}
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQuestion.questionText}
            </h3>
            
            {/* Bookmark button */}
            <button
              onClick={handleToggleBookmark}
              className={`p-2 rounded-xl border transition-all duration-200 ${isBookmarked ? 'bg-brand-500/10 border-brand-500/30 text-brand-500' : 'bg-slate-200/50 dark:bg-slate-800 border-slate-300/40 dark:border-slate-700 text-slate-400'}`}
              title="Bookmark Question"
            >
              {isBookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
            </button>
          </div>

          {/* Option Selectors List */}
          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((opt) => {
              const isSelected = opt.id === selectedOptionId;
              const optionClass = isSelected
                ? 'bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 font-semibold ring-1 ring-brand-500'
                : 'bg-slate-200/40 dark:bg-slate-800/60 border-slate-300/40 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-brand-500/40';

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full text-left p-4 rounded-xl border flex items-center justify-between gap-4 transition-all duration-200 ${optionClass}`}
                >
                  <span className="text-sm font-medium">{opt.optionText}</span>
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-brand-500 bg-brand-500' : 'border-slate-300 dark:border-slate-600'}`}>
                    {isSelected && <div className="h-2.5 w-2.5 bg-white rounded-full"></div>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Skip and Bookmark information logs */}
          <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-200/40 dark:border-slate-800/40 pt-4">
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Time Spent: {timeSpentOnQuestion[currentQuestion.id] || 0} seconds</span>
            <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> Worth: {currentQuestion.marks} Mark(s)</span>
          </div>

        </div>

      </div>

      {/* Bottom Control Bar Options */}
      <div className="flex justify-between items-center gap-4 glass-card p-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-4 py-2.5 rounded-xl border border-slate-300/40 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-500 hover:text-brand-500 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-300/40 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" /> Previous
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSkipQuestion}
            className="px-4 py-2.5 rounded-xl bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/80 font-semibold text-xs sm:text-sm transition-all duration-200"
          >
            Skip Question
          </button>
          
          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleManualSubmit}
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 hover:shadow-lg shadow-brand-500/10 text-xs sm:text-sm flex items-center gap-1.5 transform active:scale-95 disabled:opacity-50 transition-all duration-200"
            >
              Submit Quiz <CheckCircle2 className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2.5 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 hover:shadow-lg shadow-brand-500/10 text-xs sm:text-sm flex items-center gap-1.5 transform active:scale-95 transition-all duration-200"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default Quiz;
