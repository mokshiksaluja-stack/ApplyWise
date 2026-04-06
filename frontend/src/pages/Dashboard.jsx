import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileStatCard from "../components/layouts/ProfileStatCard";
import OpportunityCard from "../components/dashboard/OpportunityCard";
import NotificationCard from "../components/dashboard/NotificationCard";
import ApplicationCard from "../components/dashboard/ApplicationCard";
import ReadinessCard from "../components/dashboard/ReadinessCard";

import { fetchStudentProfile } from "../services/studentService";
import { calculateProfileCompletion, calculateReadinessScore } from "../utils/studentMetrics";
import { evaluateEligibility } from "../utils/eligibilityEngine";
import { getDashboardRecommendedResources } from "../utils/recommendationEngine";
import { BookOpen, ExternalLink, FileText } from "lucide-react";
import ResourceModal from "../components/dashboard/ResourceModal";

import { opportunitiesList as opportunities } from "../data/dummyOpportunities";
import { initialNotifications as notifications } from "../data/dummyNotifications";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState(null);
  const navigate = useNavigate();

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
      } finally {
        setLoading(false);
      }
    };
    
    getProfile();
  }, []);

  const completionPercentage = calculateProfileCompletion(profile);
  const readinessResult = calculateReadinessScore(profile, completionPercentage);
  const dashboardPrep = getDashboardRecommendedResources(profile, 3);

  return (
    <>
          {loading ? (
            <div className="mb-8 flex items-center space-x-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                <div className="h-3 w-48 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          ) : profile ? (
            <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-3xl font-bold">Welcome back, {profile.fullName}! 👋</h2>
                      <p className="mt-2 font-medium text-blue-100 opacity-90">
                        {profile.primaryDomain} Specialist • CGPA: {profile.cgpa}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      {profile.technicalSkills?.slice(0, 4).map((skill) => (
                          <span key={skill} className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                              {skill}
                          </span>
                      ))}
                      {profile.technicalSkills?.length > 4 && (
                          <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
                              +{profile.technicalSkills.length - 4} more
                          </span>
                      )}
                    </div>
                </div>
            </div>
          ) : (
            <div className="mb-8 flex flex-col items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900 md:flex-row">
                <div>
                  <h3 className="text-lg font-bold">Complete Your Profile</h3>
                  <p className="mt-1 text-sm opacity-90">Set up your profile to activate your readiness score and receive personalized opportunities.</p>
                </div>
                <a href="/profile/edit" className="mt-4 rounded-xl bg-amber-200 px-5 py-2.5 text-sm font-semibold text-amber-900 transition hover:bg-amber-300 md:mt-0">
                  Go to Wizard
                </a>
            </div>
          )}

          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <ProfileStatCard title="Profile Completion" percentage={completionPercentage} />

                    <ReadinessCard score={readinessResult.score} />

                    <ApplicationCard total={4} active={3} />
        </section>


          <section className="mt-10">
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-2xl font-semibold text-gray-900">
      Recommended Opportunities
    </h2>
    <Link to="/opportunities" className="text-sm font-medium text-blue-600 hover:text-blue-700">
      View all
    </Link>
  </div>

  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
    {opportunities.slice(0, 3).map((item) => {
      const evalResult = evaluateEligibility(profile, item);

      return (
        <OpportunityCard 
          key={item.company} 
          {...item} 
          dynamicStatus={evalResult.status}
          matchedCount={evalResult.skillMatchCount}
          totalCount={evalResult.totalSkills}
          missingSkills={evalResult.missingSkills}
          onViewDetails={() => navigate("/opportunities")}
        />
      );
    })}
  </div>
</section>

<section className="mt-10">
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
       Recommended Prep
    </h2>
    <Link to="/student/prep-center" className="text-sm font-medium text-blue-600 hover:text-blue-700">
      View all
    </Link>
  </div>

  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
    {dashboardPrep.length > 0 ? dashboardPrep.map((res) => (
       <div key={res.id} className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 flex items-start justify-between">
             <span className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
               {res.topic}
             </span>
          </div>
          <h3 className="text-base font-bold text-gray-900 leading-snug">{res.title}</h3>
          <p className="mt-2 flex-grow text-xs text-gray-500 line-clamp-2 leading-relaxed">{res.description}</p>
          
          <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
             <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase">
                <FileText size={12} /> {res.resourceType}
             </div>
             <button onClick={() => setSelectedResource(res)} className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition">
                Open <ExternalLink size={12} />
             </button>
          </div>
       </div>
    )) : (
       <div className="col-span-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-10 flex flex-col items-center justify-center text-center">
          <BookOpen size={24} className="text-gray-300 mb-2"/>
          <p className="text-sm font-medium text-gray-500">No specific prep resources recommended yet.</p>
       </div>
    )}
  </div>
</section>

<section className="mt-10">
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-2xl font-semibold text-gray-900">
      Recent Notifications
    </h2>
    <Link to="/notifications" className="text-sm font-medium text-blue-600 hover:text-blue-700">
      View all
    </Link>
  </div>

  <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
    {notifications.slice(0, 3).map((item) => (
      <NotificationCard key={item.title} {...item} />
    ))}
  </div>
</section>

<ResourceModal 
  resource={selectedResource} 
  onClose={() => setSelectedResource(null)} 
/>
    </>
  );
}