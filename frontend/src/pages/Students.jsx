import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { DashboardController } from '../controllers/dashboardController';
import { Search, Filter, Mail, MoreVertical } from 'lucide-react';
import clsx from 'clsx';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    DashboardController.getStudents().then(setStudents);
  }, []);

  const statuses = ['All', 'Placed', 'Not Placed'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = activeFilter === 'All' || student.status === activeFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    return status === 'Placed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200';
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Registered Students</h1>
        <p className="text-gray-500 font-medium text-[15px]">Manage and track all students actively participating in the placement drive.</p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex w-full md:w-96 bg-gray-50 items-center px-4 py-2.5 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search by name, email, or course..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder-gray-400"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-gray-400 mr-1" />
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                activeFilter === status 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Student Name</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center"><Mail className="w-3.5 h-3.5 mr-1" /> Email</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Course / Branch</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Year</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Status</th>
                <th className="py-4 px-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">No students match your criteria.</td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="py-4 px-6">
                      <span className="text-sm font-bold text-gray-900">{student.name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">{student.email}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-semibold text-gray-600">{student.course}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-500 font-medium">{student.year}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={clsx("inline-flex items-center px-2.5 py-1 rounded-md border text-[11px] font-bold shadow-sm", getStatusColor(student.status))}>
                        {student.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                       <button className="p-1.5 text-gray-400 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"><MoreVertical className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Students;
