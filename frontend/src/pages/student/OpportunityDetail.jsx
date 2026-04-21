import { useState, useEffect } from 'react';
import AIInsightsPanel from '../../components/student/AIInsightsPanel';

import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardController } from '../../controllers/dashboardController';
import { fetchStudentProfile } from '../../services/studentService';
import { evaluateEligibility } from '../../utils/eligibilityEngine';
import Skeleton from '../../components/UI/Skeleton';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft, Building2, MapPin, IndianRupee, Clock, CheckCircle, 
  AlertTriangle, XCircle, Briefcase, FileText, Code2, FolderOpen, Lightbulb, Users, Calendar, Lock,
  TrendingUp, Target, FileEdit, Info, Share2
} from 'lucide-react';

export default function StudentOpportunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [profile, setProfile] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const { showToast } = useToast();

  // Set default tab to "My Readiness" to prioritize applicant context
  const [activeTab, setActiveTab] = useState('analysis');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentId = localStorage.getItem("studentId");
        const [jobData, profileData, appsList] = await Promise.all([
          DashboardController.getOpportunityById(id),
          studentId && studentId !== "null" ? fetchStudentProfile(studentId) : null,
          studentId && studentId !== "null" ? DashboardController.getStudentApplications(studentId) : []
        ]);

        if (jobData) {
           const hasApplied = appsList.some(app => app.jobId === (jobData._id || jobData.id));
           jobData.applied = hasApplied;
        }

        setJob(jobData);
        setProfile(profileData);

        if (profileData && jobData) {
          const evalResult = evaluateEligibility(profileData, jobData);
          setEvaluation(evalResult);
        }
      } catch (err) {
        console.error("Error fetching detail data", err);
        showToast("Error loading opportunity details.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, showToast]);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const studentId = localStorage.getItem("studentId");
      const success = await DashboardController.applyToJob(id, studentId);
      if (success) {
        setJob({ ...job, applied: true });
        showToast(`Successfully applied to ${job.company}! Check your email for updates.`, "success");
      } else {
        showToast("Application failed. You might have already applied or the deadline passed.", "error");
      }
    } catch (error) {
      showToast("Network error while submitting application.", "error");
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
        <div className="mb-6 h-4 w-32 bg-gray-100 rounded animate-pulse"></div>
        <Skeleton className="h-64 mb-8" />
        <div className="flex flex-col lg:flex-row gap-8">
          <Skeleton className="w-64 h-64 shrink-0" />
          <Skeleton className="flex-1 h-[600px]" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-32 animate-in zoom-in-95">
        <div className="mb-6 inline-flex p-6 bg-rose-50 rounded-full border border-rose-100">
           <XCircle className="text-rose-500" size={40} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Opportunity Expired</h2>
        <p className="text-gray-500 font-bold mb-8 uppercase tracking-widest text-xs">This data has been archived or doesn't exist.</p>
        <button onClick={() => navigate('/student/opportunities')} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-xl shadow-gray-900/10">Return to Grid</button>
      </div>
    );
  }

  const evalStatus        = evaluation?.status          || "Not Eligible";
  const readinessScore    = evaluation?.readinessScore   ?? 0;
  const missingSkills     = evaluation?.missingSkills    || [];
  const matchedSkills     = evaluation?.matchedSkills    || [];
  const matchedPreferred  = evaluation?.matchedPreferred || [];
  const scoreBreakdown    = evaluation?.scoreBreakdown   || {};
  const explanationWhy    = evaluation?.explanation?.why     || ["Complete your profile to see eligibility."];
  const explanationImprove = evaluation?.explanation?.improve || [];

  const estimatedPrepWeeks = missingSkills.length > 0 ? Math.ceil(missingSkills.length * 1.5) : 0;

  let statusBadgeStyle = "bg-green-100 text-green-800 border-green-200";
  let StatusBadgeIcon  = CheckCircle;
  let summaryMessage   = "You meet the core requirements for this role. Prepare well and apply confidently.";

  if (evalStatus === "Partially Ready") {
    statusBadgeStyle = "bg-yellow-100 text-yellow-800 border-yellow-200";
    StatusBadgeIcon  = AlertTriangle;
    summaryMessage   = "You are eligible, but you have some skill gaps. See your action plan below.";
  } else if (evalStatus === "Not Eligible") {
    statusBadgeStyle = "bg-red-50 text-red-700 border-red-100";
    StatusBadgeIcon  = XCircle;
    summaryMessage   = "You currently do not meet the academic or skill criteria for this opportunity.";
  }

  const tabs = [
    { id: 'analysis', label: 'My Readiness' },
    { id: 'action', label: 'Action Plan' },
    { id: 'process', label: 'Selection Process' },
    { id: 'overview', label: 'Role & Warnings' },
    { id: 'logistics', label: 'Logistics' },
    { id: 'ai', label: '✨ AI Insights' }
  ];


  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      {/* Breadcrumb Navigation */}
      <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Opportunities
      </button>

      {/* 1. TOP SUMMARY CARD */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden mb-8 relative">
        <div className="h-28 bg-gradient-to-r from-slate-800 to-indigo-900 absolute top-0 left-0 right-0"></div>
        
        <div className="p-8 pt-16 relative z-10 flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="flex gap-6 items-end -mt-10">
            <div className="w-24 h-24 bg-white rounded-2xl p-2 shadow-md border border-gray-100 flex items-center justify-center flex-shrink-0">
               {job.logo ? <img src={job.logo} alt={job.company} className="max-w-full max-h-full object-contain" /> : <div className="text-gray-300 font-bold text-xl">{job.company?.slice(0,2).toUpperCase()}</div>}
            </div>
            <div className="pb-1">
              <h1 className="text-3xl font-black text-gray-900 mb-1">{job.role}</h1>
              <p className="text-lg font-bold text-gray-500">{job.company}</p>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex flex-col gap-3 min-w-[220px] w-full md:w-auto mt-4 md:mt-0">
             <div className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border shadow-sm ${statusBadgeStyle}`}>
                <StatusBadgeIcon size={16}/> {evalStatus}
             </div>
             
             <button 
                onClick={handleApply}
                disabled={job.applied || evalStatus === 'Not Eligible'}
                className={`w-full px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center ${
                  job.applied ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed' :
                  evalStatus === 'Not Eligible' ? 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed' :
                  'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md border border-transparent'
                }`}
              >
                {job.applied ? <><CheckCircle className="w-4 h-4 mr-2" /> Applied</> : 
                 evalStatus === 'Not Eligible' ? <><Lock className="w-4 h-4 mr-2" /> Locked</> : 'Submit Application'}
              </button>
          </div>
        </div>

        <div className="px-8 pb-6 border-b border-gray-100 grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white">
          <div>
             <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><Briefcase size={12}/> Opportunity</p>
             <p className="text-sm font-bold text-gray-800">{job.opportunityType} • {job.employmentMode}</p>
          </div>
          <div>
             <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><MapPin size={12}/> Location</p>
             <p className="text-sm font-bold text-gray-800">{job.location || 'Not Specified'}</p>
          </div>
          <div>
             <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><IndianRupee size={12}/> Base Comp</p>
             <p className="text-sm font-bold text-gray-800">{job.stipend || job.salary || 'Competitive'}</p>
          </div>
          <div>
             <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><Calendar size={12}/> Deadline</p>
             <p className="text-sm font-bold text-red-600">{job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Rolling basis'}</p>
          </div>
        </div>
      </div>


      {/* MAIN CONTENT SPLIT */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sticky Sidebar Navigation Nav */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-6 flex flex-col gap-1.5 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
             <p className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Navigation</p>
             {tabs.map(tab => (
                <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`flex items-center text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'}`}
                >
                  {tab.label}
                </button>
             ))}
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 space-y-6">
           
           {/* TAB 1: READINESS ANALYSIS */}
           {activeTab === 'analysis' && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">

               {/* Status + Readiness Score */}
               <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm ${statusBadgeStyle}`}>
                 <div className="flex items-center gap-3 flex-1">
                   <StatusBadgeIcon size={28} className="shrink-0" />
                   <div>
                     <h3 className="text-base font-bold mb-0.5">Eligibility: {evalStatus}</h3>
                     <p className="text-sm font-medium opacity-90">{summaryMessage}</p>
                   </div>
                 </div>
                 {/* Readiness Score Ring */}
                 <div className="flex flex-col items-center bg-white/70 rounded-2xl px-5 py-3 border border-white/80 shadow-sm shrink-0">
                   <span className="text-3xl font-black text-gray-900">{readinessScore}</span>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-0.5">Readiness</span>
                 </div>
               </div>

               {/* Score Breakdown */}
               {evaluation && (
                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                   <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp className="text-blue-500" size={18}/> Score Breakdown</h2>
                   <div className="space-y-3">
                     {[
                       { label: 'Skill Match',     value: scoreBreakdown.skillMatch,     color: 'bg-blue-500',    weight: '40%' },
                       { label: 'Academic (CGPA)', value: scoreBreakdown.cgpa,           color: 'bg-indigo-500',  weight: '25%' },
                       { label: 'Project Depth',   value: scoreBreakdown.projects,       color: 'bg-purple-500',  weight: '20%' },
                       { label: 'Certifications',  value: scoreBreakdown.certifications, color: 'bg-emerald-500', weight: '10%' },
                       { label: 'Preferred Skills',value: scoreBreakdown.preferred,      color: 'bg-amber-500',   weight: '5%' },
                     ].map(({ label, value, color, weight }) => (
                       <div key={label}>
                         <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                           <span>{label} <span className="text-gray-400">({weight})</span></span>
                           <span className="font-bold text-gray-800">{value ?? 0}/100</span>
                         </div>
                         <div className="w-full bg-gray-100 rounded-full h-2">
                           <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${value ?? 0}%` }} />
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {/* Why Eligible / Not Eligible */}
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                 <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><CheckCircle className="text-green-500"/> Eligibility Breakdown</h2>
                 <ul className="space-y-2">
                   {explanationWhy.map((reason, i) => (
                     <li key={i} className="text-sm text-gray-700 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100 font-medium">{reason}</li>
                   ))}
                 </ul>
                 {matchedPreferred.length > 0 && (
                   <div className="mt-4">
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">⭐ Preferred Skills You Have</p>
                     <div className="flex flex-wrap gap-1.5">
                       {matchedPreferred.map(s => <span key={s} className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-lg text-xs font-bold">{s}</span>)}
                     </div>
                   </div>
                 )}
               </div>

               {/* Skill Gap */}
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-5"><Target size={100}/></div>
                 <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 relative z-10"><Target className="text-red-500"/> Skill Gap Analysis</h2>

                 {matchedSkills.length > 0 && (
                   <div className="mb-4">
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">✅ Matched Required Skills ({matchedSkills.length})</p>
                     <div className="flex flex-wrap gap-1.5">
                       {matchedSkills.map(s => <span key={s} className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-lg text-xs font-bold">{s}</span>)}
                     </div>
                   </div>
                 )}

                  {missingSkills.length > 0 ? (
                    <div className="relative z-10">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">❌ Missing Critical Skills ({missingSkills.length})</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {missingSkills.map(s => (
                          <div key={s} className="flex items-center justify-between bg-white text-gray-700 border border-gray-100 shadow-sm p-3 rounded-2xl group hover:border-blue-200 transition-all">
                             <span className="text-sm font-bold">{s}</span>
                             <Link 
                               to={`/student/prep-center?search=${encodeURIComponent(s)}`}
                               className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg border border-blue-100 opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 hover:text-white"
                             >
                               Start Practice
                             </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                   <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                     <CheckCircle className="text-green-500 shrink-0"/>
                     <p className="text-sm font-semibold text-gray-700">No skill gaps identified. You are fully matched!</p>
                   </div>
                 )}
               </div>

               {/* Prep time estimate */}
               {missingSkills.length > 0 && (
                 <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center justify-between">
                   <div>
                     <h3 className="text-base font-bold text-indigo-900 mb-1">Estimated Preparation Time</h3>
                     <p className="text-sm text-indigo-700/80">Based on {missingSkills.length} missing skill(s).</p>
                   </div>
                   <div className="text-right bg-white px-5 py-3 rounded-2xl shadow-sm border border-indigo-50">
                     <p className="text-2xl font-black text-blue-600 leading-none">~ {estimatedPrepWeeks} weeks</p>
                   </div>
                 </div>
               )}

             </div>
           )}

           {/* TAB 2: ACTION PLAN */}
           {activeTab === 'action' && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
               
               {/* What to improve right now */}
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                 <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp className="text-blue-500"/> What to improve before applying</h2>
                 {explanationImprove.length > 0 ? (
                    <ul className="space-y-2">
                      {explanationImprove.map((tip, i) => (
                        <li key={i} className="flex gap-4 text-[13px] font-bold text-gray-700 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-[10px] font-black text-white shadow-sm shadow-blue-600/20">
                            {i + 1}
                          </div> 
                          {tip}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 italic">You are highly matched! Use the links below to refine your company-specific knowledge.</p>
                  )}

                  {/* Company specific prep link */}
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-white shadow-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                           <Building2 className="text-blue-400" size={24}/>
                        </div>
                        <div>
                          <h4 className="text-sm font-black tracking-tight">{job.company} Prep Hub</h4>
                          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Alumni insights & OA archives</p>
                        </div>
                      </div>
                      <Link 
                        to={`/student/prep-center?company=${encodeURIComponent(job.company)}`}
                        className="px-6 py-2.5 bg-blue-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-blue-600 transition-all shadow-lg shadow-blue-600/20"
                      >
                        Visit Hub
                      </Link>
                    </div>
                  </div>
               </div>

               {/* Resume Suggestions */}
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                 <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><FileEdit className="text-purple-500"/> Resume Suggestions</h2>
                 <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                   <ul className="space-y-3">
                     <li className="flex gap-3 text-sm text-purple-900 font-medium">
                       <CheckCircle size={16} className="text-purple-500 shrink-0 mt-0.5"/>
                       Ensure you clearly list projects demonstrating {matchedSkills.length > 0 ? matchedSkills.join(" and ") : "core engineering concepts"}.
                     </li>
                     <li className="flex gap-3 text-sm text-purple-900 font-medium">
                       <CheckCircle size={16} className="text-purple-500 shrink-0 mt-0.5"/>
                       Use action verbs (e.g., "Architected", "Developed") and quantify your impacts.
                     </li>
                     <li className="flex gap-3 text-sm text-purple-900 font-medium">
                       <CheckCircle size={16} className="text-purple-500 shrink-0 mt-0.5"/>
                       Keep it to 1 page. This company strictly filters multi-page resumes for interns.
                     </li>
                   </ul>
                 </div>
               </div>

               {/* Prep Topics & Resources */}
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                 <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2"><Lightbulb className="text-amber-500"/> Interview Preparation Topics</h2>
                 
                 <div className="grid md:grid-cols-2 gap-4">
                    {job.importantTopics?.length > 0 && (
                       <div className="border border-gray-100 p-4 rounded-xl">
                          <p className="text-xs font-bold text-gray-500 uppercase mb-2">High Priority Topics</p>
                          <div className="flex flex-wrap gap-2">
                             {job.importantTopics.map(t => <span key={t} className="px-2 py-1 bg-amber-50 text-xs font-bold text-amber-800 rounded">{t}</span>)}
                          </div>
                       </div>
                    )}
                    {job.dsaFocus?.length > 0 && (
                       <div className="border border-gray-100 p-4 rounded-xl">
                          <p className="text-xs font-bold text-gray-500 uppercase mb-2">DSA Focus Areas</p>
                          <div className="flex flex-wrap gap-2">
                             {job.dsaFocus.map(t => <span key={t} className="px-2 py-1 bg-gray-50 text-xs font-bold text-gray-700 rounded">{t}</span>)}
                          </div>
                       </div>
                    )}
                    {job.coreSubjectsFocus?.length > 0 && (
                       <div className="border border-gray-100 p-4 rounded-xl">
                          <p className="text-xs font-bold text-gray-500 uppercase mb-2">CS Fundamentals Focus</p>
                          <div className="flex flex-wrap gap-2">
                             {job.coreSubjectsFocus.map(t => <span key={t} className="px-2 py-1 bg-gray-50 text-xs font-bold text-gray-700 rounded">{t}</span>)}
                          </div>
                       </div>
                    )}
                 </div>
                 
                 {/* Internal Resources & Tips */}
                 {(job.topTips?.length > 0 || job.experienceLinks?.length > 0) && (
                   <div className="mt-6 pt-6 border-t border-gray-100">
                     <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Users className="text-emerald-500"/> Tips from Seniors & Alumni</h3>
                     
                     <div className="space-y-3 mb-5">
                       {job.topTips?.map((tip, i) => (
                         <div key={i} className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-sm font-medium text-emerald-900 italic">
                            "{tip}"
                         </div>
                       ))}
                     </div>
                     
                     {job.experienceLinks?.length > 0 && (
                        <div className="flex flex-col gap-2">
                           <p className="text-xs font-bold text-gray-500 uppercase">Internal Prep Resources</p>
                           {job.experienceLinks.map((link, i) => (
                              <a href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noreferrer" key={i} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-1.5 bg-gray-50 w-fit px-3 py-2 rounded-lg border border-gray-200">
                                View Alumni Interview Experience {i+1}
                              </a>
                           ))}
                        </div>
                     )}
                   </div>
                 )}
                 {!job.topTips?.length && !job.experienceLinks?.length && !job.importantTopics?.length && (
                    <p className="text-sm text-gray-500">No specific prep details provided. Ensure you cover standard behavioral and technical foundations.</p>
                 )}
               </div>

             </div>
           )}

           {/* TAB 3: SELECTION PROCESS */}
           {activeTab === 'process' && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
               
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                 <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2"><CheckCircle className="text-indigo-500"/> What to Expect: Rounds</h2>
                 <p className="text-sm text-gray-500 mb-6">Understand the structure of the evaluation before you apply.</p>
                 
                 {job.processTimeline && (
                   <div className="mb-6 bg-indigo-50 border border-indigo-100 pl-4 py-3 pr-3 rounded-xl border-l-4 border-l-indigo-500">
                     <p className="text-sm font-bold text-indigo-900 flex items-center gap-2"><Clock size={16}/> Expected Timeline: {job.processTimeline}</p>
                   </div>
                 )}

                 <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                    {job.selectionRounds?.length > 0 ? job.selectionRounds.map((round, idx) => (
                       <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-500 font-bold text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                            {idx + 1}
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                               <h4 className="font-bold text-gray-900 text-sm">{round.name || 'Evaluation Round'}</h4>
                               <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{round.assessmentType}</span>
                            </div>
                            <p className="text-xs text-gray-600">{round.description}</p>
                          </div>
                       </div>
                    )) : (
                       <div className="text-center p-6"><p className="text-sm text-gray-500 italic relative z-10">Process details are currently confidential or TBA.</p></div>
                    )}
                 </div>
               </div>

               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                 <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><FolderOpen className="text-yellow-500"/> Documents Needed for Application</h2>
                 <ul className="grid md:grid-cols-2 gap-3">
                    {job.requiredDocuments?.length > 0 ? job.requiredDocuments.map((doc, i) => (
                       <li key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm font-semibold text-gray-700 shadow-sm">
                         <FileText size={16} className="text-yellow-600"/> {doc}
                       </li>
                    )) : (
                       <li className="text-sm text-gray-500 p-3 bg-gray-50 rounded-xl flex items-center gap-3 shadow-sm border border-gray-100"><FileText size={16} className="text-gray-400"/> Standard System Profile & Resume</li>
                    )}
                 </ul>
                 {job.customQuestions?.length > 0 && (
                   <div className="mt-6 pt-6 border-t border-gray-100">
                     <div className="flex items-start gap-2 mb-3">
                       <Info size={16} className="text-blue-500 mt-0.5"/>
                       <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Company Custom Questions</p>
                     </div>
                     <p className="text-sm text-gray-600 mb-4">You will need to answer these during the application step. Prepare your answers in advance:</p>
                     <ul className="space-y-2">
                        {job.customQuestions.map((q, i) => (
                          <li key={i} className="text-sm font-semibold text-gray-800 bg-blue-50/30 p-3 rounded-lg border border-blue-50">{q}</li>
                        ))}
                     </ul>
                   </div>
                 )}
               </div>

             </div>
           )}

           {/* TAB 4: ROLE & WARNINGS */}
           {activeTab === 'overview' && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
               
               {/* Important Warnings */}
               {(job.bondRequired || job.previousOfferRestrictions || job.gapYearRestrictions) && (
                 <div className="bg-red-50 p-5 rounded-2xl border border-red-200">
                   <h2 className="text-sm font-bold text-red-900 mb-3 flex items-center gap-2"><AlertTriangle size={18}/> Important Warnings & Conditions</h2>
                   <div className="grid md:grid-cols-2 gap-3">
                     {job.bondRequired && (
                        <div className="bg-white/60 p-3 rounded-xl border border-red-100">
                          <p className="text-xs font-bold text-red-800 uppercase mb-0.5">Bond Agreement Required</p>
                          <p className="text-sm font-semibold text-gray-900">Duration: {job.bondDuration}</p>
                        </div>
                     )}
                     {job.previousOfferRestrictions && (
                        <div className="bg-white/60 p-3 rounded-xl border border-red-100">
                          <p className="text-xs font-bold text-red-800 uppercase mb-0.5">Offer Restrictions</p>
                          <p className="text-sm font-semibold text-gray-900">{job.previousOfferRestrictions}</p>
                        </div>
                     )}
                     {job.gapYearRestrictions && (
                        <div className="bg-white/60 p-3 rounded-xl border border-red-100">
                          <p className="text-xs font-bold text-red-800 uppercase mb-0.5">Academic Gaps</p>
                          <p className="text-sm font-semibold text-gray-900">{job.gapYearRestrictions}</p>
                        </div>
                     )}
                   </div>
                 </div>
               )}

               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                 <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Building2 className="text-blue-500"/> Role Overview</h2>
                 <p className="text-gray-600 leading-relaxed text-[15px] mb-6">{job.description || "The exact job description has not been fully detailed by the employer yet."}</p>
                 
                 <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
                   <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                     <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Team Context</p>
                     <p className="text-sm font-semibold text-gray-900">{job.department || job.teamContext || "Central Division"}</p>
                   </div>
                   <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                     <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Timeline Focus</p>
                     <p className="text-sm font-semibold text-gray-900">{job.internshipDuration ? `Duration: ${job.internshipDuration}` : 'Standard FTC'} • {job.tentativeJoiningDate ? `Starts ${new Date(job.tentativeJoiningDate).toLocaleDateString()}` : 'Date TBA'}</p>
                   </div>
                 </div>
               </div>

               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                 <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2"><IndianRupee className="text-emerald-500"/> Compensation Structure</h2>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
                    <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl shadow-sm">
                      <p className="text-xs font-bold text-emerald-700 uppercase mb-1">Stipend / Base</p>
                      <p className="text-lg font-black text-emerald-900">{job.stipend || job.basePay || 'Disclosure Phase'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl shadow-sm">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-1">Total CTC</p>
                      <p className="text-lg font-black text-gray-900">{job.salary || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl shadow-sm">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-1">PPO Pathway</p>
                      <p className="text-lg font-black text-gray-900">{job.ppoAvailable ? 'Enabled' : 'No'}</p>
                    </div>
                 </div>
                 {job.benefits && (
                   <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                     <p className="text-xs font-bold text-blue-800 uppercase mb-1">Additional Perks</p>
                     <p className="text-sm text-blue-900 font-medium leading-relaxed">{job.benefits}</p>
                   </div>
                 )}
               </div>
             </div>
           )}

           {/* TAB 5: LOGISTICS */}
           {activeTab === 'logistics' && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                 <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><Users className="text-blue-500"/> Coordination & Logistics</h2>
                 <p className="text-sm text-gray-500 mb-6">Contact details and routing for examination venues.</p>
                 
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                       <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Coordinator Assigned</p>
                       <p className="font-semibold text-gray-900 text-sm">{job.coordinatorAssigned || "TBA - Please check Notice Board"}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                       <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Venue / Online Link</p>
                       <p className="font-semibold text-gray-900 text-sm border-b border-gray-200 pb-0.5 border-dashed w-fit">{job.venue || "TBA via Email"}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                       <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Corporate Contact</p>
                       <p className="font-semibold text-gray-900 text-sm">{job.contactPerson || "Classified"}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                       <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Reporting Instructions</p>
                       <p className="font-semibold text-gray-900 text-sm">{job.reportingInstructions || "Follow standard platform guidelines."}</p>
                    </div>
                 </div>
               </div>
             </div>
           )}

           {/* TAB 6: AI INSIGHTS */}
           {activeTab === 'ai' && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <AIInsightsPanel job={job} profile={profile} evaluation={evaluation} />
             </div>
           )}

        </div>
      </div>
    </div>
  );
}
