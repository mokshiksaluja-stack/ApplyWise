import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Users, Plus, MoreVertical, Edit2, XCircle, UserPlus, FileText, CheckCircle, GripVertical, AlertCircle, Loader2 } from 'lucide-react';
import { useAdminCoordinatorContext } from '../../context/AdminCoordinatorContext';
import { useNotifications } from '../../context/NotificationContext';
import { useToast } from '../../context/ToastContext';
import { fetchCoordinatorApplicationsApi, scheduleInterviewApi } from '../../services/api';
import Skeleton from '../../components/UI/Skeleton';
import EmptyState from '../../components/UI/EmptyState';
import clsx from 'clsx';

// ── Helpers ──────────────────────────────────────────────────────────────────
const resolveStudentName = (app) => {
  if (app.studentId && typeof app.studentId === 'object') {
    return app.studentId.fullName || app.studentId.name || 'Unknown';
  }
  return app.studentName || 'Unknown';
};

const resolveRollNo = (app) => {
  if (app.studentId && typeof app.studentId === 'object') return app.studentId.enrollmentNumber || '—';
  return '—';
};

const resolveBranch = (app) => {
  if (app.studentId && typeof app.studentId === 'object') return app.studentId.branch || '—';
  return '—';
};

const resolveCompany = (app) => {
  if (app.jobId && typeof app.jobId === 'object') return app.jobId.company || app.company;
  return app.company || '—';
};

