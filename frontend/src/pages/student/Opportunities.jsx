import { useState, useMemo, useEffect } from "react";
import OpportunityCard from "../../components/dashboard/OpportunityCard";
import { fetchStudentProfile } from "../../services/studentService";
import { evaluateEligibility } from "../../utils/eligibilityEngine";
import { DashboardController } from "../../controllers/dashboardController";
import { Search, Briefcase, Filter, XCircle } from "lucide-react";
import Skeleton from "../../components/UI/Skeleton";
import EmptyState from "../../components/UI/EmptyState";
import { useToast } from "../../context/ToastContext";

export default function Opportunities() {
  const [profile, setProfile] = useState(null);
  const [opportunitiesList, setOpportunitiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const { showToast } = useToast();

  const filters = ["All", "Eligible", "Partially Ready", "Not Eligible"];

  useEffect(() => {
    const fetchData = async () => {
      const studentId = localStorage.getItem("studentId");
      try {
        const [opps, profileData] = await Promise.all([
          DashboardController.getOpportunities(),
          studentId && studentId !== "null" ? fetchStudentProfile(studentId) : null
        ]);
        setOpportunitiesList(opps);
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast("Failed to sync opportunities. Please refresh.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showToast]);

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
  }, [profile, opportunitiesList]);

  const filteredOpportunities = useMemo(() => {
    return augmentedOpportunities.filter((item) => {
      if (filterStatus !== "All" && item.dynamicStatus !== filterStatus) return false;
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

  return (
    <div className="mx-auto max-w-7xl animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Opportunities</h1>
        <p className="mt-2 text-gray-500 font-medium">
          Discover roles tailored to your unique skill profile and academic standing.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-12 flex flex-col items-center justify-between gap-6 rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm md:flex-row">
        <div className="flex w-full flex-wrap gap-2 md:w-auto">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterStatus(filter)}
              className={`rounded-xl px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all interactive-button ${
                filterStatus === filter
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-100/50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by company or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50 py-3.5 pl-12 pr-4 text-sm font-semibold focus:border-blue-500 focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 shadow-inner"
          />
        </div>
      </div>

      {/* Opportunities Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[340px]" />
          ))}
        </div>
      ) : filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredOpportunities.map((opp) => (
            <div key={opp.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <OpportunityCard
                company={opp.company}
                role={opp.role}
                stipend={opp.stipend}
                dynamicStatus={opp.dynamicStatus}
                requiredSkills={opp.requiredSkills}
                matchedCount={opp.matchedCount}
                totalCount={opp.totalCount}
                missingSkills={opp.missingSkills}
                readinessScore={opp.readinessScore || opp.matchedCount ? Math.round((opp.matchedCount / opp.totalCount) * 100) : 0}
                id={opp._id || opp.id}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-500">
          <EmptyState 
            icon={Briefcase} 
            title="No matches found" 
            message="We couldn't find any opportunities matching your current filters or search query." 
            action={{
              label: "Clear All Filters",
              onClick: () => { setFilterStatus("All"); setSearchQuery(""); }
            }}
          />
        </div>
      )}
    </div>
  );
}
