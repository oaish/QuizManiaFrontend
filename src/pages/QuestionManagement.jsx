import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import Sidebar from '../components/Sidebar';
import { BookOpen, Plus, Upload, Trash2, Edit2, AlertCircle, CheckCircle, Search, HelpCircle } from 'lucide-react';

const QuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Bulk Upload state
  const [jsonText, setJsonText] = useState('');
  const [bulkResult, setBulkResult] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState('');

  // Fetch Questions Function
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/questions?page=${page}&limit=8&search=${search}`);
      if (res.success) {
        setQuestions(res.data);
        setTotal(res.pagination.total);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [page, search]);

  // Bulk upload handler
  const handleBulkUpload = async (e) => {
    e.preventDefault();
    setBulkError('');
    setBulkResult(null);

    // 1. Verify JSON validity locally
    let parsedData = null;
    try {
      parsedData = JSON.parse(jsonText);
    } catch (err) {
      return setBulkError('Syntax Error: Invalid JSON structure. Verify all brackets and quotes.');
    }

    setBulkLoading(true);
    try {
      const res = await api.post('/admin/questions/bulk', parsedData);
      if (res.success) {
        setBulkResult(res);
        setJsonText('');
        fetchQuestions(); // Refresh listing
      }
    } catch (err) {
      setBulkError(err.message || 'Bulk upload parsed payload failed.');
    } finally {
      setBulkLoading(false);
    }
  };

  // Delete question handler
  const handleDeleteQuestion = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to permanently delete this question?');
    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/admin/questions/${id}`);
      if (res.success) {
        alert('Question deleted successfully.');
        fetchQuestions();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete question.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Workspace */}
      <main className="flex-grow flex flex-col gap-8">
        
        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-brand-500" /> Question Repository Manager
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Adjust the global database question bank, and perform high-speed bulk JSON uploads.
          </p>
        </div>

        {/* Dynamic Bulk Upload Section */}
        <section className="glass-card p-6 border border-slate-200/30 dark:border-slate-800/30 flex flex-col gap-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Upload className="h-5 w-5 text-indigo-500" /> Bulk JSON Pasted Question Uploader
          </h3>

          {bulkError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-500 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {bulkError}
            </div>
          )}

          {bulkResult && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-600 dark:text-emerald-400 flex flex-col gap-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle className="h-5 w-5" /> {bulkResult.message}
              </div>
              <p>Inserted count: {bulkResult.insertedCount} | Failed count: {bulkResult.failedCount}</p>
              {bulkResult.errors.length > 0 && (
                <div className="mt-2 max-h-32 overflow-y-auto bg-black/5 dark:bg-black/20 p-2 rounded-lg font-mono text-[10px] text-rose-500">
                  <span className="font-semibold block mb-1">Import failures list:</span>
                  {bulkResult.errors.map((err, i) => (
                    <div key={i}>Index #{err.index} ("{err.questionText.slice(0, 30)}..."): {err.error}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleBulkUpload} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                Paste JSON Array (Matching sample structure)
              </span>
              <textarea
                rows={5}
                required
                className="w-full p-4 rounded-xl bg-slate-200/40 dark:bg-slate-800 border border-slate-300/40 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all duration-200"
                placeholder={`[
  {
    "question": "A can complete a piece of work in 12 days. How many days will A take to complete 50% of the work?",
    "options": ["5 days", "6 days", "7 days", "8 days"],
    "correctAnswer": 1,
    "explanation": "If full work takes 12 days, half the work takes 6 days.",
    "difficulty": "easy",
    "category": "Time & Work",
    "companyTags": ["TCS", "Infosys"],
    "tags": ["time and work", "basic work"]
  }
]`}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={bulkLoading}
              className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 text-xs shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 transition-all duration-200 w-fit"
            >
              {bulkLoading ? 'Uploading payload...' : 'Parse and Import Questions'}
            </button>
          </form>
        </section>

        {/* Filter / Search header bar */}
        <section className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-200/20 dark:bg-slate-800/10 p-4 rounded-2xl border border-slate-200/30 dark:border-slate-800/30">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search question text..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-200/40 dark:bg-slate-800 border border-slate-300/40 dark:border-slate-700 text-xs focus:border-brand-500 outline-none transition-all"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">Total bank count: {total} Questions</span>
        </section>

        {/* Questions List Table */}
        <section className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-200/20 dark:bg-slate-800/20 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Question</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Difficulty</th>
                  <th className="py-4 px-6 text-center">Marks</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/30 dark:divide-slate-800/30 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400 font-medium animate-pulse">
                      Updating question tables...
                    </td>
                  </tr>
                ) : questions.length > 0 ? (
                  questions.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-200/10 dark:hover:bg-slate-800/10 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-100 max-w-[20rem] truncate">
                        {q.questionText}
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-medium">
                        {q.category?.name}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 rounded capitalize font-bold text-[10px] ${q.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-500' : q.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-300 font-bold">
                        {q.marks} pts
                      </td>
                      <td className="py-4 px-6 text-right flex justify-end gap-3">
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title="Delete Question"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400 font-medium">
                      No matching questions found in DB.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Simple pagination buttons */}
          {total > 8 && (
            <div className="flex justify-between items-center p-4 border-t border-slate-200/50 dark:border-slate-800/50 text-xs">
              <button
                disabled={page === 1}
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-500 font-semibold disabled:opacity-30"
              >
                Previous
              </button>
              <span className="text-slate-400 font-medium">Page {page} of {Math.ceil(total / 8)}</span>
              <button
                disabled={page >= Math.ceil(total / 8)}
                onClick={() => setPage(prev => prev + 1)}
                className="px-3 py-1.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-500 font-semibold disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </section>

      </main>

    </div>
  );
};

export default QuestionManagement;
