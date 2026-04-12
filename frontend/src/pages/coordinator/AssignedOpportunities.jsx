import React, { useState, useEffect } from 'react';
import { Search, MapPin, Users, Calendar, ArrowRight, Activity, Clock, SlidersHorizontal, Info, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminCoordinatorContext } from '../../context/AdminCoordinatorContext';
import { fetchCoordinatorOpportunities } from '../../services/api';

export default function AssignedOpportunities() {
  const navigate = useNavigate();
  const { currentCoordinatorId } = useAdminCoordinatorContext();
  const [assignedDrives, setAssignedDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDrives = async () => {
      try {
        const { data } = await fetchCoordinatorOpportunities(currentCoordinatorId);
        setAssignedDrives(data);
      } catch (err) {
        console.error("Failed to fetch assigned drives", err);
      } finally {
        setLoading(false);
      }
    };
    loadDrives();
  }, [currentCoordinatorId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Assigned Opportunities</h1>
          <p className="text-sm text-gray-500 mt-1">Manage, track, and update all placement drives assigned to you.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search companies or roles..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
            <h3 className="text-lg font-bold text-gray-900">Loading Assignments...</h3>
          </div>
        ) : assignedDrives.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center flex flex-col items-center">
            <Info className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-bold text-gray-900">No Assignments Yet</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-sm">The placement admin has not assigned any company drives to your account. Stay tuned!</p>
          </div>
        ) : (
          assignedDrives.map((drive) => (
          <div key={drive._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden p-5 flex flex-col md:flex-row gap-5 md:items-center">
            
            {/* Company Info */}
            <div className="flex items-start gap-4 flex-1">
              <div className="w-14 h-14 bg-white rounded-xl border border-gray-100 flex items-center justify-center p-2 shadow-sm flex-shrink-0">
                <img src={drive.logo || "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"} alt={drive.company} className="max-w-full max-h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{drive.company}</h3>
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border uppercase tracking-wide ${getStatusColor(drive.status)}`}>
                    {drive.status}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-gray-600 mb-2">{drive.role}</h4>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 flex-1 md:flex-none my-2 md:my-0">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Users className="w-3 h-3" /> Applicants</span>
                <span className="text-sm font-bold text-gray-900">{drive.applicants || Math.floor(Math.random() * 200)} Total</span>
              </div>
              <div className="flex flex-col border-l border-gray-100 pl-4 lg:border-none lg:pl-0">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Activity className="w-3 h-3" /> Current Round</span>
                <span className="text-sm font-bold text-indigo-700">{drive.currentRound || "Initial Screening"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Deadline</span>
                <span className="text-sm font-bold text-gray-900">{drive.deadline ? new Date(drive.deadline).toISOString().split('T')[0] : drive.scheduledDate || "TBD"}</span>
              </div>
              <div className="flex flex-col border-l border-gray-100 pl-4 lg:border-none lg:pl-0">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Venue</span>
                <span className="text-sm font-bold text-gray-900 truncate max-w-[120px]">{drive.venue || "TBD"}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full md:w-auto pt-4 md:pt-0 border-t border-gray-100 md:border-none md:pl-6">
              <button 
                onClick={() => navigate(`/coordinator/opportunities/${drive._id}`)}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm shadow-indigo-200 transition-all group"
              >
                Manage Drive <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
}
