import { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, Stethoscope, LogOut } from 'lucide-react';
import api from '../api/client';



export default function DoctorDashboard() {
  const [queue, setQueue] = useState([]);
  const [doctorId, setDoctorId] = useState(null);
  const doctorName = localStorage.getItem('username');

  // #8 — track selected date so /next can be called for the right day
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  // #10 — loading and error states
  const [queueLoading, setQueueLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('doctorId');
    if (!id) {
      window.location.href = '/';
      return;
    }

  
    setDoctorId(id);
    fetchQueue(id, selectedDate);

    // Polling every 5 seconds
    const interval = setInterval(() => {
      fetchQueue(id, selectedDate);
    }, 5000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const fetchQueue = async (id, date) => {
    setQueueLoading(true);
    try {
      const params = { doctorId: id };
      if (date) params.date = date;
      const res = await api.get('/queue', { params });
      setQueue(res.data);
    } catch (error) {
      console.error("Error fetching queue", error);
    } finally {
      setQueueLoading(false);
    }
  };
  

  const handleCallNext = async (appointmentId) => {
    setActionError(null);
    try {
      await api.put(`/start/${appointmentId}`);
      fetchQueue(doctorId || localStorage.getItem('doctorId'), selectedDate);
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to call patient.';
      setActionError(msg);
    }
  };

  // #8 — passes selectedDate to /next so the correct date's queue is advanced
  const handleAutoNext = async () => {
    setActionError(null);
    try {
      const params = { doctorId: doctorId || localStorage.getItem('doctorId') };
      if (selectedDate) params.date = selectedDate;
      await api.put('/next', null, { params });
      fetchQueue(doctorId || localStorage.getItem('doctorId'), selectedDate);
    } catch (error) {
      const msg = error.response?.data?.error || 'No pending patients in queue.';
      setActionError(msg);
    }
  };

  const handleComplete = async (appointmentId) => {
    setActionError(null);
    try {
      await api.put(`/complete/${appointmentId}`);
      fetchQueue(doctorId || localStorage.getItem('doctorId'), selectedDate);
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to complete appointment.';
      setActionError(msg);
    }
  };


  
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  
  const pendingPatients = queue.filter(q => q.status === 'PENDING');
  const inProgress = queue.find(q => q.status === 'IN_PROGRESS');


  // start of page code
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="ChronoMed Logo" className="h-10" />
            <span className="text-2xl font-bold text-emerald-800 tracking-tight">ChronoMed</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-medium text-brand-blue">Live Queue Active</span>
            </div>
            <span className="font-medium text-gray-700 hidden sm:block">Dr. {doctorName}</span>
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

        {/* Error banner */}
        {actionError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 flex items-center justify-between">
            <span>⚠ {actionError}</span>
            <button onClick={() => setActionError(null)} className="text-red-400 hover:text-red-600 ml-4">&times;</button>
          </div>
        )}

        {/* Date selector */}
        <div className="flex items-center gap-3 mb-6">
          <label className="text-sm font-medium text-gray-600">Viewing queue for:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
          {selectedDate !== new Date().toISOString().split('T')[0] && (
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="text-xs text-brand-blue hover:underline"
            >Back to today</button>
          )}
        </div>

        {/* Prominent Queue Header Card */}
        <div className="bg-brand-blue rounded-2xl shadow-xl overflow-hidden mb-8 text-white p-8 text-center relative">
           <div className="absolute top-0 right-0 p-8 opacity-10">
             <Users size={120} />
           </div>
           <h2 className="text-xl text-emerald-100 font-medium mb-2 relative z-10">Waiting for you</h2>
           <h1 className="text-5xl font-bold relative z-10 flex items-center justify-center gap-4">
             {queueLoading ? (
               <span className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
             ) : (
               <>Total Patients in Queue: {pendingPatients.length}</>
             )}
           </h1>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-brand-blue flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{queue.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Waiting</p>
              <p className="text-2xl font-bold text-gray-900">{pendingPatients.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{queue.filter(q => q.status === 'COMPLETED').length}</p>
            </div>
          </div>
        </div>

        {/* Current Patient Banner */}
        {inProgress && (
          <div className="bg-gradient-to-r from-brand-blue to-emerald-700 rounded-2xl shadow-lg p-6 mb-8 flex flex-wrap justify-between items-center gap-4 text-white">
            <div>
              <p className="text-emerald-200 font-medium mb-1">Currently Consulting</p>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold">#{inProgress.queueNumber}</span>
                <span className="text-2xl">{inProgress.patientName}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Fix: Complete button lets doctor finish the current patient explicitly */}
              <button
                onClick={() => handleComplete(inProgress.id)}
                className="bg-green-400 hover:bg-green-300 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:shadow-xl transition-all active:scale-95"
              >
                ✓ Done — Complete
              </button>
              {pendingPatients.length > 0 && (
                <button
                  onClick={handleAutoNext}
                  className="bg-white text-brand-blue px-6 py-3 rounded-lg font-bold shadow-md hover:shadow-xl transition-all active:scale-95"
                >
                  Call Next Patient
                </button>
              )}
            </div>
          </div>
        )}

        {!inProgress && pendingPatients.length > 0 && (
           <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 mb-8 text-center">
             <div className="w-16 h-16 bg-emerald-50 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
               <Users size={32} />
             </div>
             <h2 className="text-xl font-bold text-gray-900 mb-2">Ready for Next Patient?</h2>
             <p className="text-gray-500 mb-6">You have {pendingPatients.length} patients waiting in the queue.</p>
             <button 
                onClick={handleAutoNext}
                className="bg-brand-blue text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-emerald-700 transition-all"
              >
                Call Next Patient (Queue #{pendingPatients[0].queueNumber})
              </button>
           </div>
        )}

        {/* Queue Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900">Today's Queue</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Queue No.</th>
                  <th className="px-6 py-4 font-medium">Patient Name</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {queue.map((apt) => (
                  <tr key={apt.id} className={`hover:bg-gray-50 transition-colors ${apt.status === 'COMPLETED' ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">#{apt.queueNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">{apt.patientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide
                        ${apt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                          apt.status === 'IN_PROGRESS' ? 'bg-emerald-100 text-emerald-800 animate-pulse' : 
                          'bg-green-100 text-green-800'}`}
                      >
                        {apt.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {apt.status === 'PENDING' && (
                        <button 
                          onClick={() => handleCallNext(apt.id)}
                          className="text-brand-blue hover:text-emerald-900 hover:underline"
                        >
                          Call This Patient
                        </button>
                      )}
                      {/* Fix: Complete button instead of dead 'In Consultation' text */}
                      {apt.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleComplete(apt.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg font-medium text-xs transition-colors"
                        >
                          ✓ Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {queue.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No appointments scheduled for today yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
