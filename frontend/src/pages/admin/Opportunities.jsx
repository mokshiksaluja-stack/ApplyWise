import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import OpportunityCard from '../../components/OpportunityCard';
import { Search, Filter, Plus, UserPlus } from 'lucide-react';
import { useAdminCoordinatorContext } from '../../context/AdminCoordinatorContext';

const Opportunities = () => {
  const { sharedOpportunities, coordinators, assignDrive, unassignDrive, refreshOpportunities } = useAdminCoordinatorContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();

  // Re-fetch from DB every time this page mounts (e.g., after creating a new job)
  useEffect(() => {
    if (refreshOpportunities) refreshOpportunities();
  }, []);


  const roles = ['All', 'Frontend', 'Backend', 'Data Analyst'];

  const filteredJobs = sharedOpportunities.filter(job => {
    const matchesSearch = job.company?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.role?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = activeFilter === 'All' || job.type === activeFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <Layout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Opportunities</h1>
          <p className="text-gray-500 font-medium text-[15px]">Find and apply to the latest internships and full-time roles.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/opportunities/new')}
          className="mt-4 sm:mt-0 flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer font-medium"
        >
          <Plus className="w-5 h-5 mr-1" />
          Add Opportunity
        </button>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex w-full md:w-96 bg-gray-50 items-center px-4 py-2.5 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search by company or role..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder-gray-400"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-gray-400 mr-1" />
          {roles.map(role => (
            <button
              key={role}
              onClick={() => setActiveFilter(role)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === role 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-100'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
          No opportunities match your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredJobs.map(job => (
            <div key={job.id} className="relative group">
              <OpportunityCard {...job} />
              <div className="absolute top-2 right-12 z-10 bg-white/90 shadow-sm border border-gray-200 rounded-lg backdrop-blur-sm p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2">
                   <UserPlus className="w-4 h-4 text-gray-500" />
                   <select 
                     className="text-xs font-semibold bg-transparent border-none outline-none text-gray-700 w-24 cursor-pointer"
                     value={job.assignedCoordinatorId || ''}
                     onChange={(e) => {
                        const val = e.target.value;
                        if(val === '') unassignDrive(job.id);
                        else assignDrive(job.id, val);
                     }}
                   >
                     <option value="">Unassigned</option>
                     {coordinators.map(c => (
                       <option key={c.id} value={c.id}>{c.name}</option>
                     ))}
                   </select>
                </div>
              </div>
              {job.assignedCoordinatorId && (
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm whitespace-nowrap border border-indigo-200">
                  Assigned to {coordinators.find(c => c.id === job.assignedCoordinatorId)?.name}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Opportunities;
