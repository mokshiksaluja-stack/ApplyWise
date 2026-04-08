import { useState, useMemo } from "react";
import { Clock, CheckCircle, XCircle, ChevronRight, X, User, Building, MapPin, Calendar, FileText, Info, Award, Search } from "lucide-react";
import { applicationsData } from "../../data/dummyApplications";

export default function Applications() {
  const [selectedApp, setSelectedApp] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApplications = useMemo(() => {
    return applicationsData.filter((app) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          app.company.toLowerCase().includes(query) ||
          app.role.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [searchQuery]);

  // Status Badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-700";
      case "Shortlisted":
        return "bg-purple-100 text-purple-700";
      case "Interview Scheduled":
        return "bg-amber-100 text-amber-700";
      case "Selected":
        return "bg-emerald-100 text-emerald-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
      switch (status) {
        case "Applied": return <Clock size={14} className="mr-1.5" />;
        case "Shortlisted": return <ChevronRight size={14} className="mr-1.5" />;
        case "Interview Scheduled": return <Calendar size={14} className="mr-1.5" />;
        case "Selected": return <CheckCircle size={14} className="mr-1.5" />;
        case "Rejected": return <XCircle size={14} className="mr-1.5" />;
        default: return null;
      }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="mt-2 text-gray-500">
          Track all your submitted applications and interview schedules.
        </p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by company or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app) => (
            <div key={app.id} className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md md:flex-row md:items-center md:justify-between gap-6">
            
            {/* Left Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-gray-900">{app.company}</h3>
                <span className={`flex items-center rounded-full px-3 py-1 text-xs font-bold ${getStatusBadge(app.status)}`}>
                  {getStatusIcon(app.status)}
                  {app.status}
             </span>
              </div>
              <p className="mt-1 text-base font-medium text-gray-600">{app.role}</p>
              
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Calendar size={16} className="text-gray-400" /> Applied: {app.appliedDate}
                </span>
                
                {(app.interviewDate !== "TBD" && (app.status === "Interview Scheduled" || app.status === "Shortlisted")) && (
                  <span className="flex items-center gap-1.5 font-medium text-amber-600">
                    <Clock size={16} /> {app.interviewDate} at {app.reportingTime}
                  </span>
                )}
                
                {app.roomNumber !== "TBD" && app.roomNumber !== "Online WebEx" && app.roomNumber !== "Online" && app.status !== "Rejected" && app.status !== "Selected" && (
                   <span className="flex items-center gap-1.5 font-medium bg-gray-50 text-gray-700 px-2 py-0.5 rounded border border-gray-100">
                     <MapPin size={14} className="text-gray-400" /> {app.roomNumber}
                   </span>
                )}
              </div>
            </div>

            {/* Right Action */}
            <div className="flex items-center gap-4 border-t border-gray-50 pt-4 md:border-0 md:pt-0">
                <div className="hidden md:block text-right mr-4">
                   <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Current / Next Stage</p>
                   <p className="text-sm font-bold text-gray-800">{app.currentRound}</p>
                </div>
                <button 
                  onClick={() => setSelectedApp(app)}
                  className="w-full md:w-auto rounded-xl bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                >
                  View Details
                </button>
            </div>
            
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20">
          <Building size={40} className="mb-4 text-gray-300" />
          <h3 className="text-lg font-bold text-gray-900">No applications found</h3>
        </div>
      )}
      </div>

      {/* Modal Popup */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/95 px-6 py-5 backdrop-blur-sm">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedApp.company}</h2>
                <p className="text-sm font-medium text-blue-600">{selectedApp.role}</p>
              </div>
              <span className={`hidden sm:flex items-center rounded-full px-3 py-1 text-xs font-bold ${getStatusBadge(selectedApp.status)}`}>
                  {getStatusIcon(selectedApp.status)}
                  {selectedApp.status}
              </span>
              <button
                onClick={() => setSelectedApp(null)}
                className="rounded-full bg-gray-50 p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              
               <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:grid-cols-4 text-sm">
                  <div>
                     <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Interview Date</p>
                     <p className="font-medium text-gray-900">{selectedApp.interviewDate}</p>
                  </div>
                  <div>
                     <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Reporting Time</p>
                     <p className="font-medium text-gray-900">{selectedApp.reportingTime}</p>
                  </div>
                  <div className="col-span-2">
                     <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Venue / Link</p>
                     <p className="font-medium text-gray-900">{selectedApp.roomNumber}</p>
                  </div>
               </div>

               <div className="mb-8">
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
                    <Clock size={18} className="text-blue-500" /> Round History
                  </h3>
                  
                  <div className="relative border-l-2 border-gray-100 ml-3 pl-5 space-y-6">
                      {selectedApp.roundHistory.length === 0 && (
                          <p className="text-sm text-gray-500">No rounds completed yet.</p>
                      )}
                      {selectedApp.roundHistory.map((round, idx) => (
                          <div key={idx} className="relative">
                              <div className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white ${round.result === 'Cleared' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <p className="text-sm font-bold text-gray-900">{round.name}</p>
                              <p className="text-xs text-gray-500 mt-1">{round.date} • <span className={`font-semibold ${round.result === 'Cleared' ? 'text-green-600' : 'text-red-500'}`}>{round.result}</span></p>
                          </div>
                      ))}
                      
                      {selectedApp.status !== "Rejected" && selectedApp.status !== "Selected" && (
                         <div className="relative">
                            <div className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white bg-blue-500 animate-pulse"></div>
                            <p className="text-sm font-bold text-blue-600">{selectedApp.currentRound}</p>
                            <p className="text-xs text-gray-500 mt-1">Pending</p>
                         </div>
                      )}
                  </div>
               </div>

               <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-gray-100 p-5 bg-white shadow-sm">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
                      <FileText size={16} className="text-purple-500" /> Required Documents
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                       {selectedApp.documents.length > 0 ? selectedApp.documents.map(doc => (
                          <li key={doc}>{doc}</li>
                       )) : <li className="text-gray-500 italic">None specified</li>}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-amber-100 p-5 bg-amber-50">
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-800">
                      <Info size={16} className="text-amber-600" /> Instructions
                    </h3>
                    <p className="text-sm text-amber-700">{selectedApp.instructions}</p>
                  </div>
               </div>

               <div className="mt-6 rounded-2xl border border-blue-100 p-5 bg-blue-50">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-800">
                    <User size={16} className="text-blue-600" /> Coordinator Update
                  </h3>
                  <p className="text-sm text-blue-700">{selectedApp.coordinatorUpdate}</p>
               </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
