import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { DashboardController } from '../../controllers/dashboardController';
import { ArrowLeft, Save, Briefcase, IndianRupee, GraduationCap, Code2, FileText, CheckCircle, FolderOpen, Lightbulb, Users, Settings, Plus, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const FormContext = React.createContext(null);

const InputField = ({ label, name, type="text", placeholder, helperText, required=false }) => {
  const { formData, handleInputChange } = React.useContext(FormContext);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
      {type === 'textarea' ? (
        <textarea name={name} value={formData[name] || ''} onChange={handleInputChange} placeholder={placeholder} required={required} className="p-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-y min-h-[100px] text-gray-900" />
      ) : (
        <input type={type} name={name} value={formData[name] || ''} onChange={handleInputChange} placeholder={placeholder} required={required} className="p-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900" />
      )}
      {helperText && <p className="text-xs text-gray-500 mt-0.5">{helperText}</p>}
    </div>
  );
};

const SelectField = ({ label, name, options, helperText, required=false }) => {
  const { formData, handleInputChange } = React.useContext(FormContext);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
      <select name={name} value={formData[name] || ''} onChange={handleInputChange} required={required} className="p-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900">
        {options.map(opt => <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>)}
      </select>
      {helperText && <p className="text-xs text-gray-500 mt-0.5">{helperText}</p>}
    </div>
  );
};

const ToggleField = ({ label, name, helperText }) => {
  const { formData, handleInputChange } = React.useContext(FormContext);
  return (
    <div className="flex flex-col gap-1.5 justify-center">
      <label className="flex items-center gap-3 cursor-pointer">
        <div className="relative">
          <input type="checkbox" name={name} checked={!!formData[name]} onChange={handleInputChange} className="sr-only" />
          <div className={`block w-10 h-6 rounded-full transition-colors ${formData[name] ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData[name] ? 'transform translate-x-4' : ''}`}></div>
        </div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </label>
      {helperText && <p className="text-xs text-gray-500 ml-13">{helperText}</p>}
    </div>
  );
};

const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
        <Icon className="w-5 h-5" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