export default function Scheduler() {
  const { } = useAdminCoordinatorContext();
  const { addNotification } = useNotifications();
  const { showToast } = useToast();

  // Read directly from localStorage — consistent with Applicants/AssignedOpportunities
  const coordinatorId = localStorage.getItem('userId');

  const [allApplications, setAllApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlotMenu, setActiveSlotMenu] = useState(null);
  const [showNewSlotModal, setShowNewSlotModal] = useState(false);
  const [newSlotForm, setNewSlotForm] = useState({ time: '', venue: '', period: 'Morning' });
  const [scheduleDate, setScheduleDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });

  // Slot management — local UI state for the drag-drop board
  const [slots, setSlots] = useState([
    { id: 'slot1', time: '09:30 AM', period: 'Morning', venue: 'Conference Room A', status: 'Pending', students: [] },
    { id: 'slot2', time: '11:00 AM', period: 'Morning', venue: 'Conference Room B', status: 'Pending', students: [] },
    { id: 'slot3', time: '02:00 PM', period: 'Afternoon', venue: 'Lab 3', status: 'Pending', students: [] },
    { id: 'slot4', time: '03:30 PM', period: 'Afternoon', venue: 'Lab 3', status: 'Pending', students: [] },
  ]);

  // ── Fetch Real Applications ────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchCoordinatorApplicationsApi(coordinatorId);
        setAllApplications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load coordinator applications for scheduler', err);
      } finally {
        setLoading(false);
      }
    };
    if (coordinatorId) load();
    else setLoading(false);
  }, [coordinatorId]);

  // Derive: unscheduled = no interviewDate yet, or status not "Interview Scheduled"
  const unassignedList = useMemo(() => {
    return allApplications.filter(
      app => !app.interviewDate || app.status !== 'Interview Scheduled'
    );
  }, [allApplications]);

  // Derive: already scheduled (reconstruct into slots based on their data)
  useEffect(() => {
    const scheduled = allApplications.filter(a => a.interviewDate && a.status === 'Interview Scheduled');
    if (scheduled.length > 0) {
      // Populate slots that match
      setSlots(prev => prev.map(slot => {
        const matching = scheduled.filter(a => a.reportingTime === slot.time && a.venue === slot.venue);
        if (matching.length > 0) {
          return {
            ...slot,
            status: 'Scheduled',
            students: matching.map(a => ({
              id: a._id,
              name: resolveStudentName(a),
              rollNo: resolveRollNo(a),
              branch: resolveBranch(a),
              company: resolveCompany(a),
              appId: a._id
            }))
          };
        }
        return slot;
      }));
    }
  }, [allApplications]);

  // ── Status Badge ───────────────────────────────────────────────────────
  const StatusBadge = ({ status }) => {
    switch (status) {
      case 'Scheduled': return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm"><Clock className="w-3 h-3" /> Scheduled</span>;
      case 'Completed': return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm"><CheckCircle className="w-3 h-3" /> Completed</span>;
      case 'Pending': return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm">Pending Setup</span>;
      case 'Cancelled': return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm">Cancelled</span>;
      default: return null;
    }
  };

  const morningSlots = slots.filter(s => s.period === 'Morning');
  const afternoonSlots = slots.filter(s => s.period === 'Afternoon');

  // ── Drag & Drop ────────────────────────────────────────────────────────
  const handleDragStart = (e, appId) => {
    e.dataTransfer.setData('appId', appId);
  };

  const handleDrop = async (e, slotId) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData('appId');
    if (!appId) return;

    const application = unassignedList.find(a => (a._id || a.id) === appId);
    if (!application) return;

    const targetSlot = slots.find(s => s.id === slotId);
    if (!targetSlot) return;

    const studentName = resolveStudentName(application);
    const company = resolveCompany(application);

    // Call backend — schedule interview
    try {
      await scheduleInterviewApi(appId, {
        interviewDate: scheduleDate,
        reportingTime: targetSlot.time,
        venue: targetSlot.venue
      });

      // Update local app list — mark as scheduled
      setAllApplications(prev => prev.map(a =>
        (a._id || a.id) === appId
          ? { ...a, status: 'Interview Scheduled', interviewDate: scheduleDate, reportingTime: targetSlot.time, venue: targetSlot.venue }
          : a
      ));

      // Update local slot UI
      setSlots(prev => prev.map(slot => {
        if (slot.id === slotId) {
          return {
            ...slot,
            status: 'Scheduled',
            students: [...slot.students, {
              id: appId,
              name: studentName,
              rollNo: resolveRollNo(application),
              branch: resolveBranch(application),
              company,
              appId
            }]
          };
        }
        return slot;
      }));

      showToast(`Scheduled ${studentName} at ${targetSlot.time} — ${targetSlot.venue}`, "success");

      addNotification({
        title: 'Interview Scheduled',
        message: `Your interview for ${company} is confirmed on ${scheduleDate} at ${targetSlot.time} in ${targetSlot.venue}. Good luck!`,
        type: 'interview'
      });
    } catch (err) {
      showToast(`Failed to schedule interview. ${err?.response?.data?.message || 'Try again.'}`, "error");
    }
  };

  const allowDrop = (e) => e.preventDefault();

  // ── New Slot Handler ───────────────────────────────────────────────────
  const handleAddNewSlot = () => {
    const { time, venue, period } = newSlotForm;
    if (!time.trim() || !venue.trim()) {
      showToast('Please enter both time and venue.', 'error');
      return;
    }
    const newSlot = {
      id: `slot_${Date.now()}`,
      time: time.trim(),
      period,
      venue: venue.trim(),
      status: 'Pending',
      students: [],
    };
    setSlots(prev => [...prev, newSlot]);
    setShowNewSlotModal(false);
    setNewSlotForm({ time: '', venue: '', period: 'Morning' });
    showToast(`New slot added — ${time} at ${venue}`, 'success');
  };

  const removeStudentFromSlot = (slotId, studentId) => {
    const slot = slots.find(s => s.id === slotId);
    const student = slot?.students.find(s => s.id === studentId);
    if (!student) return;

    setSlots(prev => prev.map(s => {
      if (s.id === slotId) {
        const remaining = s.students.filter(st => st.id !== studentId);
        return { ...s, students: remaining, status: remaining.length > 0 ? 'Scheduled' : 'Pending' };
      }
      return s;
    }));

    // Mark back as un-scheduled locally
    setAllApplications(prev => prev.map(a =>
      (a._id || a.id) === studentId
        ? { ...a, status: 'Applied', interviewDate: null, reportingTime: null, venue: null }
        : a
    ));

    showToast(`Removed ${student.name} from slot`, "info");
  };

  // ── Loading State ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500 overflow-hidden">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          <Skeleton className="flex-1 rounded-2xl" />
          <Skeleton className="w-[350px] rounded-2xl" />
        </div>
      </div>
    );
  }

  // ── Slot Card ──────────────────────────────────────────────────────────
  const SlotCard = ({ slot }) => (
    <div
      onDrop={(e) => handleDrop(e, slot.id)}
      onDragOver={allowDrop}
      className={clsx(
        "bg-white rounded-[24px] border p-6 relative overflow-visible group transition-all premium-card",
        slot.status === 'Cancelled' ? 'border-gray-100 bg-gray-50/50 opacity-60' : 'border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-xl hover:shadow-blue-600/5'
      )}
    >
      <div className="flex justify-between items-start mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{slot.time}</h3>
            <StatusBadge status={slot.status} />
          </div>
          <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {slot.venue}</span>
            <span className="flex items-center gap-1.5 text-blue-500 opacity-60"><Users className="w-3.5 h-3.5" /> {slot.students.length} Assigned</span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setActiveSlotMenu(activeSlotMenu === slot.id ? null : slot.id)}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all border border-transparent shadow-sm"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          {activeSlotMenu === slot.id && (
            <div className="absolute right-0 top-12 w-52 bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[20px] z-[60] py-1.5 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right p-1">
              <button className="w-full text-left px-4 py-3 text-xs text-gray-700 hover:bg-gray-50 font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-3">
                <Edit2 className="w-4 h-4 text-gray-400" /> Edit Slot
              </button>
              <button className="w-full text-left px-4 py-3 text-xs text-gray-700 hover:bg-gray-50 font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-3 border-b border-gray-50">
                <UserPlus className="w-4 h-4 text-gray-400" /> Auto-Fill
              </button>
              <button className="w-full text-left px-4 py-3 text-xs text-rose-600 hover:bg-rose-50 font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-3">
                <XCircle className="w-4 h-4" /> Terminate Slot
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="min-h-[80px] bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed flex flex-col p-3 gap-2.5 shadow-inner">
        {slot.students.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-[10px] font-black text-gray-300 uppercase tracking-widest py-4">
            <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center mb-2">
              <Plus size={14} />
            </div>
            Ready for Assignment
          </div>
        ) : (
          slot.students.map(student => (
            <div key={student.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-sm group/student hover:border-blue-200 hover:shadow-lg hover:shadow-blue-600/5 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-black text-[10px] shadow-sm">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <span className="font-black text-gray-900 block leading-none">{student.name}</span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tight mt-1.5 inline-block">{student.rollNo} • {student.company}</span>
                </div>
              </div>
              <button
                onClick={() => removeStudentFromSlot(slot.id, student.id)}
                className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover/student:opacity-100"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <>
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-700 overflow-hidden">

      {/* Top Config Header */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 mb-8 flex-shrink-0 flex flex-col md:flex-row justify-between md:items-center gap-6 relative z-20 premium-card">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <CalendarIcon className="w-6 h-6 text-blue-600" /> Operational Scheduler
          </h1>
          <div className="flex items-center gap-3 mt-1.5">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest opacity-60">Real-Time Scheduling</p>
            <span className="w-1 h-1 rounded-full bg-gray-200"></span>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{unassignedList.length} pending · {allApplications.length - unassignedList.length} scheduled</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <input
            type="date"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            className="px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl text-xs font-black uppercase tracking-widest text-gray-700 focus:outline-none shadow-inner transition-all"
          />
          <button
            onClick={() => setShowNewSlotModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 border-2 border-gray-900 hover:bg-blue-600 hover:border-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-gray-900/10 transition-all flex-1 md:flex-none active:scale-95"
          >
            <Plus className="w-4 h-4" /> New Slot
          </button>
        </div>
      </div>

      {/* Main Drag-Drop Workspace */}
      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0 relative z-10 p-1">

        {/* Left Side: Slots Grid */}
        <div className="flex-1 flex flex-col bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden min-h-0 premium-card">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Active Matrix</h2>
            <div className="text-[10px] font-black text-gray-400 bg-white px-4 py-1.5 rounded-full border border-gray-100 uppercase tracking-widest shadow-sm">{slots.length} Capacity Segments</div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-12 scrollbar-hide">
            {/* Morning Session */}
            <div>
              <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                <div className="w-8 h-1 bg-amber-400 rounded-full"></div> Morning Ops
              </h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {morningSlots.map(slot => <SlotCard key={slot.id} slot={slot} />)}
              </div>
            </div>

            {/* Afternoon Session */}
            <div>
              <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                <div className="w-8 h-1 bg-blue-500 rounded-full"></div> Afternoon Ops
              </h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {afternoonSlots.map(slot => <SlotCard key={slot.id} slot={slot} />)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Unassigned Panel */}
        <div className="w-full lg:w-[380px] flex flex-col bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex-shrink-0 min-h-[350px] premium-card">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30">
            <div className="flex justify-between items-center mb-1.5">
              <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-3"><Users className="w-5 h-5 text-blue-600" /> Pending Registry</h2>
              <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-lg shadow-lg shadow-blue-600/20">{unassignedList.length}</span>
            </div>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">Drag applicants to a time slot to schedule</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30 space-y-3 scrollbar-hide">
            {unassignedList.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center justify-center grayscale opacity-40">
                <CheckCircle className="w-16 h-16 text-emerald-500 mb-6 animate-pulse" />
                <p className="font-black text-gray-900 text-sm uppercase tracking-widest">Registry Complete</p>
                <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-tight">All applicants have been scheduled</p>
              </div>
            ) : (
              unassignedList.map(app => {
                const appId = app._id || app.id;
                return (
                  <div
                    key={appId}
                    draggable
                    onDragStart={(e) => handleDragStart(e, appId)}
                    className="p-4 bg-white border border-gray-100 shadow-sm rounded-[20px] cursor-grab active:cursor-grabbing hover:border-blue-400 hover:shadow-xl hover:shadow-blue-600/5 transition-all flex items-center gap-4 group active:scale-95"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center font-black text-xs uppercase shadow-inner group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                      <GripVertical size={16} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-gray-900 leading-tight">{resolveStudentName(app)}</h4>
                      <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tight">
                        {resolveRollNo(app)} • {resolveCompany(app)}
                      </p>
                    </div>
                    <div className="text-[9px] font-black text-gray-300 uppercase">{app.currentRound}</div>
                  </div>
                );
              })
            )}
          </div>
          <div className="p-6 border-t border-gray-50 bg-white">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest justify-center">
              <AlertCircle size={14} className="text-blue-500" />
              {allApplications.length} total applicant{allApplications.length !== 1 ? 's' : ''} in scope
            </div>
          </div>
        </div>

      </div>
    </div>

    {/* ── New Slot Modal ─────────────────────────────────────────────── */}
    {showNewSlotModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
        <div className="w-full max-w-md bg-white rounded-[28px] shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight">Add Interview Slot</h2>
              <p className="text-xs text-gray-400 font-bold mt-0.5 uppercase tracking-wider">Define a new time segment for {scheduleDate}</p>
            </div>
            <button
              onClick={() => setShowNewSlotModal(false)}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Time */}
            <div>
              <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2">Time Slot <span className="text-red-500">*</span></label>
              <input
                type="time"
                value={newSlotForm.time}
                onChange={e => setNewSlotForm(p => ({ ...p, time: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-wider">e.g. 09:30 → displays as 09:30 AM</p>
            </div>

            {/* Venue */}
            <div>
              <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2">Venue <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={newSlotForm.venue}
                onChange={e => setNewSlotForm(p => ({ ...p, venue: e.target.value }))}
                placeholder="e.g. Conference Room A, Lab 3..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Session Period */}
            <div>
              <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-2">Session</label>
              <div className="flex gap-3">
                {['Morning', 'Afternoon'].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNewSlotForm(prev => ({ ...prev, period: p }))}
                    className={clsx(
                      'flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-2',
                      newSlotForm.period === p
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-6 border-t border-gray-100">
            <button
              onClick={() => setShowNewSlotModal(false)}
              className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-black uppercase tracking-wider hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNewSlot}
              className="flex-1 py-3 rounded-xl bg-gray-900 hover:bg-blue-600 text-white text-sm font-black uppercase tracking-wider transition-all shadow-lg"
            >
              Add Slot
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
