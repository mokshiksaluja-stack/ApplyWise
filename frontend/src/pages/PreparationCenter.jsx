import { useState, useMemo } from "react";
import { Search, Building, Code, CheckSquare, MessageSquare, ExternalLink, BookOpen, AlertCircle, PlayCircle, FileText, Filter } from "lucide-react";

import { prepResources } from '../data/prepResources';
import ResourceModal from '../components/dashboard/ResourceModal';

// --- REUSABLE COMPONENT ---
function ResourceCard({ resource, onOpen }) {
  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'PDF': return <FileText size={14} className="mr-1 inline-block" />;
      case 'Sheet': return <BookOpen size={14} className="mr-1 inline-block" />;
      case 'Link': return <ExternalLink size={14} className="mr-1 inline-block" />;
      case 'Experience': return <MessageSquare size={14} className="mr-1 inline-block" />;
      default: return <PlayCircle size={14} className="mr-1 inline-block" />;
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md h-full">
      <div className="mb-3 flex items-start justify-between">
        <span className="rounded-md border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700">
          {resource.company}
        </span>
        <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${getDifficultyColor(resource.difficulty)}`}>
          {resource.difficulty}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 leading-snug">{resource.title}</h3>
      <p className="mt-2 flex-grow text-sm text-gray-500">{resource.description}</p>
      
      <div className="flex flex-wrap gap-2 mt-4">
         {resource.tags.map(tag => (
            <span key={tag} className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wide">
               {tag}
            </span>
         ))}
      </div>
      
      <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4">
        <span className="text-xs font-semibold text-gray-500 flex items-center">
          {getTypeIcon(resource.resourceType)} {resource.estimatedTime}
        </span>
        <button onClick={onOpen} className="flex items-center gap-1.5 rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-600 hover:text-white">
          <span>{resource.linkLabel}</span> <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
}

export default function PreparationCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCompany, setFilterCompany] = useState("All");
  const [filterTopic, setFilterTopic] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [selectedResource, setSelectedResource] = useState(null);

  // Summaries
  const companyResourcesCount = prepResources.filter(r => r.category === "company").length;
  const skillResourcesCount = prepResources.filter(r => r.category === "skill").length;
  const mockTestsCount = prepResources.filter(r => r.category === "mock").length;
  const experiencesCount = prepResources.filter(r => r.category === "experience").length;

  // Extract unique options for dropdowns
  const companies = ["All", ...new Set(prepResources.map(r => r.company))];
  const topics = ["All", ...new Set(prepResources.map(r => r.topic))];
  const types = ["All", ...new Set(prepResources.map(r => r.resourceType))];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  const filteredResources = useMemo(() => {
    return prepResources.filter(res => {
      // Multi-select filters
      if (filterCompany !== "All" && res.company !== filterCompany) return false;
      if (filterTopic !== "All" && res.topic !== filterTopic) return false;
      if (filterType !== "All" && res.resourceType !== filterType) return false;
      if (filterDifficulty !== "All" && res.difficulty !== filterDifficulty) return false;
      
      // Filter by Search (Title, Company, Topic, Tags)
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const tagMatch = res.tags.some(tag => tag.toLowerCase().includes(q));
        return (
          res.title.toLowerCase().includes(q) || 
          res.company.toLowerCase().includes(q) || 
          res.topic.toLowerCase().includes(q) || 
          tagMatch
        );
      }
      return true;
    });
  }, [searchQuery, filterTopic]);

  // Grouping for Display
  const categoryHeaderMap = {
     "company": "Company-wise Preparation",
     "skill": "Skill-wise Preparation",
     "mock": "Mock Tests & Aptitude",
     "experience": "Interview Experiences"
  };

  const groupedResources = filteredResources.reduce((acc, resource) => {
    if (!acc[resource.category]) acc[resource.category] = [];
    acc[resource.category].push(resource);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl pb-10">
      
      {/* 1. Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Preparation Center</h1>
        <p className="mt-2 text-gray-500">
          Prepare smarter with curated resources, interview experiences, and mock tests.
        </p>
      </div>

      {/* 2. Top Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-5 shadow-sm transition hover:bg-blue-50">
           <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shadow-sm border border-blue-200">
             <Building size={24} />
           </div>
           <div>
             <p className="text-2xl font-bold text-gray-900">{companyResourcesCount}</p>
             <p className="text-xs font-semibold text-gray-500 uppercase">Company Resources</p>
           </div>
        </div>
        
        <div className="flex items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-sm transition hover:bg-emerald-50">
           <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shadow-sm border border-emerald-200">
             <Code size={24} />
           </div>
           <div>
             <p className="text-2xl font-bold text-gray-900">{skillResourcesCount}</p>
             <p className="text-xs font-semibold text-gray-500 uppercase">Skill Resources</p>
           </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-amber-50/50 p-5 shadow-sm transition hover:bg-amber-50">
           <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 shadow-sm border border-amber-200">
             <CheckSquare size={24} />
           </div>
           <div>
             <p className="text-2xl font-bold text-gray-900">{mockTestsCount}</p>
             <p className="text-xs font-semibold text-gray-500 uppercase">Mock Tests</p>
           </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-purple-100 bg-purple-50/50 p-5 shadow-sm transition hover:bg-purple-50">
           <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 shadow-sm border border-purple-200">
             <MessageSquare size={24} />
           </div>
           <div>
             <p className="text-2xl font-bold text-gray-900">{experiencesCount}</p>
             <p className="text-xs font-semibold text-gray-500 uppercase">Experiences</p>
           </div>
        </div>
      </div>

      {/* 3. Search + Filter Section */}
      <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by title, tag, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Filter size={16} className="text-gray-400 hidden sm:block" />
            
            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
            >
              {companies.map(c => <option key={c} value={c}>{c === 'All' ? 'Company (All)' : c}</option>)}
            </select>

            <select
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
              className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
            >
              {topics.map(t => <option key={t} value={t}>{t === 'All' ? 'Topic (All)' : t}</option>)}
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
            >
              {types.map(t => <option key={t} value={t}>{t === 'All' ? 'Type (All)' : t}</option>)}
            </select>
            
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
            >
              {difficulties.map(d => <option key={d} value={d}>{d === 'All' ? 'Difficulty (All)' : d}</option>)}
            </select>
            
            {(filterCompany !== "All" || filterTopic !== "All" || filterType !== "All" || filterDifficulty !== "All") && (
                <button
                  onClick={() => { setFilterCompany("All"); setFilterTopic("All"); setFilterType("All"); setFilterDifficulty("All"); }}
                  className="text-xs font-bold text-red-500 hover:text-red-700 transition px-2"
                >
                  Clear Filters
                </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Resource Sections */}
      {Object.keys(groupedResources).length > 0 ? (
        <div className="space-y-10">
          {["company", "skill", "mock", "experience"].map((categoryKey) => (
             groupedResources[categoryKey] && groupedResources[categoryKey].length > 0 && (
                <div key={categoryKey}>
                  <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                    <h2 className="text-xl font-bold text-gray-900">{categoryHeaderMap[categoryKey]}</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {groupedResources[categoryKey].map(resource => (
                      <ResourceCard key={resource.id} resource={resource} onOpen={() => setSelectedResource(resource)} />
                    ))}
                  </div>
                </div>
             )
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white py-24 text-center">
           <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
             <AlertCircle size={28} className="text-gray-300" />
           </div>
           <h3 className="text-lg font-bold text-gray-900">No resources found</h3>
           <p className="mt-1 max-w-sm text-sm text-gray-500">
             We couldn't find any preparation material matching your current search criteria.
           </p>
        </div>
      )}

      <ResourceModal 
        resource={selectedResource} 
        onClose={() => setSelectedResource(null)} 
      />
    </div>
  );
}
