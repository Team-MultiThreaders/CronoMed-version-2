import { useState, useEffect, useRef } from 'react';
import { Users, Clock, Stethoscope, LogOut, AlertTriangle, CheckCircle, Save, ShieldCheck } from 'lucide-react';
import api from '../api/client';
import AmbientBackground from '../components/AmbientBackground';
import useCountUp from '../hooks/useCountUp';

function ElapsedBadge({ elapsedSeconds, avgConsultationTime }) {
  if (elapsedSeconds == null) return null;
  const elapsedMin = Math.floor(elapsedSeconds / 60);
  const elapsedSec = elapsedSeconds % 60;
  const avgSeconds = (avgConsultationTime || 0) * 60;
  const isOver = elapsedSeconds > avgSeconds;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
        isOver
          ? 'bg-red-100 text-red-700 animate-pulse'
          : 'bg-emerald-100 text-emerald-700'
      }`}
    >
      {isOver && <AlertTriangle size={12} />}
      <Clock size={12} />
      {elapsedMin}m {elapsedSec}s
      {isOver && ' ⚠️ Over'}
    </span>
  );
}

function DoctorRow({ doc, onSaveAvgTime }) {
  const [editTime, setEditTime] = useState(doc.avgConsultationTime ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Keep input in sync if polling updates the value externally
  const prevAvg = useRef(doc.avgConsultationTime);
  useEffect(() => {
    if (doc.avgConsultationTime !== prevAvg.current) {
      setEditTime(doc.avgConsultationTime ?? '');
      prevAvg.current = doc.avgConsultationTime;
    }
  }, [doc.avgConsultationTime]);

  const handleSave = async () => {
    const val = parseInt(editTime, 10);
    if (!val || val < 1) return;
    setSaving(true);
    setSaved(false);
    try {
      await onSaveAvgTime(doc.doctorId, val);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const isOver =
    doc.elapsedSeconds != null &&
    doc.avgConsultationTime != null &&
    doc.elapsedSeconds > doc.avgConsultationTime * 60;

  return (
    <div
      className={`glass-card rounded-xl border p-5 transition-all ${
        isOver
          ? 'border-red-300 bg-red-50/50 shadow-red-100 shadow-md'
          : 'border-white/50'
      }`}
    >
      {/* Doctor header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-brand-blue flex items-center justify-center">
              <Stethoscope size={16} />
            </div>
            <span className="font-bold text-gray-900">{doc.doctorName}</span>
          </div>
          <span className="text-xs text-gray-500 ml-10">{doc.speciality}</span>
        </div>

        {/* Avg time editor */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 whitespace-nowrap">Avg time (min):</label>
          <input
            type="number"
            min="1"
            max="120"
            value={editTime}
            onChange={(e) => setEditTime(e.target.value)}
            className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-brand-blue text-white hover:bg-emerald-700'
            }`}
          >
            {saved ? <CheckCircle size={12} /> : <Save size={12} />}
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        {/* Waiting count */}
        <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full">
          <Users size={14} />
          <span className="font-semibold">{doc.waiting}</span>
          <span className="text-amber-600">waiting</span>
        </div>

        {/* Current patient */}
        {doc.currentPatientName ? (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-brand-blue text-white px-3 py-1.5 rounded-full text-xs font-bold">
              #{doc.currentQueueNumber} — {doc.currentPatientName}
            </span>
            <ElapsedBadge
              elapsedSeconds={doc.elapsedSeconds}
              avgConsultationTime={doc.avgConsultationTime}
            />
          </div>
        ) : (
          <span className="text-gray-400 text-xs italic">No active patient</span>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [overview, setOverview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const totalWaiting = overview.reduce((s, d) => s + d.waiting, 0);
  const activeConsultations = overview.filter((d) => d.currentPatientName).length;
  const overdueCount = overview.filter(
    (d) => d.elapsedSeconds != null && d.elapsedSeconds > (d.avgConsultationTime || 0) * 60
  ).length;

  const animatedWaiting = useCountUp(totalWaiting);
  const animatedActive = useCountUp(activeConsultations);
  const animatedOverdue = useCountUp(overdueCount);

  const fetchOverview = async () => {
    try {
      const res = await api.get('/admin/overview');
      setOverview(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load overview. Check your connection or login.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    const interval = setInterval(fetchOverview, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveAvgTime = async (doctorId, newTime) => {
    await api.put(`/admin/doctors/${doctorId}/avg-time`, { avgConsultationTime: newTime });
    // Optimistically update local state so Save button feels instant
    setOverview((prev) =>
      prev.map((d) =>
        d.doctorId === doctorId ? { ...d, avgConsultationTime: newTime } : d
      )
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen relative">
      <AmbientBackground image="/doctor-bg.jpg" />

      {/* Header */}
      <header className="glass-header shadow-sm border-b border-white/40 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="ChronoMed Logo" className="h-10" />
            <div>
              <span className="text-2xl font-bold text-emerald-800 tracking-tight">ChronoMed</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <ShieldCheck size={12} className="text-emerald-600" />
                <span className="text-xs text-emerald-600 font-medium">Admin Dashboard</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50/80 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-brand-blue">Live · 5s refresh</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page title */}
        <div className="mb-8 animate-fade-up">
          <h1 className="text-3xl font-bold text-gray-900">Hospital Overview</h1>
          <p className="text-gray-500 mt-1">Live queue status across all doctors. Edit average consultation times per doctor below.</p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 flex items-center justify-between animate-fade-up">
            <span>⚠ {error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 ml-4">&times;</button>
          </div>
        )}

        {/* Summary stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-xl p-6 border border-white/50 flex items-center gap-4 animate-fade-up" style={{ animationDelay: '0ms' }}>
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Waiting</p>
              <p className="text-2xl font-bold text-gray-900">{animatedWaiting}</p>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 border border-white/50 flex items-center gap-4 animate-fade-up" style={{ animationDelay: '80ms' }}>
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-brand-blue flex items-center justify-center">
              <Stethoscope size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Consultations</p>
              <p className="text-2xl font-bold text-gray-900">{animatedActive}</p>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 border border-white/50 flex items-center gap-4 animate-fade-up" style={{ animationDelay: '160ms' }}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${overdueCount > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Running Behind</p>
              <p className={`text-2xl font-bold ${overdueCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>{animatedOverdue}</p>
            </div>
          </div>
        </div>

        {/* Doctor rows */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-up">
            {overview.map((doc) => (
              <DoctorRow key={doc.doctorId} doc={doc} onSaveAvgTime={handleSaveAvgTime} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