const CreateOpportunity = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    // Basic Info
    company: '', logo: '', title: '', role: '', opportunityType: 'Full-time', employmentMode: 'On-site', location: '', department: '', eligibleBatch: '', deadline: '', tentativeJoiningDate: '', internshipDuration: '',
    
    // Compensation
    stipend: '', salary: '', basePay: '', variablePay: '', ppoAvailable: false, ppoCriteria: '', bondRequired: false, bondDuration: '', benefits: '',

    // Eligibility
    eligibleDegrees: '', eligibleBranches: '', minCGPA: '', maxBacklogs: '', tenthPercent: '', twelfthPercent: '', semesterEligibility: '', gapYearRestrictions: '', previousOfferRestrictions: '', previousApplicationRestrictions: '',

    // Skills
    requiredSkills: '', preferredSkills: '', programmingLanguages: '', toolsPlatforms: '', domainFocus: '', assessmentAreas: '',

    // Description
    shortSummary: '', description: '', responsibilities: '', teamContext: '',

    // Process
    selectionRounds: [{ name: '', description: '', assessmentType: '' }],
    processTimeline: '',

    // Documents
    requiredDocuments: '', customQuestions: '',

    // Prep
    importantTopics: '', dsaFocus: '', coreSubjectsFocus: '', aptitudeFocus: '', topTips: '', experienceLinks: '',

    // Coordination
    coordinatorAssigned: '', hrMobileNumber: '', venue: '', reportingInstructions: '', contactPerson: '',

    // Visibility
    isDraft: false, isFeatured: false, visibilityRule: 'All', autoLockForIneligible: true, status: 'Open'
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoundChange = (index, field, value) => {
    const newRounds = [...formData.selectionRounds];
    newRounds[index][field] = value;
    setFormData(prev => ({ ...prev, selectionRounds: newRounds }));
  };

  const addRound = () => {
    setFormData(prev => ({
      ...prev,
      selectionRounds: [...prev.selectionRounds, { name: '', description: '', assessmentType: '' }]
    }));
  };

  const removeRound = (index) => {
    const newRounds = [...formData.selectionRounds];
    newRounds.splice(index, 1);
    setFormData(prev => ({ ...prev, selectionRounds: newRounds }));
  };
  const fillDummyData = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const deadlineStr = tomorrow.toISOString().split('T')[0];

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 2);
    const joiningDateStr = nextMonth.toISOString().split('T')[0];

    setFormData({
      company: 'Google', 
      logo: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png', 
      title: 'Graduate Software Engineer', 
      role: 'SDE-1', 
      opportunityType: 'Full-time', 
      employmentMode: 'On-site', 
      location: 'Bengaluru / Hyderabad', 
      department: 'Cloud Platform', 
      eligibleBatch: '2024, 2025', 
      deadline: deadlineStr, 
      tentativeJoiningDate: joiningDateStr, 
      internshipDuration: '6 Months',
      
      stipend: '1,20,000', 
      salary: '32,00,000', 
      basePay: '18,50,000', 
      variablePay: '5,00,000', 
      ppoAvailable: true, 
      ppoCriteria: 'Performance based on internship completion', 
      bondRequired: false, 
      bondDuration: '', 
      benefits: 'Health Insurance, Free Meals, ESPP, Relocation Bonus',

      eligibleDegrees: 'B.Tech, M.Tech, MCA', 
      eligibleBranches: 'CS, IT, ECE, EEE', 
      minCGPA: '7.5', 
      maxBacklogs: '0', 
      tenthPercent: '75', 
      twelfthPercent: '75', 
      semesterEligibility: '7, 8', 
      gapYearRestrictions: 'Max 1 year allowed', 
      previousOfferRestrictions: 'None', 
      previousApplicationRestrictions: '6 months cool-off',

      requiredSkills: 'Data Structures, Algorithms, Problem Solving, Java/C++', 
      preferredSkills: 'Cloud Computing, Distributed Systems, React.js', 
      programmingLanguages: 'C++, Java, Python, JavaScript', 
      toolsPlatforms: 'Google Cloud, Git, VS Code, Docker', 
      domainFocus: 'Systems Engineering', 
      assessmentAreas: 'Coding, System Design, Behavioral',

      shortSummary: 'Join Google as a Graduate Software Engineer to solve complex technical problems and impact millions of users.', 
      description: 'As a Software Engineer at Google, you will work on the next generation of technologies that will change how billions of users connect, explore, and do business.', 
      responsibilities: 'Design, develop, test, deploy, maintain and improve software. Manage individual project priorities, deadlines and deliverables.', 
      teamContext: 'You will be part of the Google Cloud Infrastructure team.',

      selectionRounds: [
        { name: 'Online Assessment', description: '2 Coding questions on DSA', assessmentType: 'Coding' },
        { name: 'Technical Round 1', description: 'Data Structures & Algorithms interview', assessmentType: 'Interview' },
        { name: 'Technical Round 2', description: 'System Design & Problem Solving', assessmentType: 'Interview' },
        { name: 'HR Round', description: 'Googleyness & Leadership', assessmentType: 'Interview' }
      ],
      processTimeline: '2-3 Weeks after deadline',

      requiredDocuments: 'CV, Transcripts, Graduation Certificates', 
      customQuestions: 'Why Google?, Tell us about a challenging project you worked on.',

      importantTopics: 'Graphs, Dynamic Programming, Os, Networking', 
      dsaFocus: 'Recursion, Trees, Hashing', 
      coreSubjectsFocus: 'Operating Systems, Database Management', 
      aptitudeFocus: 'Logical Reasoning, Quantitative Analysis', 
      topTips: 'Focus on clean code and algorithmic complexity. Practice LeetCode medium/hard questions.', 
      experienceLinks: 'https://leetcode.com/discuss/interview-experience?company=Google',

      coordinatorAssigned: '', 
      hrMobileNumber: '+91 9876543210', 
      venue: 'Google Bengaluru North Office', 
      reportingInstructions: 'Please carry your physical ID proof and a copy of your CV.', 
      contactPerson: 'Aditi Sharma (Campus Recruiting Manager)',

      isDraft: false, 
      isFeatured: true, 
      visibilityRule: 'All', 
      autoLockForIneligible: true, 
      status: 'Open'
    });

    showToast("Form filled with demo data!", "info");
  };

  const processArrayFields = (data) => {
    const arrayFields = [
      'eligibleBatch', 'eligibleDegrees', 'eligibleBranches', 'semesterEligibility', 
      'requiredSkills', 'preferredSkills', 'programmingLanguages', 'toolsPlatforms', 
      'assessmentAreas', 'requiredDocuments', 'customQuestions', 'importantTopics', 
      'dsaFocus', 'coreSubjectsFocus', 'aptitudeFocus', 'topTips', 'experienceLinks'
    ];
    
    const processed = { ...data };
    arrayFields.forEach(field => {
      if (typeof processed[field] === 'string' && processed[field].trim()) {
        processed[field] = processed[field].split(',').map(s => s.trim()).filter(s => s);
      } else if (!processed[field]) {
        processed[field] = [];
      }
    });

    // Remove string field that backend doesn't expect in this format to prevent casting errors
    if (!processed.coordinatorAssigned || typeof processed.coordinatorAssigned === 'string') {
        delete processed.coordinatorAssigned;
    }
    
    // Remove empty strings for number and date fields
    const optionalFields = ['minCGPA', 'maxBacklogs', 'tenthPercent', 'twelfthPercent', 'deadline', 'tentativeJoiningDate'];
    optionalFields.forEach(f => {
      if (processed[f] === '') delete processed[f];
    });

    return processed;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = processArrayFields(formData);
      const result = await DashboardController.createOpportunity(payload);
      
      if (result) {
        showToast("Opportunity created successfully!", "success");
        navigate('/admin/opportunities');
      } else {
        showToast("Failed to create opportunity. Please check your network.", "error");
      }
    } catch (error) {
      console.error("Failed to create", error);
      showToast("An error occurred. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContext.Provider value={{ formData, handleInputChange }}>
      <Layout>
      <div className="max-w-5xl mx-auto pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all active:scale-95 shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create Opportunity</h1>
            <p className="text-sm font-medium text-gray-500 mt-1">Design a new recruitment drive with full parameters.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            type="button" 
            onClick={fillDummyData}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-100 transition-all active:scale-95"
          >
            <Lightbulb size={16} /> Auto-fill Demo
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-gray-900/10 hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : (
              <>
                <Save size={16} /> Save Opportunity
              </>
            )}
          </button>
        </div>
      </div>

        <form onSubmit={handleSubmit}>
          
          {/* Section 1: Basic Information */}
          <Section title="Basic Information" icon={Briefcase}>
            <InputField label="Company Name" name="company" required placeholder="e.g. Google, Microsoft" />
            <InputField label="Company Logo URL" name="logo" placeholder="https://.../logo.png" />
            <InputField label="Posting Title" name="title" required placeholder="e.g. Software Engineering Intern 2024" />
            <InputField label="Role Name" name="role" required placeholder="e.g. SDE Intern" />
            <SelectField label="Opportunity Type" name="opportunityType" required options={['Full-time', 'Internship', 'Internship + PPO', 'Part-time', 'Contract']} />
            <SelectField label="Employment Mode" name="employmentMode" required options={['On-site', 'Remote', 'Hybrid']} />
            <InputField label="Locations" name="location" placeholder="e.g. Bangalore, Hyderabad (Comma separated)" />
            <InputField label="Department / Team" name="department" placeholder="e.g. Cloud Infrastructure" />
            <InputField label="Eligible Batches" name="eligibleBatch" placeholder="e.g. 2024, 2025" helperText="Comma-separated graduation years" />
            <InputField label="Application Deadline" name="deadline" type="date" />
            <InputField label="Tentative Joining Date" name="tentativeJoiningDate" type="date" />
            <InputField label="Internship Duration" name="internshipDuration" placeholder="e.g. 6 Months" />
          </Section>

          {/* Section 2: Compensation Details */}
          <Section title="Compensation Details" icon={IndianRupee}>
            <InputField label="Internship Stipend" name="stipend" placeholder="e.g. 50k / month" />
            <InputField label="Total Salary / CTC" name="salary" placeholder="e.g. 15 LPA" />
            <InputField label="Base Pay" name="basePay" placeholder="e.g. 12 LPA" />
            <InputField label="Bonus / Variable Pay" name="variablePay" placeholder="e.g. 3 LPA" />
            
            <ToggleField label="PPO Available" name="ppoAvailable" helperText="Is there a chance for a Pre-Placement Offer?" />
            <InputField label="PPO Criteria" name="ppoCriteria" placeholder="e.g. Based on performance" />
            
            <ToggleField label="Bond Required" name="bondRequired" helperText="Does the student need to sign a bond?" />
            <InputField label="Bond Duration" name="bondDuration" placeholder="e.g. 1 Year" />
            <div className="md:col-span-2">
              <InputField label="Benefits / Perks" name="benefits" type="textarea" placeholder="e.g. Relocation assistance, free food..." />
            </div>
          </Section>

          {/* Section 3: Eligibility Criteria */}
          <Section title="Eligibility Criteria" icon={GraduationCap}>
            <InputField label="Eligible Degrees" name="eligibleDegrees" placeholder="e.g. B.Tech, M.Tech" helperText="Comma separated" />
            <InputField label="Eligible Branches" name="eligibleBranches" placeholder="e.g. CSE, IT, ECE" helperText="Comma separated" />
            <InputField label="Minimum CGPA" name="minCGPA" type="number" placeholder="e.g. 7.5" />
            <InputField label="Maximum Backlogs Allowed" name="maxBacklogs" type="number" placeholder="e.g. 0" />
            <InputField label="10th Percentage Criteria" name="tenthPercent" type="number" placeholder="e.g. 75" />
            <InputField label="12th / Diploma Criteria" name="twelfthPercent" type="number" placeholder="e.g. 75" />
            <InputField label="Current Semester" name="semesterEligibility" placeholder="e.g. 6, 7, 8" helperText="Comma separated" />
            <InputField label="Gap Year Restrictions" name="gapYearRestrictions" placeholder="e.g. Max 1 year allowed" />
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Previous Offer Restrictions" name="previousOfferRestrictions" placeholder="e.g. Placed students cannot apply" />
              <InputField label="Previous Application Restrictions" name="previousApplicationRestrictions" placeholder="e.g. Cannot reapply within 6 months" />
            </div>
          </Section>

          {/* Section 4: Skill Requirements */}
          <Section title="Skill Requirements" icon={Code2}>
            <div className="md:col-span-2">
              <InputField label="Required Skills" name="requiredSkills" placeholder="e.g. React, Node.js, System Design" helperText="Comma separated. Used for skill gap analysis." />
            </div>
            <div className="md:col-span-2">
              <InputField label="Preferred Skills" name="preferredSkills" placeholder="e.g. AWS, Docker" helperText="Comma separated." />
            </div>
            <InputField label="Programming Languages" name="programmingLanguages" placeholder="e.g. C++, Java, Python" />
            <InputField label="Tools / Platforms" name="toolsPlatforms" placeholder="e.g. Git, Unix, Figma" />
            <InputField label="Domain Focus" name="domainFocus" placeholder="e.g. Web Development, Core Engineering" />
            <InputField label="Technical Assessment Areas" name="assessmentAreas" placeholder="e.g. DSA, OS, DBMS" helperText="Comma separated." />
          </Section>

          {/* Section 5: Role Description */}
          <Section title="Company / Role Overview" icon={FileText}>
            <div className="md:col-span-2">
              <InputField label="Short Summary" name="shortSummary" type="textarea" placeholder="A brief one-paragraph overview of the role..." />
            </div>
            <div className="md:col-span-2">
              <InputField label="Full Job Description" name="description" type="textarea" placeholder="Detailed description of what the role entails..." />
            </div>
            <div className="md:col-span-2">
              <InputField label="Key Responsibilities" name="responsibilities" type="textarea" placeholder="What will the student be doing day-to-day?" />
            </div>
            <InputField label="Team / Department Context" name="teamContext" placeholder="e.g. Working with the Frontend Core Team" />
          </Section>

          {/* Section 6: Selection Process */}
          <Section title="Selection Process" icon={CheckCircle}>
            <div className="md:col-span-2">
              <InputField label="Overall Process Timeline" name="processTimeline" placeholder="e.g. Starts May 10, Ends May 15" />
            </div>
            <div className="md:col-span-2 space-y-4">
              <label className="text-sm font-medium text-gray-700 block">Rounds Overview</label>
              {formData.selectionRounds.map((round, idx) => (
                <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-xl relative group">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-gray-500">Round Name</label>
                      <input value={round.name} onChange={(e) => handleRoundChange(idx, 'name', e.target.value)} placeholder="e.g. Online Assessment" className="p-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-gray-500">Assessment Type</label>
                      <select value={round.assessmentType} onChange={(e) => handleRoundChange(idx, 'assessmentType', e.target.value)} className="p-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                        <option value="">Select...</option>
                        <option value="Aptitude Test">Aptitude Test</option>
                        <option value="Coding Test">Coding Test</option>
                        <option value="Technical Interview">Technical Interview</option>
                        <option value="HR Interview">HR Interview</option>
                        <option value="Group Discussion">Group Discussion</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-xs text-gray-500">Round Description</label>
                      <input value={round.description} onChange={(e) => handleRoundChange(idx, 'description', e.target.value)} placeholder="e.g. 3 coding questions, 90 mins" className="p-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                  </div>
                  {formData.selectionRounds.length > 1 && (
                    <button type="button" onClick={() => removeRound(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addRound} className="flex items-center text-sm text-blue-600 font-medium hover:text-blue-700">
                <Plus className="w-4 h-4 mr-1" /> Add Round
              </button>
            </div>
          </Section>

          {/* Section 7: Documents Required */}
          <Section title="Documents Required" icon={FolderOpen}>
            <div className="md:col-span-2">
              <InputField label="Required Documents" name="requiredDocuments" placeholder="e.g. Resume, Transcript, Cover Letter" helperText="Comma separated" />
            </div>
            <div className="md:col-span-2">
              <InputField label="Custom Registration Questions" name="customQuestions" type="textarea" placeholder="e.g. Why do you want to join this company?, Provide your GitHub link." helperText="Comma separated or new line separated" />
            </div>
          </Section>

          {/* Section 8: Preparation Guidance */}
          <Section title="Preparation Guidance" icon={Lightbulb}>
            <InputField label="Important Topics" name="importantTopics" placeholder="e.g. Graphs, Dynamic Programming" />
            <InputField label="DSA Focus Areas" name="dsaFocus" placeholder="e.g. Trees, Matrices" />
            <InputField label="Core Subjects Focus" name="coreSubjectsFocus" placeholder="e.g. OS Memory Management, SQL" />
            <InputField label="Aptitude Focus" name="aptitudeFocus" placeholder="e.g. Quantitative, Logical" />
            <div className="md:col-span-2">
              <InputField label="Top Preparation Tips" name="topTips" type="textarea" placeholder="Write advice from seniors or recruiters..." />
            </div>
            <InputField label="Senior / Alumni Experience Links" name="experienceLinks" placeholder="Links to blogs or internal docs" />
          </Section>

          {/* Section 9: Coordination / Logistics */}
          <Section title="Coordination / Logistics" icon={Users}>
            <InputField label="Coordinator Assigned" name="coordinatorAssigned" placeholder="e.g. John Doe" />
            <InputField label="Contact Person (Company)" name="contactPerson" placeholder="e.g. HR Manager Name" />
            <InputField label="HR Mobile Number" name="hrMobileNumber" placeholder="e.g. +91 9876543210" />
            <InputField label="Venue / Room" name="venue" placeholder="e.g. Seminar Hall 1 / Online" />
            <div className="md:col-span-2">
              <InputField label="Reporting Instructions" name="reportingInstructions" type="textarea" placeholder="e.g. Bring hard copy of resume and ID card" />
            </div>
          </Section>

          {/* Section 10: Visibility / Admin Controls */}
          <Section title="Visibility & Admin Controls" icon={Settings}>
            <ToggleField label="Save as Draft" name="isDraft" helperText="Keep hidden until finalized." />
            <ToggleField label="Featured Job" name="isFeatured" helperText="Show prominently on student dashboard." />
            
            <SelectField label="Visibility Rule" name="visibilityRule" options={[
              { label: 'All Students', value: 'All' },
              { label: 'Only Eligible Students', value: 'EligibleOnly' },
              { label: 'Partially Ready / Eligible', value: 'PartiallyReady' }
            ]} helperText="Who can view this posting?" />
            
            <ToggleField label="Auto-lock Apply Button" name="autoLockForIneligible" helperText="Disable apply button if student is ineligible." />
            
            <SelectField label="Posting Status" name="status" options={['Open', 'Ongoing', 'Completed', 'Closed']} />
          </Section>

          {/* Sticky Actions */}
          <div className="sticky bottom-0 z-50 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 -mx-6 flex items-center justify-between px-6 rounded-b-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <p className="text-sm text-gray-500">Please review all fields before publishing.</p>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => navigate('/admin/opportunities')} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium transition-all">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="flex items-center px-6 py-2.5 rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-sm transition-all disabled:opacity-50">
                {isSubmitting ? (
                  <span className="flex items-center"><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Publishing...</span>
                ) : (
                  <><Save className="w-5 h-5 mr-2" /> Publish Opportunity</>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </Layout>
    </FormContext.Provider>
  );
};

export default CreateOpportunity;
