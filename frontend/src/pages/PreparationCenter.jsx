import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Building, Code, CheckSquare, MessageSquare, ExternalLink, BookOpen, AlertCircle, PlayCircle, FileText, Filter, Zap, ArrowRight, Book } from "lucide-react";

import { fetchPrepResources } from '../services/api';
import ResourceModal from '../components/dashboard/ResourceModal';
import Skeleton from "../components/UI/Skeleton";
import EmptyState from "../components/UI/EmptyState";

// --- REUSABLE COMPONENT ---
function ResourceCard({ resource, onOpen }) {
  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'Beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Advanced': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'PDF': return <FileText size={14} className="mr-1.5 inline-block" />;
      case 'Sheet': return <BookOpen size={14} className="mr-1.5 inline-block" />;
      case 'Link': return <ExternalLink size={14} className="mr-1.5 inline-block" />;
      case 'Experience': return <MessageSquare size={14} className="mr-1.5 inline-block" />;
      case 'Test': return <Zap size={14} className="mr-1.5 inline-block" />;
      default: return <PlayCircle size={14} className="mr-1.5 inline-block" />;
    }
  };

  return (
    <div className="flex flex-col rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm premium-card animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-4 flex items-start justify-between">
        <span className="rounded-lg border border-blue-100 bg-blue-50/50 px-2.5 py-1 text-[9px] font-black text-blue-600 uppercase tracking-widest">
          {resource.company}
        </span>
        <span className={`rounded-lg px-2 py-0.5 text-[9px] font-black border uppercase tracking-widest ${getDifficultyColor(resource.difficulty)}`}>
          {resource.difficulty}
        </span>
      </div>
      
      <h3 className="text-base font-black text-gray-900 leading-tight tracking-tight mb-2">{resource.title}</h3>
      <p className="flex-grow text-[13px] font-medium text-gray-400 line-clamp-2 leading-relaxed">{resource.description}</p>
      
      <div className="flex flex-wrap gap-1.5 mt-5">
         {resource.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
               #{tag}
            </span>
         ))}
      </div>
      
      <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-5">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          {getTypeIcon(resource.resourceType)} {resource.estimatedTime}
        </span>
        <button onClick={onOpen} className="flex items-center gap-1.5 rounded-xl bg-gray-900 pl-4 pr-3 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-blue-600 shadow-lg shadow-gray-900/10 active:scale-95">
          <span>Explore</span> <ArrowRight size={14} className="ml-1" />
        </button>
      </div>
    </div>
  );
}

