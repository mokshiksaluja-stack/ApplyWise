import { useState, useMemo, useEffect } from "react";
import OpportunityCard from "../../components/dashboard/OpportunityCard";
import { fetchStudentProfile } from "../../services/studentService";
import { evaluateEligibility } from "../../utils/eligibilityEngine";
import { DashboardController } from "../../controllers/dashboardController";
import { Search, Briefcase } from "lucide-react";

export default function Opportunities() {
  const [profile, setProfile] = useState(null);
  const [opportunitiesList, setOpportunitiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
              readinessScore={opp.readinessScore || opp.matchedCount ? Math.round((opp.matchedCount / opp.totalCount) * 100) : 0}
              id={opp._id || opp.id}
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

    </div>
  );
}
