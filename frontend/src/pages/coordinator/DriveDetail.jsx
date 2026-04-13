import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Briefcase, MapPin, Users, Calendar, Clock, IndianRupee,
  CheckCircle, ExternalLink, Activity, GraduationCap, Code2, FileText,
  AlertCircle, Loader2, RefreshCw
} from 'lucide-react';
import { fetchCoordinatorApplicationsApi } from '../../services/api';
import API from '../../services/api';
import clsx from 'clsx';

const Badge = ({ children, color = 'gray' }) => {
  const colors = {
    green:  'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue:   'bg-blue-50 text-blue-700 border-blue-200',
    red:    'bg-red-50 text-red-600 border-red-200',
    amber:  'bg-amber-50 text-amber-700 border-amber-200',
    gray:   'bg-gray-100 text-gray-600 border-gray-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };
  return (
    <span className={clsx('px-2.5 py-1 rounded-lg text-[11px] font-bold border uppercase tracking-wide', colors[color] || colors.gray)}>
      {children}
    </span>
  );
};

const statusColor = (s) => {
  if (s === 'Open') return 'green';
  if (s === 'Ongoing') return 'blue';
  if (s === 'Completed') return 'gray';
  if (s === 'Closed') return 'red';
  return 'amber';
};

const appStatusColor = (s) => {
  if (s === 'Selected') return 'green';
  if (s === 'Interview Scheduled') return 'blue';
  if (s === 'Rejected') return 'red';
  if (s === 'Applied') return 'amber';
  return 'gray';
};

export default function DriveDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [drive, setDrive] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingDrive, setLoadingDrive] = useState(true);
  const [loadingApps, setLoadingApps] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const coordinatorId = localStorage.getItem('userId');

  // Fetch drive details
  useEffect(() => {
    const fetchDrive = async () => {
      try {
        const { data } = await API.get(`/jobs/${id}`);
        setDrive(data);
      } catch (err) {
        setError('Failed to load drive details.');
      } finally {
        setLoadingDrive(false);
      }
    };
    fetchDrive();
  }, [id]);

  // Fetch applicants for this specific drive
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const { data } = await fetchCoordinatorApplicationsApi(coordinatorId);
        // Filter to only this drive's applicants
        const driveApps = Array.isArray(data)
          ? data.filter(a => {
              const jobId = a.jobId?._id || a.jobId;
              return String(jobId) === String(id);
            })
          : [];
        setApplications(driveApps);
      } catch (err) {
        console.error('Failed to load applicants', err);
      } finally {
        setLoadingApps(false);
      }
    };
    if (coordinatorId) fetchApps();
    else setLoadingApps(false);
  }, [id, coordinatorId]);

  if (loadingDrive) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || !drive) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-gray-500 font-medium">{error || 'Drive not found.'}</p>
        <button onClick={() => navigate(-1)} className="text-indigo-600 font-semibold text-sm hover:underline">
          ← Go back
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'applicants', label: `Applicants (${applications.length})` },
    { id: 'eligibility', label: 'Eligibility' },
    { id: 'process', label: 'Process' },
  ];

  const InfoRow = ({ icon: Icon, label, value }) => value ? (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-800 break-words">{value}</p>
      </div>
    </div>
  ) : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl">

      {/* Back + Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate(-1)}
          className="mt-1 p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {drive.logo && (
              <img src={drive.logo} alt={drive.company} className="w-8 h-8 object-contain" />
            )}
            <h1 className="text-2xl font-bold text-gray-900">{drive.company}</h1>
            <Badge color={statusColor(drive.status)}>{drive.status}</Badge>
            {drive.opportunityType && <Badge color="indigo">{drive.opportunityType}</Badge>}
          </div>
          <p className="text-gray-500 text-sm font-medium">{drive.role || drive.title}</p>
          {drive.location && (
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {drive.location}
            </p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Applicants', value: loadingApps ? '...' : applications.length, icon: Users, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Stipend / CTC', value: drive.stipend || drive.salary || 'Competitive', icon: IndianRupee, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Deadline', value: drive.deadline ? new Date(drive.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBD', icon: Calendar, color: 'text-amber-600 bg-amber-50' },
          { label: 'Mode', value: drive.employmentMode || 'Not specified', icon: Activity, color: 'text-blue-600 bg-blue-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', color.split(' ')[1])}>
              <Icon className={clsx('w-5 h-5', color.split(' ')[0])} />
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold text-gray-900 truncate">{value}</p>
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'px-5 py-4 text-sm font-semibold whitespace-nowrap transition-colors',
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Job Details</h3>
                <div className="divide-y divide-gray-50">
                  <InfoRow icon={Briefcase} label="Title" value={drive.title} />
                  <InfoRow icon={Briefcase} label="Role" value={drive.role} />
                  <InfoRow icon={MapPin} label="Location" value={drive.location} />
                  <InfoRow icon={Activity} label="Employment Mode" value={drive.employmentMode} />
                  <InfoRow icon={Clock} label="Eligible Batch" value={Array.isArray(drive.eligibleBatch) ? drive.eligibleBatch.join(', ') : drive.eligibleBatch} />
                  <InfoRow icon={Calendar} label="Application Deadline" value={drive.deadline ? new Date(drive.deadline).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : null} />
                  <InfoRow icon={Calendar} label="Tentative Joining" value={drive.tentativeJoiningDate ? new Date(drive.tentativeJoiningDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null} />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Compensation</h3>
                <div className="divide-y divide-gray-50">
                  <InfoRow icon={IndianRupee} label="Stipend" value={drive.stipend} />
                  <InfoRow icon={IndianRupee} label="CTC / Salary" value={drive.salary} />
                  <InfoRow icon={IndianRupee} label="Base Pay" value={drive.basePay} />
                  <InfoRow icon={IndianRupee} label="Variable Pay" value={drive.variablePay} />
                  <InfoRow icon={CheckCircle} label="PPO Available" value={drive.ppoAvailable ? `Yes${drive.ppoCriteria ? ` — ${drive.ppoCriteria}` : ''}` : 'No'} />
                  <InfoRow icon={FileText} label="Bond" value={drive.bondRequired ? `Yes${drive.bondDuration ? ` — ${drive.bondDuration}` : ''}` : 'No'} />
                  <InfoRow icon={Activity} label="Benefits" value={drive.benefits} />
                </div>
                {drive.description && (
                  <div className="mt-6">
                    <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Description</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{drive.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* APPLICANTS TAB */}
          {activeTab === 'applicants' && (
            <div>
              {loadingApps ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 font-semibold">No applicants yet for this drive.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Student</th>
                        <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Enrollment</th>
                        <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Branch</th>
                        <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">CGPA</th>
                        <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Applied</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {applications.map(app => {
                        const student = typeof app.studentId === 'object' ? app.studentId : {};
                        return (
                          <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4">
                              <p className="font-semibold text-gray-900 text-sm">{student.fullName || student.name || app.studentName || '—'}</p>
                              <p className="text-xs text-gray-400">{student.personalEmail || student.email || ''}</p>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">{student.enrollmentNumber || '—'}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{student.branch || '—'}</td>
                            <td className="py-3 px-4 text-sm font-semibold text-gray-800">{student.cgpa || '—'}</td>
                            <td className="py-3 px-4">
                              <Badge color={appStatusColor(app.status)}>{app.status}</Badge>
                            </td>
                            <td className="py-3 px-4 text-xs text-gray-400">
                              {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ELIGIBILITY TAB */}
          {activeTab === 'eligibility' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Academic Criteria</h3>
                <div className="divide-y divide-gray-50">
                  <InfoRow icon={GraduationCap} label="Eligible Degrees" value={Array.isArray(drive.eligibleDegrees) ? drive.eligibleDegrees.join(', ') : drive.eligibleDegrees} />
                  <InfoRow icon={GraduationCap} label="Eligible Branches" value={Array.isArray(drive.eligibleBranches) ? drive.eligibleBranches.join(', ') : drive.eligibleBranches} />
                  <InfoRow icon={Activity} label="Min CGPA" value={drive.minCGPA ? `${drive.minCGPA}+` : null} />
                  <InfoRow icon={AlertCircle} label="Max Backlogs" value={drive.maxBacklogs !== undefined ? String(drive.maxBacklogs) : null} />
                  <InfoRow icon={Activity} label="10th Percentage" value={drive.tenthPercent ? `${drive.tenthPercent}%+` : null} />
                  <InfoRow icon={Activity} label="12th Percentage" value={drive.twelfthPercent ? `${drive.twelfthPercent}%+` : null} />
                  <InfoRow icon={Clock} label="Semester Eligibility" value={Array.isArray(drive.semesterEligibility) ? drive.semesterEligibility.join(', ') : drive.semesterEligibility} />
                  <InfoRow icon={AlertCircle} label="Gap Year Restrictions" value={drive.gapYearRestrictions} />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Skills Required</h3>
                <div className="divide-y divide-gray-50">
                  <InfoRow icon={Code2} label="Required Skills" value={Array.isArray(drive.requiredSkills) ? drive.requiredSkills.join(', ') : drive.requiredSkills} />
                  <InfoRow icon={Code2} label="Preferred Skills" value={Array.isArray(drive.preferredSkills) ? drive.preferredSkills.join(', ') : drive.preferredSkills} />
                  <InfoRow icon={Code2} label="Programming Languages" value={Array.isArray(drive.programmingLanguages) ? drive.programmingLanguages.join(', ') : drive.programmingLanguages} />
                  <InfoRow icon={Code2} label="Tools / Platforms" value={Array.isArray(drive.toolsPlatforms) ? drive.toolsPlatforms.join(', ') : drive.toolsPlatforms} />
                  <InfoRow icon={Activity} label="Domain Focus" value={drive.domainFocus} />
                </div>
              </div>
            </div>
          )}

          {/* PROCESS TAB */}
          {activeTab === 'process' && (
            <div className="space-y-6">
              {Array.isArray(drive.selectionRounds) && drive.selectionRounds.length > 0 ? (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Selection Rounds</h3>
                  <div className="space-y-3">
                    {drive.selectionRounds.map((round, idx) => (
                      <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{round.name || `Round ${idx + 1}`}</p>
                          {round.assessmentType && <p className="text-xs text-indigo-600 font-semibold mt-0.5">{round.assessmentType}</p>}
                          {round.description && <p className="text-xs text-gray-500 mt-1">{round.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No selection rounds defined.</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoRow icon={Clock} label="Process Timeline" value={drive.processTimeline} />
                <InfoRow icon={MapPin} label="Venue" value={drive.venue} />
                <InfoRow icon={FileText} label="Reporting Instructions" value={drive.reportingInstructions} />
                <InfoRow icon={Users} label="Contact Person" value={drive.contactPerson} />
              </div>
              {drive.importantTopics && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Important Topics</h3>
                  <p className="text-sm text-gray-600">{Array.isArray(drive.importantTopics) ? drive.importantTopics.join(', ') : drive.importantTopics}</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