export default function PreparationCenter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [filterCompany, setFilterCompany] = useState(searchParams.get("company") || "All");
  const [filterTopic, setFilterTopic] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [selectedResource, setSelectedResource] = useState(null);

  useEffect(() => {
    const loadResources = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filterCompany !== "All") params.company = filterCompany;
        if (filterTopic !== "All") params.topic = filterTopic;
        if (filterType !== "All") params.resourceType = filterType;
        if (filterDifficulty !== "All") params.difficulty = filterDifficulty;
        if (searchQuery) params.search = searchQuery;

        const res = await fetchPrepResources(params);
        setResources(res.data || []);
      } catch (err) {
        console.error("Failed to load resources", err);
      } finally {
        setLoading(false);
      }
    };
    loadResources();
  }, [filterCompany, filterTopic, filterType, filterDifficulty, searchQuery]);

  // Update URL on search/company change
  useEffect(() => {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (filterCompany !== "All") params.company = filterCompany;
    setSearchParams(params, { replace: true });
  }, [searchQuery, filterCompany, setSearchParams]);

  // Dynamic filter options based on dataset
  const companies = ["All", ...new Set(resources.map(r => r.company))];
  const topics = ["All", ...new Set(resources.map(r => r.topic))];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.category]) acc[resource.category] = [];
    acc[resource.category].push(resource);
    return acc;
  }, {});

  const categoryHeaderMap = {
     "company": "Company Training Tracks",
     "skill": "Cognitive Mastery",
     "mock": "Assessment Simulators",
     "experience": "Insider Interview Logs"
  };

  return (
    <div className="mx-auto max-w-7xl pb-10 animate-in fade-in duration-700">
      
      {/* 1. Header */}
      <div className="mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Preparation Center</h1>
          <p className="mt-2 text-gray-500 font-medium text-lg">
            Master the skills required by top engineering companies with curated internal resources.
          </p>
        </div>
        <div className="bg-blue-50/50 px-6 py-3 rounded-3xl border border-blue-100/50 hidden lg:flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-black shadow-lg shadow-blue-600/20">
             {resources.length}
          </div>
          <div>
            <p className="text-sm font-black text-gray-900 leading-none">Curated Paths</p>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Available to you</p>
          </div>
        </div>
      </div>

      {/* 2. Top Summary Cards */}
      <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Building, label: "Hiring Hubs", category: 'company', color: 'text-blue-600', bg: 'bg-blue-50/30', border: 'border-blue-100/30' },
          { icon: Code, label: "Logic Packs", category: 'skill', color: 'text-emerald-600', bg: 'bg-emerald-50/30', border: 'border-emerald-100/30' },
          { icon: Zap, label: "Flash Tests", category: 'mock', color: 'text-amber-600', bg: 'bg-amber-50/30', border: 'border-amber-100/30' },
          { icon: MessageSquare, label: "Live Intel", category: 'experience', color: 'text-purple-600', bg: 'bg-purple-50/30', border: 'border-purple-100/30' },
        ].map((stat, i) => (
          <div key={i} className={clsx("flex items-center gap-5 rounded-[32px] border p-6 shadow-sm transition hover:shadow-lg hover:bg-white active:scale-95 transition-all text-left", stat.bg, stat.border)}>
             <div className={clsx("p-3 rounded-2xl bg-white shadow-sm border border-gray-50", stat.color)}>
                <stat.icon size={24} strokeWidth={2.5} />
             </div>
             <div>
               <p className="text-2xl font-black text-gray-900 leading-none">{resources.filter(r => r.category === stat.category).length}</p>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{stat.label}</p>
             </div>
          </div>
        ))}
      </div>

      {/* 3. Search + Filter Section */}
      <div className="mb-16 rounded-[40px] border border-gray-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by tech stack, role, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-[20px] border-2 border-gray-50 bg-gray-50 py-4 pl-14 pr-6 text-sm font-bold focus:border-blue-500 focus:bg-white focus:outline-none transition-all placeholder:text-gray-400 shadow-inner"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 mr-2 uppercase text-[10px] font-black tracking-widest">
              <Filter size={16} /> Filters
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="rounded-xl border-2 border-gray-50 bg-gray-50 px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-gray-700 outline-none focus:border-blue-500 transition-all cursor-pointer hover:bg-white"
              >
                {companies.map(c => <option key={c} value={c}>{c === 'All' ? 'Company' : c}</option>)}
              </select>

              <select
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="rounded-xl border-2 border-gray-50 bg-gray-50 px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-gray-700 outline-none focus:border-blue-500 transition-all cursor-pointer hover:bg-white"
              >
                {topics.map(t => <option key={t} value={t}>{t === 'All' ? 'Curriculum' : t}</option>)}
              </select>

              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="rounded-xl border-2 border-gray-50 bg-gray-50 px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-gray-700 outline-none focus:border-blue-500 transition-all cursor-pointer hover:bg-white"
              >
                {difficulties.map(d => <option key={d} value={d}>{d === 'All' ? 'Level' : d}</option>)}
              </select>
            </div>
            
            {(filterCompany !== "All" || filterTopic !== "All" || filterDifficulty !== "All" || searchQuery) && (
                <button
                  onClick={() => { setFilterCompany("All"); setFilterTopic("All"); setFilterType("All"); setFilterDifficulty("All"); setSearchQuery(""); }}
                  className="bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl border border-rose-100 hover:bg-rose-100 transition shadow-sm"
                >
                  Clear
                </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Resource Section */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} className="h-64" />)}
        </div>
      ) : Object.keys(groupedResources).length > 0 ? (
        <div className="space-y-20">
          {["company", "skill", "mock", "experience"].map((categoryKey) => (
             groupedResources[categoryKey] && groupedResources[categoryKey].length > 0 && (
                <div key={categoryKey} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="mb-8 flex items-center justify-between border-b-2 border-gray-50 pb-6">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                       <div className="w-2.5 h-10 bg-gray-900 rounded-full"></div>
                       {categoryHeaderMap[categoryKey]}
                    </h2>
                    <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 shadow-sm shadow-blue-600/5">
                      {groupedResources[categoryKey].length} Handbooks
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {groupedResources[categoryKey].map(resource => (
                      <ResourceCard key={resource._id} resource={resource} onOpen={() => setSelectedResource(resource)} />
                    ))}
                  </div>
                </div>
             )
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={Book} 
          title="Library empty for these filters" 
          message="We couldn't find any resources matching your current selection. Try broadening your criteria." 
          action={{
            label: "Reset Search Library",
            onClick: () => { setSearchQuery(""); setFilterCompany("All"); setFilterTopic("All"); setFilterDifficulty("All"); }
          }}
        />
      )}

      <ResourceModal 
        resource={selectedResource} 
        onClose={() => setSelectedResource(null)} 
      />
    </div>
  );
}

const clsx = (...classes) => classes.filter(Boolean).join(' ');
