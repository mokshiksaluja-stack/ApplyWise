import React from 'react';
import { FileText, TrendingUp, Users, Presentation, UserCheck, XCircle, BarChart3, Download, Activity, FileSpreadsheet } from 'lucide-react';

export default function Reports() {
  const dummyStats = [
    { id: 1, title: 'Assigned Drives', value: '8', icon: Presentation, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    { id: 2, title: 'Managed Applicants', value: '1,245', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { id: 3, title: 'Shortlisted', value: '312', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { id: 4, title: 'Rejected', value: '890', icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' }
  ];

  const attendanceData = {
    present: 1100,
    absent: 145,
    total: 1245
  };
  
  const presentPct = Math.round((attendanceData.present / attendanceData.total) * 100);
  const absentPct = Math.round((attendanceData.absent / attendanceData.total) * 100);

  const weeklyReports = [
    { title: "Weekly Operational Summary - Week 42", date: "Oct 18, 2026", status: "Available", size: "1.2 MB" },
    { title: "Weekly Operational Summary - Week 41", date: "Oct 11, 2026", status: "Available", size: "1.1 MB" },
    { title: "Monthly Aggregate Report - September", date: "Oct 01, 2026", status: "Available", size: "3.4 MB" },
  ];

  const roundProgression = [
    { name: "Applied", value: "1,245", percentage: 100 },
    { name: "Online Assessment", value: "850", percentage: 68 },
    { name: "Technical Round 1", value: "410", percentage: 33 },
    { name: "HR Round", value: "150", percentage: 12 },
    { name: "Selected", value: "85", percentage: 6 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" /> Analytics & Reports
          </h1>
          <p className="text-sm text-gray-500 mt-1">Review operational performance and down-stream student statistics.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:shadow-md hover:bg-indigo-700 transition-all">
           <Download className="w-4 h-4" /> Export All Data
        </button>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dummyStats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-indigo-100 transition-all">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${stat.bg} ${stat.color} ${stat.border}`}>
              <stat.icon className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
            <p className="text-sm font-bold text-gray-500 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Charts Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Round Progression */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-indigo-500" /> Pipeline Progression</h3>
               <span className="text-xs font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-md">Across all drives</span>
             </div>
             
             <div className="space-y-5 flex-1 flex flex-col justify-center">
               {roundProgression.map((round, idx) => (
                 <div key={idx} className="relative">
                   <div className="flex justify-between items-end mb-1.5 z-10 relative">
                     <span className="text-sm font-bold text-gray-700">{round.name}</span>
                     <div className="text-right">
                       <span className="text-sm font-black text-gray-900">{round.value}</span>
                       <span className="text-xs font-semibold text-gray-400 ml-2">{round.percentage}%</span>
                     </div>
                   </div>
                   <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1 overflow-hidden">
                     <div 
                        className={`h-2.5 rounded-full transition-all duration-1000 ${idx === 0 ? 'bg-indigo-400' : idx === roundProgression.length - 1 ? 'bg-emerald-500' : 'bg-indigo-600'}`} 
                        style={{ width: `${round.percentage}%` }}
                     ></div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Right Column: Attendance & Downloads */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Attendance Ratio */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-500" /> Attendance Ratio</h3>
            
            <div className="flex flex-col items-center justify-center mb-6 relative">
              {/* Dummy Donut Representation */}
              <div className="w-32 h-32 rounded-full border-[12px] border-emerald-500 flex items-center justify-center relative shadow-sm" style={{ borderRightColor: "#f43f5e", transform: "rotate(45deg)" }}>
                 <div className="absolute inset-0 rounded-full bg-white flex flex-col items-center justify-center" style={{ transform: "rotate(-45deg)" }}>
                   <span className="text-2xl font-black text-gray-900">{presentPct}%</span>
                   <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Present</span>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-center">
                 <span className="block text-xl font-black text-emerald-700">{attendanceData.present}</span>
                 <span className="block text-xs font-bold text-emerald-600 uppercase tracking-wide mt-0.5">Present</span>
               </div>
               <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl text-center">
                 <span className="block text-xl font-black text-rose-700">{attendanceData.absent}</span>
                 <span className="block text-xs font-bold text-rose-600 uppercase tracking-wide mt-0.5">Absent</span>
               </div>
            </div>
          </div>

          {/* Report Downloads */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-0 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
              <h3 className="text-[15px] font-bold text-gray-900">Generated Reports</h3>
            </div>
            <div className="divide-y divide-gray-50 max-h-[250px] overflow-y-auto">
              {weeklyReports.map((file, idx) => (
                <div key={idx} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{file.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-gray-400">{file.date}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="text-[10px] font-semibold text-gray-400">{file.size}</span>
                      </div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-gray-300 group-hover:text-indigo-600 transition-colors" />
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-100 bg-gray-50/50">
               <button className="w-full py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors">
                 Generate Custom Report
               </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
