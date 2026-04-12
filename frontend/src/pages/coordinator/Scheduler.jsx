import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Users, Plus, MoreVertical, Edit2, XCircle, UserPlus, FileText, CheckCircle, GripVertical, AlertCircle } from 'lucide-react';
import { usePlacementContext } from '../../context/PlacementContext';
import { useNotifications } from '../../context/NotificationContext';
import { useToast } from '../../context/ToastContext';
import Skeleton from '../../components/UI/Skeleton';
import clsx from 'clsx';

// --- Dummy Data Models ---

const mockSlots = [
  {
    id: 'slot1',
    time: '09:30 AM',
    period: 'Morning',
    venue: 'Conference Room A',
    status: 'Scheduled',
    students: [
      { id: 's1', name: 'Sneha Patel', rollNo: '20IT112' },
      { id: 's2', name: 'Arjun Singh', rollNo: '20ME005' }
    ]
  },
  {
    id: 'slot2',
    time: '11:00 AM',
    period: 'Morning',
    venue: 'Conference Room B',
    status: 'Completed',
    students: [
      { id: 's3', name: 'Meera Reddy', rollNo: '20CS088' }
    ]
  },
  {
    id: 'slot3',
    time: '02:00 PM',
    period: 'Afternoon',
    venue: 'Lab 3',
    status: 'Pending',
    students: []
  },
  {
    id: 'slot4',
    time: '03:30 PM',
    period: 'Afternoon',
    venue: 'Lab 3',
    status: 'Cancelled',
    students: []
  }
];

export default function Scheduler() {
  const { globalApplications, scheduleInterview } = usePlacementContext();
  const { addNotification } = useNotifications();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);

  // Load unassigned students directly from shared context (matching Google drives missing a date)
  const [unassignedList, setUnassignedList] = useState([]);
  const [slotsList, setSlotsList] = useState(mockSlots);
  const [activeSlotMenu, setActiveSlotMenu] = useState(null);

  useEffect(() => {
    // Initial sync and artificial delay for skeleton
    const timer = setTimeout(() => {
      setUnassignedList(
        globalApplications
          .filter(app => app.interviewDate === "TBD" || !app.interviewDate)
          .map(app => ({ id: app.id, name: app.studentName, rollNo: app.rollNo, branch: app.branch, company: app.company }))
      );
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [globalApplications]);

  // Status Styles Component
  const StatusBadge = ({ status }) => {
    switch (status) {
      case 'Scheduled': return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm"><Clock className="w-3 h-3" /> Scheduled</span>;
      case 'Completed': return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm"><CheckCircle className="w-3 h-3" /> Completed</span>;
      case 'Pending': return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm">Pending Setup</span>;
      case 'Cancelled': return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm">Cancelled</span>;
      default: return null;
    }
  };

  const morningSlots = slotsList.filter(s => s.period === 'Morning');
  const afternoonSlots = slotsList.filter(s => s.period === 'Afternoon');

  const handleDragStart = (e, studentId) => {
    e.dataTransfer.setData('studentId', studentId);
  };

  const handleDrop = (e, slotId) => {
    e.preventDefault();
    const studentId = e.dataTransfer.getData('studentId');
    if(!studentId) return;

    const student = unassignedList.find(s => s.id === studentId);
    if(student) {
      const targetSlot = slotsList.find(s => s.id === slotId);

      // Remove from unassigned UI state
      setUnassignedList(prev => prev.filter(s => s.id !== studentId));
      
      // Add to slot UI state
      setSlotsList(prev => prev.map(slot => {
        if(slot.id === slotId) {
          return { ...slot, students: [...slot.students, student], status: 'Scheduled' }; 
        }
        return slot;
      }));

      // INTEGRATION PUSH
      scheduleInterview(student.id, "2026-10-25", targetSlot.time, targetSlot.venue);
      showToast(`Assigned ${student.name} to ${targetSlot.time} slot`, "success");
      
      addNotification({
        title: 'Interview Scheduled',
        message: `Your interview for ${student.company || 'Google'} is confirmed at ${targetSlot.time} in ${targetSlot.venue}. Good luck!`,
        type: 'interview'
      });
    }
  };

  const allowDrop = (e) => e.preventDefault();

  const removeStudentFromSlot = (slotId, studentId) => {
    // Find student
    const slot = slotsList.find(s => s.id === slotId);
    const student = slot.students.find(s => s.id === studentId);
    
    // Remove from slot
    setSlotsList(prev => prev.map(s => {
      if(s.id === slotId) {
        return { ...s, students: s.students.filter(st => st.id !== studentId) };
      }
      return s;
    }));
    
    // Add back to unassigned
    setUnassignedList(prev => [...prev, student]);
    showToast(`Removed ${student.name} from slot`, "info");
  };

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
                   <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tight mt-1.5 inline-block">{student.rollNo}</span>
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
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-700 overflow-hidden">
      
      {/* Top Config Header */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 mb-8 flex-shrink-0 flex flex-col md:flex-row justify-between md:items-center gap-6 relative z-20 premium-card">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <CalendarIcon className="w-6 h-6 text-blue-600" /> Operational Scheduler
          </h1>
          <div className="flex items-center gap-3 mt-1.5">
             <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest opacity-60">Google</p>
             <span className="w-1 h-1 rounded-full bg-gray-200"></span>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SDE Round 1</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <input 
            type="date" 
            defaultValue="2026-10-25" 
            className="px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl text-xs font-black uppercase tracking-widest text-gray-700 focus:outline-none shadow-inner transition-all"
          />
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 border-2 border-gray-900 hover:bg-blue-600 hover:border-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-gray-900/10 transition-all flex-1 md:flex-none active:scale-95">
            <Plus className="w-4 h-4" /> New Slot
          </button>
        </div>
      </div>

      {/* Main Drag-Drop Workspace */}
      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0 relative z-10 p-1">
        
        {/* Left Side: Slots Grid (Scrollable) */}
        <div className="flex-1 flex flex-col bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden min-h-0 premium-card">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Active Matrix</h2>
            <div className="text-[10px] font-black text-gray-400 bg-white px-4 py-1.5 rounded-full border border-gray-100 uppercase tracking-widest shadow-sm">{slotsList.length} Capacity Segments</div>
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
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">Move entities to allocate timing</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30 space-y-3 scrollbar-hide">
             {unassignedList.length === 0 ? (
               <div className="text-center py-20 flex flex-col items-center justify-center grayscale opacity-40">
                 <CheckCircle className="w-16 h-16 text-emerald-500 mb-6 animate-pulse" />
                 <p className="font-black text-gray-900 text-sm uppercase tracking-widest">Registry Complete</p>
                 <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-tight">All entities allocated successfully</p>
               </div>
             ) : (
                unassignedList.map(student => (
                  <div 
                    key={student.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, student.id)}
                    className="p-4 bg-white border border-gray-100 shadow-sm rounded-[20px] cursor-grab active:cursor-grabbing hover:border-blue-400 hover:shadow-xl hover:shadow-blue-600/5 transition-all flex items-center gap-4 group active:scale-95"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center font-black text-xs uppercase shadow-inner group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                      <GripVertical size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-900 leading-tight">{student.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tight">{student.rollNo} • {student.branch}</p>
                    </div>
                  </div>
                ))
             )}
          </div>
          <div className="p-6 border-t border-gray-50 bg-white">
            <button className="w-full py-3.5 bg-white hover:bg-gray-900 hover:text-white text-gray-900 border border-gray-100 rounded-[20px] text-xs font-black uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-lg active:scale-95">
              <FileText className="w-4 h-4 opacity-50" /> Sync to Cloud
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
