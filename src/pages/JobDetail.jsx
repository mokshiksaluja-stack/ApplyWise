import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { DashboardController } from '../controllers/dashboardController';
import { ArrowLeft, Building2, MapPin, IndianRupee, Clock, CheckCircle } from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate network delay
    setTimeout(() => {
      DashboardController.getOpportunityById(id).then(data => {
        setJob(data);
        setLoading(false);
      });
    }, 300);
  }, [id]);

  const handleApply = async () => {
    const success = await DashboardController.applyToJob(id);
    if (success) {
      setJob({ ...job, applied: true });
      alert('Application submitted successfully!');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:underline">Return to Dashboard</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-4">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <img src={job.logo} alt={job.company} className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.role}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-600">
                    <span className="flex items-center"><Building2 className="w-4 h-4 mr-1.5 text-gray-400" /> {job.company}</span>
                    <span className="flex items-center"><IndianRupee className="w-4 h-4 mr-1.5 text-gray-400" /> {job.salary}</span>
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5 text-gray-400" /> {job.deadline || 'Rolling basis'}</span>
                  </div>
                  
                  {job.tags && job.tags.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      {job.tags.map((tag, i) => (
                        <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-green-50 text-green-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex px-2 md:px-0">
                <button 
                  onClick={handleApply}
                  disabled={job.applied}
                  className={`w-full md:w-auto px-8 py-3 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center justify-center ${
                    job.applied 
                      ? 'bg-green-50 text-green-600 border border-green-200 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                  }`}
                >
                  {job.applied ? (
                    <><CheckCircle className="w-4 h-4 mr-2" /> Applied</>
                  ) : (
                    'Apply Now'
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Job Description</h3>
            <div className="prose max-w-none text-gray-600 text-[15px] leading-relaxed">
              <p>{job.description}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetail;
