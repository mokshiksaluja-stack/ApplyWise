import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import OpportunityCard from '../components/OpportunityCard';
import { DashboardController } from '../controllers/dashboardController';
import { Search, Filter, Plus, X } from 'lucide-react';

const Opportunities = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newJob, setNewJob] = useState({
    company: '', role: '', salary: '', deadline: '', logo: '', tags: '', description: '', type: 'Frontend'
  });

  const fetchJobs = () => {
    DashboardController.getOpportunities().then(setJobs);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const roles = ['All', 'Frontend', 'Backend', 'Data Analyst'];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.company?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.role?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = activeFilter === 'All' || job.type === activeFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddJob = async (e) => {
    e.preventDefault();
    const formattedTags = newJob.tags ? newJob.tags.split(',').map(tag => tag.trim()) : [];
    await DashboardController.createOpportunity({
      ...newJob,
      tags: formattedTags
    });
    setIsModalOpen(false);
    setNewJob({ company: '', role: '', salary: '', deadline: '', logo: '', tags: '', description: '', type: 'Frontend' });
    fetchJobs(); // refresh the list
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Opportunities</h1>
          <p className="text-gray-500 font-medium text-[15px]">Find and apply to the latest internships and full-time roles.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-4 sm:mt-0 flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
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
            <OpportunityCard key={job._id || job.id} {...job} />
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold bg-white text-gray-900">Add New Opportunity</h2>
              <button title="close modal" aria-label="close modal" onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 bg-transparent border-0 cursor-pointer p-0 m-0 w-auto text-xl"><X className="w-6 h-6 border rounded" /></button>
            </div>
            
            <form onSubmit={handleAddJob} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Company" className="bg-transparent text-black border p-2 rounded w-full border-gray-300" 
                  value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} />
                <input required placeholder="Role (e.g. Developer)" className="bg-transparent text-black border p-2 rounded w-full border-gray-300" 
                  value={newJob.role} onChange={e => setNewJob({...newJob, role: e.target.value})} />
                <input placeholder="Salary (e.g. 15 LPA)" className="bg-transparent text-black border p-2 rounded w-full border-gray-300" 
                  value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} />
                <input placeholder="Deadline" className="bg-transparent text-black border p-2 rounded w-full border-gray-300" 
                  value={newJob.deadline} onChange={e => setNewJob({...newJob, deadline: e.target.value})} />
              </div>
              <input placeholder="Logo Image URL" className="bg-transparent text-black border p-2 rounded w-full border-gray-300" 
                  value={newJob.logo} onChange={e => setNewJob({...newJob, logo: e.target.value})} />
              <input placeholder="Tags (comma separated e.g. Remote, Eligible)" className="bg-transparent text-black border p-2 rounded w-full border-gray-300" 
                  value={newJob.tags} onChange={e => setNewJob({...newJob, tags: e.target.value})} />
              <textarea placeholder="Description" rows="3" className="bg-transparent text-black border p-2 rounded w-full border-gray-300" 
                  value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})}></textarea>
              
              <select className="border p-2 rounded w-full border-gray-300 text-black bg-transparent" 
                  value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})}>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Data Analyst">Data Analyst</option>
              </select>

              <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded shadow hover:bg-blue-700">
                Submit Opportunity
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Opportunities;
