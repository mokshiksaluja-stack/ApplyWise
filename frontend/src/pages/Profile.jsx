import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Book, Code, Briefcase, Link as LinkIcon, Edit } from "lucide-react";
import { fetchStudentProfile } from "../services/studentService";
import { calculateProfileCompletion } from "../utils/studentMetrics";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-pulse rounded-full bg-blue-200"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-5xl flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="rounded-full bg-gray-50 p-6 mb-6 inline-flex border border-gray-100">
          <User size={48} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">No Profile Found</h2>
        <p className="mt-2 text-gray-500 max-w-md text-center mb-8">
          You haven't set up your placement profile data yet. Please go to the wizard to create it!
        </p>
        <Link to="/profile/edit" className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-sm hover:bg-blue-700 transition">
          Create Profile
        </Link>
      </div>
    );
  }

  const completionPct = calculateProfileCompletion(profile);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-500">
            View and manage your professional details.
          </p>
        </div>
        <Link 
          to="/profile/edit"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 transition shadow-sm hover:shadow"
        >
          <Edit size={16} />
          Edit Profile
        </Link>
      </div>

      {/* Completion Banner */}
      <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-6">
        <div className="relative h-20 w-20 flex-shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-100"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-emerald-500 transition-all duration-1000 ease-out"
              strokeDasharray={`${completionPct}, 100`}
              strokeWidth="3"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-extrabold text-gray-800">{completionPct}%</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">Profile Completion Tracker</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            A fully completed profile dramatically improves your readiness score and ensures the automated opportunity engine maps your skillset to the best tier-1 companies. 
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal info */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
               <User size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
          </div>
          <div className="space-y-4">
             <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Full Name</span>
                <span className="font-medium text-gray-900">{profile.fullName || "—"}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Enrollment No.</span>
                <span className="font-medium text-gray-900">{profile.enrollmentNumber || "—"}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-gray-500 text-sm">College Email</span>
                <span className="font-medium text-gray-900">{profile.collegeEmail || "—"}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Personal Email</span>
                <span className="font-medium text-gray-900">{profile.personalEmail || "—"}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Phone</span>
                <span className="font-medium text-gray-900">{profile.phone || "—"}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Gender</span>
                <span className="font-medium text-gray-900">{profile.gender || "—"}</span>
             </div>
          </div>
        </div>

        {/* Academic info */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
               <Book size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Academic Information</h2>
          </div>
          <div className="space-y-4">
             <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Degree & Branch</span>
                <span className="font-medium text-gray-900">{profile.degree || "—"} • {profile.branch || "—"}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Semester</span>
                <span className="font-medium text-gray-900">{profile.semester || "—"}</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">CGPA</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                  {profile.cgpa || "—"}
                </span>
             </div>
             <div className="flex justify-between">
                <span className="text-gray-500 text-sm">10th / 12th</span>
                <span className="font-medium text-gray-900">{profile.tenthPercentage || "—"}% / {profile.twelfthPercentage || "—"}%</span>
             </div>
             <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Backlogs</span>
                <span className="font-medium text-gray-900">{profile.backlogs || "—"}</span>
             </div>
          </div>
        </div>

        {/* Skills */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
               <Code size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Technical Skills</h2>
          </div>
          <div className="space-y-5">
             <div>
                <p className="text-sm text-gray-500 mb-3">Core Stack</p>
                <div className="flex flex-wrap gap-2">
                  {profile.technicalSkills && profile.technicalSkills.length > 0 ? (
                    profile.technicalSkills.map(s => (
                      <span key={s} className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-semibold border border-emerald-100">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400 italic">No skills listed</span>
                  )}
                </div>
             </div>
             <div className="space-y-3 pt-2">
               <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Primary Domain</span>
                  <span className="font-medium text-gray-900">{profile.primaryDomain || "—"}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Primary Language</span>
                  <span className="font-medium text-gray-900">{profile.primaryLanguage || "—"}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">DSA Level</span>
                  <span className="font-medium text-gray-900">{profile.dsaLevel || "—"}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Coding Platform</span>
                  <span className="font-medium text-gray-900">{profile.codingPlatform || "—"}</span>
               </div>
             </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
               <Briefcase size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Career Preferences</h2>
          </div>
          <div className="space-y-5">
            <div>
               <p className="text-sm text-gray-500 mb-3">Interested Roles</p>
               <div className="flex flex-wrap gap-2">
                 {profile.interestedRoles && profile.interestedRoles.length > 0 ? (
                   profile.interestedRoles.map(r => (
                     <span key={r} className="rounded-full bg-amber-50 text-amber-800 px-3 py-1 text-xs font-semibold border border-amber-100">
                       {r}
                     </span>
                   ))
                 ) : (
                   <span className="text-sm text-gray-400 italic">No roles selected</span>
                 )}
               </div>
            </div>
            <div className="space-y-3 pt-2">
               <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Job Type</span>
                  <span className="font-medium text-gray-900">{profile.preferredJobType || "—"}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Location</span>
                  <span className="font-medium text-gray-900">{profile.preferredLocation || "—"}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Expected CTC</span>
                  <span className="font-medium text-gray-900">{profile.expectedCompensation || "—"}</span>
               </div>
            </div>
          </div>
        </div>
        
        {/* Links */}
        <div className="md:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
               <LinkIcon size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Resume & Links</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <a href={profile.resumeLink || "#"} target={profile.resumeLink ? "_blank" : "_self"} rel="noreferrer" className="flex flex-col items-center p-5 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition group">
                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                   <Code size={20} />
                </div>
                <span className="font-semibold text-gray-900">Resume</span>
              </a>
              <a href={profile.linkedIn || "#"} target={profile.linkedIn ? "_blank" : "_self"} rel="noreferrer" className="flex flex-col items-center p-5 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition group">
                <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition duration-300">
                   <LinkIcon size={20} />
                </div>
                <span className="font-semibold text-gray-900">LinkedIn</span>
              </a>
              <a href={profile.github || "#"} target={profile.github ? "_blank" : "_self"} rel="noreferrer" className="flex flex-col items-center p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition group">
                <div className="h-12 w-12 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-gray-800 group-hover:text-white transition duration-300">
                   <Code size={20} />
                </div>
                <span className="font-semibold text-gray-900">GitHub</span>
              </a>
              <a href={profile.portfolio || "#"} target={profile.portfolio ? "_blank" : "_self"} rel="noreferrer" className="flex flex-col items-center p-5 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition group">
                <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition duration-300">
                   <Briefcase size={20} />
                </div>
                <span className="font-semibold text-gray-900">Portfolio</span>
              </a>
          </div>
        </div>

      </div>
    </div>
  );
}
