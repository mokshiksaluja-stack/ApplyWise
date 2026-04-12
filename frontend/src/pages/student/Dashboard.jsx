import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileStatCard from "../../components/layouts/ProfileStatCard";
import OpportunityCard from "../../components/dashboard/OpportunityCard";
import NotificationCard from "../../components/dashboard/NotificationCard";
import ApplicationCard from "../../components/dashboard/ApplicationCard";
import ReadinessCard from "../../components/dashboard/ReadinessCard";

import Skeleton from "../../components/UI/Skeleton";
import EmptyState from "../../components/UI/EmptyState";
import { useToast } from "../../context/ToastContext";

import { fetchStudentProfile } from "../../services/studentService";
import { calculateProfileCompletion, calculateReadinessScore } from "../../utils/studentMetrics";
import { evaluateEligibility } from "../../utils/eligibilityEngine";
import { getDashboardRecommendedResources } from "../../utils/recommendationEngine";
import { BookOpen, ExternalLink, FileText, Sparkles, Inbox, Briefcase } from "lucide-react";
import ResourceModal from "../../components/dashboard/ResourceModal";

import { opportunitiesList as opportunities } from "../../data/dummyOpportunities";
import { initialNotifications as notifications } from "../../data/dummyNotifications";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const getProfile = async () => {
      const studentId = localStorage.getItem("studentId");
      if (!studentId || studentId === "null") {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchStudentProfile(studentId);
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile for dash:", error);
        showToast("Couldn't refresh your profile data.", "error");
      } finally {
        setLoading(false);
      }
    };
    
    getProfile();
  }, [showToast]);

  const completionPercentage = calculateProfileCompletion(profile);
  const readinessResult = calculateReadinessScore(profile, completionPercentage);
  const dashboardPrep = getDashboardRecommendedResources(profile, 3);

  return (
    <div className="animate-in fade-in duration-700">
          {loading ? (
            <div className="mb-8 p-8 rounded-[32px] border border-gray-100 bg-white shadow-sm flex flex-col md:flex-row gap-6 items-center">
              <Skeleton className="w-20 h-20 shrink-0" variant="circle" />
              <div className="flex-1 space-y-3 w-full">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ) : profile ? (
            <div className="mb-8 rounded-[32px] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 p-8 text-white shadow-xl shadow-blue-600/20 premium-card">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-3xl font-black tracking-tight">Welcome back, {profile.fullName}! 👋</h2>
                      <p className="mt-2 text-sm font-bold text-blue-100 opacity-80 uppercase tracking-widest flex items-center gap-2">
                         <Sparkles size={14} className="text-amber-300" /> {profile.primaryDomain} Specialist
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      {profile.technicalSkills?.slice(0, 4).map((skill) => (
                          <span key={skill} className="rounded-xl bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider backdrop-blur-md border border-white/10">
                              {skill}
                          </span>
                      ))}
                    </div>
                </div>
            </div>
          ) : (
            <div className="mb-8 flex flex-col items-center justify-between rounded-3xl border border-amber-200 bg-amber-50/50 p-6 text-amber-900 md:flex-row backdrop-blur-sm">
                <div>
                  <h3 className="text-base font-black">Finalize Your Profile</h3>
                  <p className="mt-1 text-sm font-medium opacity-80">Connect your skills and academic data to unlock intelligent job matchmaking.</p>
                </div>
                <Link to="/profile/edit" className="mt-4 rounded-xl bg-amber-200 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-amber-900 transition hover:bg-amber-300 active:scale-95 md:mt-0 shadow-sm">
                  Start Wizard
                </Link>
            </div>
          )}

          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <ProfileStatCard title="Profile Completion" percentage={completionPercentage} />
                    <ReadinessCard score={readinessResult.score} />
                    <ApplicationCard total={4} active={3} />
          </section>

          <section className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                 <Briefcase className="text-blue-600" size={24} /> Opportunities for You
              </h2>
              <Link to="/student/opportunities" className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition">
                Explore all
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-[320px]" />)}
              </div>
            ) : opportunities.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {opportunities.slice(0, 3).map((item) => {
                  const evalResult = evaluateEligibility(profile, item);
                  return (
                    <OpportunityCard 
                      key={item.id || item.company} 
                      {...item} 
                      dynamicStatus={evalResult.status}
                      matchedCount={evalResult.skillMatchCount}
                      totalCount={evalResult.totalSkills}
                      missingSkills={evalResult.missingSkills}
                      onViewDetails={() => navigate(`/student/opportunities/${item.id || '#'}`)}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyState 
                icon={Briefcase} 
                title="No active drives matching your profile" 
                message="Wait for coordinators to post new opportunities or update your skill preferences."
              />
            )}
          </section>

          <section className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                 <BookOpen className="text-indigo-600" size={24} /> Learning Path
              </h2>
              <Link to="/student/prep-center" className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition">
                Library
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {loading ? (
                [1, 2, 3].map(i => <Skeleton key={i} className="h-[180px]" />)
              ) : dashboardPrep.length > 0 ? dashboardPrep.map((res) => (
                <div key={res.id} className="flex flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-sm premium-card hover:bg-indigo-50/10 active:scale-[0.98]">
                    <div className="mb-4 flex items-start justify-between">
                      <span className="rounded-lg border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[10px] font-black text-indigo-700 uppercase tracking-widest">
                        {res.topic}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 leading-tight mb-2">{res.title}</h3>
                    <p className="flex-grow text-[11px] text-gray-500 line-clamp-2 leading-relaxed font-medium">{res.description}</p>
                    
                    <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <FileText size={12} /> {res.resourceType}
                      </div>
                      <button onClick={() => setSelectedResource(res)} className="px-4 py-1.5 rounded-lg bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition shadow-sm">
                          Prepare
                      </button>
                    </div>
                </div>
              )) : (
                <div className="col-span-3">
                   <EmptyState 
                    icon={BookOpen} 
                    title="Path Pending" 
                    message="Add some skills to your profile to get personalized preparation resources."
                  />
                </div>
              )}
            </div>
          </section>

          <section className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                 <Inbox className="text-slate-600" size={24} /> Feed
              </h2>
              <Link to="/notifications" className="text-xs font-black uppercase tracking-widest text-slate-600 hover:text-slate-800 transition">
                See all
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              {loading ? (
                [1, 2, 3].map(i => <Skeleton key={i} className="h-[100px]" />)
              ) : notifications.length > 0 ? (
                notifications.slice(0, 3).map((item) => (
                  <NotificationCard key={item.id || item.title} {...item} />
                ))
              ) : (
                <div className="col-span-3">
                  <EmptyState icon={Inbox} title="Inbox Zero" message="You're all caught up with your notifications." />
                </div>
              )}
            </div>
          </section>

          <ResourceModal 
            resource={selectedResource} 
            onClose={() => setSelectedResource(null)} 
          />
    </div>
  );
}
