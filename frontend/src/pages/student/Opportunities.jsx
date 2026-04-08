import { useState, useMemo, useEffect } from "react";
import OpportunityCard from "../../components/dashboard/OpportunityCard";
import { fetchStudentProfile } from "../../services/studentService";
import { evaluateEligibility } from "../../utils/eligibilityEngine";
import { opportunitiesList } from "../../data/dummyOpportunities";
import { getRecommendedResources } from "../../utils/recommendationEngine";
import { Search, X, CheckCircle, AlertTriangle, XCircle, Briefcase, FileText, Users, Link as LinkIcon, BookOpen, ExternalLink } from "lucide-react";
import ResourceModal from "../../components/dashboard/ResourceModal";

export default function Opportunities() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);

  const recommendedPrep = useMemo(() => {
    if (!selectedOpportunity) return [];
    return getRecommendedResources(selectedOpportunity, 3);
  }, [selectedOpportunity]);

  const filters = ["All", "Eligible", "Partially Ready", "Not Eligible"];

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

  // Augment opportunities with intelligent evaluation logic
  const augmentedOpportunities = useMemo(() => {
    return opportunitiesList.map((opp) => {
      const evalResult = evaluateEligibility(profile, opp);
      return {
        ...opp,
        dynamicStatus: evalResult.status,
        matchedSkills: evalResult.matchedSkills,
        missingSkills: evalResult.missingSkills,
        matchedCount: evalResult.skillMatchCount,
        totalCount: evalResult.totalSkills,
        eligibilityReason: evalResult.reasons.join(" ")
      };
    });
  }, [profile]);

  const filteredOpportunities = useMemo(() => {
    return augmentedOpportunities.filter((item) => {
      // Filter by Status
      if (filterStatus !== "All" && item.dynamicStatus !== filterStatus) {
        return false;
      }
      // Filter by Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.company.toLowerCase().includes(query) ||
          item.role.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [searchQuery, filterStatus, augmentedOpportunities]);

  const closeModal = () => setSelectedOpportunity(null);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-pulse rounded-full bg-blue-200"></div>
          <p className="text-gray-500 font-medium animate-pulse">Running Eligibility Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Opportunities</h1>
        <p className="mt-2 text-gray-500">
          Discover and apply for internships and full-time roles tailored accurately to your skills.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:flex-row">
        <div className="flex w-full flex-wrap gap-2 md:w-auto">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterStatus(filter)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filterStatus === filter
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by company or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Opportunities Grid */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              company={opp.company}
              role={opp.role}
              stipend={opp.stipend}
              dynamicStatus={opp.dynamicStatus}
              requiredSkills={opp.requiredSkills}
              matchedCount={opp.matchedCount}
              totalCount={opp.totalCount}
              missingSkills={opp.missingSkills}
              onViewDetails={() => setSelectedOpportunity(opp)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20">
          <Briefcase size={40} className="mb-4 text-gray-300" />
          <h3 className="text-lg font-bold text-gray-900">No opportunities found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria or filters.</p>
        </div>
      )}

      {/* Modal Popup */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/95 px-6 py-5 backdrop-blur-sm">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedOpportunity.company}</h2>
                <p className="text-sm font-medium text-blue-600">{selectedOpportunity.role}</p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-full bg-gray-50 p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-6 rounded-xl bg-gray-50 p-4 flex gap-4 text-sm text-gray-700">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-1">Overview</p>
                  <p>{selectedOpportunity.overview}</p>
                </div>
                <div className="min-w-fit flex flex-col gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 shadow-sm"><Briefcase size={12}/> {selectedOpportunity.jobType}</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 shadow-sm"><FileText size={12}/> CGPA: {selectedOpportunity.requiredCGPA}+</span>
                </div>
              </div>

              <div className="mb-8 grid gap-6 md:grid-cols-2">
                {/* Skills Box */}
                <div className="rounded-2xl border border-gray-100 p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
                    <CodeIcon size={16} className="text-blue-500" /> Skill Analysis
                  </h3>
                  
                  <div className="mb-3">
                    <p className="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Required ({selectedOpportunity.totalCount})</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedOpportunity.requiredSkills.map(s => (
                        <span key={s} className="rounded border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-gray-600 shadow-sm">{s}</span>
                      ))}
                    </div>
                  </div>

                  {selectedOpportunity.matchedCount > 0 && (
                     <div className="mb-3">
                       <p className="mb-2 text-xs font-semibold text-green-600 uppercase tracking-wider">Matched ({selectedOpportunity.matchedCount})</p>
                       <div className="flex flex-wrap gap-1.5">
                         {selectedOpportunity.matchedSkills.map(s => (
                           <span key={s} className="rounded border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">{s}</span>
                         ))}
                       </div>
                     </div>
                  )}

                  {selectedOpportunity.missingSkills.length > 0 && (
                     <div>
                       <p className="mb-2 text-xs font-semibold text-red-500 uppercase tracking-wider">Missing ({selectedOpportunity.missingSkills.length})</p>
                       <div className="flex flex-wrap gap-1.5">
                         {selectedOpportunity.missingSkills.map(s => (
                           <span key={s} className="rounded border border-red-100 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">{s}</span>
                         ))}
                       </div>
                       <p className="mt-2 text-xs text-gray-500 italic">Est. Prep Time: {selectedOpportunity.missingSkills.length * 2} weeks</p>
                     </div>
                  )}
                </div>

                {/* Eligibility & Action Tips Box */}
                <div className="flex flex-col gap-4">
                  <div className={`rounded-2xl border p-5 ${
                    selectedOpportunity.dynamicStatus === 'Eligible' ? 'border-green-100 bg-green-50' : 
                    selectedOpportunity.dynamicStatus === 'Partially Ready' ? 'border-yellow-100 bg-yellow-50' : 
                    'border-red-100 bg-red-50'
                  }`}>
                    <h3 className={`mb-2 flex items-center gap-2 text-sm font-bold ${
                      selectedOpportunity.dynamicStatus === 'Eligible' ? 'text-green-800' : 
                      selectedOpportunity.dynamicStatus === 'Partially Ready' ? 'text-yellow-800' : 
                      'text-red-800'
                    }`}>
                      {selectedOpportunity.dynamicStatus === 'Eligible' ? <CheckCircle size={16} /> : 
                       selectedOpportunity.dynamicStatus === 'Partially Ready' ? <AlertTriangle size={16} /> : 
                       <XCircle size={16} /> }
                      {selectedOpportunity.dynamicStatus}
                    </h3>
                    <p className={`text-sm ${
                      selectedOpportunity.dynamicStatus === 'Eligible' ? 'text-green-700' : 
                      selectedOpportunity.dynamicStatus === 'Partially Ready' ? 'text-yellow-700' : 
                      'text-red-700'
                    }`}>
                      {selectedOpportunity.eligibilityReason}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900">
                      <FileText size={16} className="text-purple-500" /> Actionable Tips
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Coding / DSA</p>
                        <p className="mt-1 text-sm text-gray-700">{selectedOpportunity.prepTips || "Prepare highly scalable architecture and standard Graph algorithms."}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Resume Tuning</p>
                        <p className="mt-1 text-sm text-gray-700">{selectedOpportunity.resumeTips}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Preparation Resources Block */}
              {recommendedPrep.length > 0 && (
                <div className="mb-6 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm mt-6">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
                    <BookOpen size={16} className="text-blue-500" /> Recommended Preparation
                  </h3>
                  <div className="flex flex-col gap-3">
                    {recommendedPrep.map(res => (
                      <div key={res.id} className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 hover:bg-gray-50 transition">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{res.title}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{res.description}</p>
                          <div className="flex gap-3 mt-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            <span className="flex items-center gap-1"><FileText size={12}/> {res.resourceType}</span>
                            <span>•</span>
                            <span>{res.estimatedTime}</span>
                            <span>•</span>
                            <span className={`${res.difficulty === 'Advanced' ? 'text-red-500' : res.difficulty === 'Intermediate' ? 'text-yellow-500' : 'text-green-500'}`}>{res.difficulty}</span>
                          </div>
                        </div>
                        <button onClick={() => setSelectedResource(res)} className="flex-shrink-0 flex items-center gap-1.5 rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs font-bold text-blue-600 transition hover:bg-blue-50 hover:border-blue-200 shadow-sm">
                          <span>Open</span> <ExternalLink size={12}/>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dummy Alumni Reference Block */}
              <div className="mb-6 rounded-2xl border border-gray-100 bg-gray-50 p-5 mt-2">
                 <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
                    <Users size={16} className="text-blue-500" /> College Alumni Insights
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-700 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                     <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700 shrink-0">AT</div>
                     <div className="flex-1">
                        <p className="font-semibold text-gray-900">Aryan Tiwari - Batch of '24</p>
                        <p className="text-xs text-gray-500">Placed as {selectedOpportunity.role} at {selectedOpportunity.company}</p>
                     </div>
                     <button className="px-3 py-1.5 flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-semibold transition">
                       <LinkIcon size={12}/> Connect
                     </button>
                  </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-5">
                <span className="text-xs font-semibold text-gray-500">
                  Deadline: <span className="text-red-500">{selectedOpportunity.deadline || "TBA"}</span>
                </span>
                <div className="flex gap-3">
                  <button 
                    onClick={closeModal}
                    className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={selectedOpportunity.dynamicStatus === 'Not Eligible'}
                    className={`rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition shadow-sm ${
                      selectedOpportunity.dynamicStatus === 'Not Eligible' 
                      ? 'bg-blue-300 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {selectedOpportunity.dynamicStatus === 'Not Eligible' ? 'Cannot Apply' : 'Apply Now'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Reusable Resource Modal */}
      <ResourceModal 
        resource={selectedResource} 
        onClose={() => setSelectedResource(null)}
      />
    </div>
  );
}

// Simple internal icon for code
function CodeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
