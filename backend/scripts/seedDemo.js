require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../models/User');
const Student = require('../models/Student');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const CoordinatorProfile = require('../models/CoordinatorProfile');
const CoordinatorActivityLog = require('../models/CoordinatorActivityLog');
const CoordinatorTask = require('../models/CoordinatorTask');
const Interview = require('../models/Interview');
const PrepResource = require('../models/PrepResource');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/applywise_db';
const BATCH_NAME = 'youtube_demo_1';
const DEMO_TAG = { isDemoData: true, demoBatch: BATCH_NAME };

const seedDemo = async () => {
  try {
    console.log('🔗 Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB.');

    console.log('🧹 Cleaning existing demo data...');
    const collections = [
      User, Student, Job, Application, Notification, 
      CoordinatorProfile, CoordinatorActivityLog, CoordinatorTask, 
      Interview, PrepResource
    ];
    for (const model of collections) {
      const delResult = await model.deleteMany(DEMO_TAG);
      if (delResult.deletedCount > 0) {
        console.log(`  Cleaned ${delResult.deletedCount} old records from ${model.modelName}`);
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('demo123', salt);

    console.log('🌱 [Seed] Creating Users...');

    // ── 1. Create Admins ─────────────────────────────────────────────────────
    const adminUser = await User.create({
      email: 'admin_demo@applywise.com', password: hashedPassword, role: 'admin', ...DEMO_TAG
    });

    // ── 2. Create 3 Coordinators ─────────────────────────────────────────────
    const coordUsersData = [
      { email: 'coord_amit@applywise.com', name: 'Amit Sharma', dept: 'Computer Science' },
      { email: 'coord_priya@applywise.com', name: 'Priya Patel', dept: 'Information Technology' },
      { email: 'coord_rohan@applywise.com', name: 'Rohan Das', dept: 'Electronics & Communication' }
    ];

    const coordUsers = [];
    const coordProfiles = [];

    for (const item of coordUsersData) {
      const user = await User.create({
        email: item.email, password: hashedPassword, role: 'coordinator', ...DEMO_TAG
      });
      coordUsers.push(user);

      const profile = await CoordinatorProfile.create({
        userId: user._id,
        name: item.name,
        department: item.dept,
        phoneNumber: `+91 998877${Math.floor(1000 + Math.random() * 9000)}`,
        stats: {
          tasksCompleted: 8 + Math.floor(Math.random() * 10),
          interviewsScheduled: 5 + Math.floor(Math.random() * 8),
          attendanceUpdates: 10 + Math.floor(Math.random() * 15),
          statusUpdates: 15 + Math.floor(Math.random() * 20),
          jobsManaged: 3,
          totalActions: 40 + Math.floor(Math.random() * 30)
        },
        ...DEMO_TAG
      });
      coordProfiles.push(profile);
    }
    console.log('[Seed] Users created: 1 Admin, 3 Coordinators');

    // ── 3. Create 12 Diverse Students ─────────────────────────────────────────
    const studentsData = [
      {
        email: 'student_demo@applywise.com', fullName: 'Student Demo', enrollmentNumber: 'DEMO-CS-2024-001',
        branch: 'Computer Science', degree: 'B.Tech', cgpa: 8.9, primaryDomain: 'Full Stack Development',
        primaryLanguage: 'JavaScript', skills: ['React', 'Node.js', 'MongoDB', 'Python', 'AWS']
      },
      {
        email: 'student_rahul@applywise.com', fullName: 'Rahul Verma', enrollmentNumber: 'DEMO-CS-2024-002',
        branch: 'Computer Science', degree: 'B.Tech', cgpa: 9.2, primaryDomain: 'Backend Development',
        primaryLanguage: 'Java', skills: ['Java', 'Spring Boot', 'MySQL', 'Docker', 'Redis']
      },
      {
        email: 'student_neha@applywise.com', fullName: 'Neha Singh', enrollmentNumber: 'DEMO-IT-2024-003',
        branch: 'Information Technology', degree: 'B.Tech', cgpa: 8.5, primaryDomain: 'Frontend Development',
        primaryLanguage: 'TypeScript', skills: ['React', 'TypeScript', 'TailwindCSS', 'Next.js', 'Figma']
      },
      {
        email: 'student_siddharth@applywise.com', fullName: 'Siddharth Gupta', enrollmentNumber: 'DEMO-EC-2024-004',
        branch: 'Electronics & Communication', degree: 'B.Tech', cgpa: 7.8, primaryDomain: 'Embedded Systems',
        primaryLanguage: 'C++', skills: ['C++', 'C', 'Arduino', 'Raspberry Pi', 'Linux']
      },
      {
        email: 'student_divya@applywise.com', fullName: 'Divya Joshi', enrollmentNumber: 'DEMO-CS-2024-005',
        branch: 'Computer Science', degree: 'M.Tech', cgpa: 9.6, primaryDomain: 'Data Science',
        primaryLanguage: 'Python', skills: ['Python', 'SQL', 'TensorFlow', 'Pandas', 'scikit-learn']
      },
      {
        email: 'student_vikram@applywise.com', fullName: 'Vikram Malhotra', enrollmentNumber: 'DEMO-EE-2024-006',
        branch: 'Electrical Engineering', degree: 'B.Tech', cgpa: 8.1, primaryDomain: 'Cloud Computing',
        primaryLanguage: 'Python', skills: ['AWS', 'Python', 'Linux', 'Terraform', 'Bash']
      },
      {
        email: 'student_ananya@applywise.com', fullName: 'Ananya Sen', enrollmentNumber: 'DEMO-CS-2024-007',
        branch: 'Computer Science', degree: 'B.Tech', cgpa: 8.7, primaryDomain: 'Mobile Development',
        primaryLanguage: 'Dart', skills: ['Flutter', 'Dart', 'Firebase', 'Git', 'iOS Dev']
      },
      {
        email: 'student_karan@applywise.com', fullName: 'Karan Mehta', enrollmentNumber: 'DEMO-IT-2024-008',
        branch: 'Information Technology', degree: 'MCA', cgpa: 7.2, primaryDomain: 'QA Automation',
        primaryLanguage: 'Java', skills: ['Java', 'Selenium', 'JUnit', 'Postman', 'SQL']
      },
      {
        email: 'student_sneha@applywise.com', fullName: 'Sneha Iyer', enrollmentNumber: 'DEMO-EC-2024-009',
        branch: 'Electronics & Communication', degree: 'B.Tech', cgpa: 8.3, primaryDomain: 'Core VLSI',
        primaryLanguage: 'Verilog', skills: ['Verilog', 'MATLAB', 'SystemVerilog', 'Digital Design']
      },
      {
        email: 'student_arjun@applywise.com', fullName: 'Arjun Kapoor', enrollmentNumber: 'DEMO-CS-2024-010',
        branch: 'Computer Science', degree: 'B.Tech', cgpa: 9.0, primaryDomain: 'DevOps',
        primaryLanguage: 'Go', skills: ['Docker', 'Kubernetes', 'Ansible', 'GitLab CI', 'Go']
      },
      {
        email: 'student_rhea@applywise.com', fullName: 'Rhea Nair', enrollmentNumber: 'DEMO-CS-2024-011',
        branch: 'Computer Science', degree: 'B.Tech', cgpa: 7.6, primaryDomain: 'Cyber Security',
        primaryLanguage: 'Python', skills: ['Linux', 'Wireshark', 'Metasploit', 'Nmap', 'Python']
      },
      {
        email: 'student_ayush@applywise.com', fullName: 'Ayush Saxena', enrollmentNumber: 'DEMO-IT-2024-012',
        branch: 'Information Technology', degree: 'B.Tech', cgpa: 8.8, primaryDomain: 'Full Stack Development',
        primaryLanguage: 'JavaScript', skills: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Figma']
      }
    ];

    const studentUsers = [];
    const studentProfiles = [];

    for (const item of studentsData) {
      const sUser = await User.create({
        email: item.email, password: hashedPassword, role: 'student', ...DEMO_TAG
      });
      studentUsers.push(sUser);

      const sProfile = await Student.create({
        _id: sUser._id,
        fullName: item.fullName,
        name: item.fullName,
        enrollmentNumber: item.enrollmentNumber,
        collegeEmail: item.email,
        email: item.email,
        personalEmail: `${item.fullName.toLowerCase().replace(' ', '_')}@gmail.com`,
        phone: `+91 98765${Math.floor(10000 + Math.random() * 90000)}`,
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        degree: item.degree,
        branch: item.branch,
        semester: '8',
        cgpa: item.cgpa,
        tenthPercentage: 80 + Math.floor(Math.random() * 18),
        twelfthPercentage: 75 + Math.floor(Math.random() * 20),
        backlogs: '0',
        academicStatus: 'Clear',
        primaryDomain: item.primaryDomain,
        primaryLanguage: item.primaryLanguage,
        overallSkillLevel: item.cgpa > 8.8 ? 'Advanced' : 'Intermediate',
        technicalSkills: item.skills,
        databaseFamiliarity: 'High',
        backendFamiliarity: 'High',
        communicationLevel: 'Excellent',
        problemSolvingLevel: 'High',
        codingPlatform: 'LeetCode',
        dsaLevel: item.cgpa > 8.5 ? 'Advanced' : 'Intermediate',
        preferredJobType: 'Full-time',
        preferredWorkMode: 'Hybrid',
        preferredLocation: 'Bengaluru',
        openToRelocation: 'Yes',
        expectedCompensation: '10 LPA+',
        availabilityStatus: 'Immediate',
        preferredCompanyType: 'Product-based',
        offCampusInterest: 'High',
        resumeLink: 'https://example.com/resume.pdf',
        resumeStatus: 'Verified',
        status: 'Not Placed',
        profileVisibility: 'Public',
        github: `https://github.com/${item.fullName.toLowerCase().replace(' ', '')}`,
        linkedIn: `https://linkedin.com/in/${item.fullName.toLowerCase().replace(' ', '')}`,
        ...DEMO_TAG
      });
      studentProfiles.push(sProfile);
    }
    console.log(`[Seed] Student profiles created: ${studentProfiles.length}`);

    // ── 4. Create 9 Realistic Jobs (8-10 Jobs) ──────────────────────────────
    console.log('🌱 [Seed] Creating Jobs...');
    const jobAuditDefaults = {
      createdBy: adminUser._id,
      createdByRole: 'admin',
      lastUpdatedById: adminUser._id,
      lastUpdatedByRole: 'admin',
      moduleSource: 'AdminPortal',
      ...DEMO_TAG
    };

    const jobsData = [
      {
        company: 'Google', title: 'Graduate Software Engineer', role: 'SDE-1', opportunityType: 'Full-time',
        location: 'Bengaluru, India', salary: '32 LPA', skills: ['React', 'Node.js', 'Python'], cgpa: 8.0,
        coordinator: coordUsers[0], coordName: 'Amit Sharma', status: 'Ongoing', mode: 'Hybrid'
      },
      {
        company: 'Microsoft', title: 'Software Engineer', role: 'SWE', opportunityType: 'Full-time',
        location: 'Hyderabad, India', salary: '28 LPA', skills: ['C++', 'Java', 'SQL', 'Docker'], cgpa: 8.0,
        coordinator: coordUsers[0], coordName: 'Amit Sharma', status: 'Ongoing', mode: 'On-site'
      },
      {
        company: 'JPMorgan Chase & Co.', title: 'Technology Analyst', role: 'Analyst', opportunityType: 'Full-time',
        location: 'Mumbai, India', salary: '16 LPA', skills: ['Java', 'Spring Boot', 'MySQL'], cgpa: 7.5,
        coordinator: coordUsers[1], coordName: 'Priya Patel', status: 'Ongoing', mode: 'On-site'
      },
      {
        company: 'Amazon', title: 'Backend Software Engineer', role: 'SDE-1', opportunityType: 'Full-time',
        location: 'Bengaluru, India', salary: '30 LPA', skills: ['Java', 'AWS', 'Docker', 'Redis'], cgpa: 8.0,
        coordinator: coordUsers[1], coordName: 'Priya Patel', status: 'Open', mode: 'Hybrid'
      },
      {
        company: 'Adobe', title: 'Frontend Developer', role: 'Frontend Engineer', opportunityType: 'Full-time',
        location: 'Noida, India', salary: '22 LPA', skills: ['React', 'TypeScript', 'TailwindCSS'], cgpa: 7.5,
        coordinator: coordUsers[2], coordName: 'Rohan Das', status: 'Open', mode: 'Hybrid'
      },
      {
        company: 'Morgan Stanley', title: 'Technology Analyst', role: 'Tech Analyst', opportunityType: 'Full-time',
        location: 'Bengaluru, India', salary: '20 LPA', skills: ['Java', 'Python', 'C++'], cgpa: 7.8,
        coordinator: coordUsers[2], coordName: 'Rohan Das', status: 'Open', mode: 'On-site'
      },
      {
        company: 'Stripe', title: 'Software Engineer', role: 'Frontend Engineer', opportunityType: 'Full-time',
        location: 'Remote', salary: '45 LPA', skills: ['React', 'TypeScript', 'JavaScript'], cgpa: 8.5,
        coordinator: coordUsers[0], coordName: 'Amit Sharma', status: 'Open', mode: 'Remote'
      },
      {
        company: 'Uber', title: 'Backend Systems Engineer', role: 'Backend Engineer', opportunityType: 'Full-time',
        location: 'Hyderabad, India', salary: '35 LPA', skills: ['Go', 'Kafka', 'Cassandra'], cgpa: 8.0,
        coordinator: coordUsers[1], coordName: 'Priya Patel', status: 'Closed', mode: 'Hybrid'
      },
      {
        company: 'Meta', title: 'Associate Product Manager', role: 'APM', opportunityType: 'Full-time',
        location: 'Gurugram, India', salary: '40 LPA', skills: ['Product', 'Data Analytics', 'SQL'], cgpa: 8.2,
        coordinator: coordUsers[0], coordName: 'Amit Sharma', status: 'Completed', mode: 'In-office'
      }
    ];

    const jobs = [];
    for (const item of jobsData) {
      const logoUrl = `https://logo.clearbit.com/${item.company.toLowerCase().replace(/[ &.]/g, '')}.com`;
      const newJob = await Job.create({
        company: item.company,
        logo: logoUrl,
        title: item.title,
        role: item.role,
        opportunityType: item.opportunityType,
        employmentMode: item.mode,
        location: item.location,
        eligibleBatch: ['2023', '2024', '2025'],
        deadline: new Date(Date.now() + 86400000 * 5),
        tentativeJoiningDate: new Date(Date.now() + 86400000 * 60),
        salary: item.salary,
        requiredSkills: item.skills,
        minCGPA: item.cgpa,
        maxBacklogs: 0,
        tenthPercent: 75,
        twelfthPercent: 75,
        eligibleDegrees: ['B.Tech', 'M.Tech', 'MCA'],
        eligibleBranches: ['Computer Science', 'Information Technology', 'Electronics & Communication'],
        assignedCoordinatorId: item.coordinator ? item.coordinator._id : null,
        assignedCoordinatorName: item.coordName,
        status: item.status,
        visibilityRule: 'All',
        shortSummary: `Exciting opportunity at ${item.company} to work as a ${item.title} and drive next-generation innovation.`,
        description: `Join the team at ${item.company} where you will collaborate with seasoned engineers to design, build, and test features that impact millions of users globally.`,
        responsibilities: `1. Write clean, testable, and robust code.\n2. Participate actively in design and code reviews.\n3. Troubleshoot and solve platform engineering issues.`,
        selectionRounds: [
          { name: 'Online Assessment', description: 'Coding assessment on DSA and Aptitude', assessmentType: 'Coding Test' },
          { name: 'Technical Round 1', description: 'Deep dive into data structures and problem solving', assessmentType: 'Technical Interview' },
          { name: 'HR Round', description: 'Cultural fit and behavioral assessment', assessmentType: 'HR Interview' }
        ],
        ...jobAuditDefaults
      });
      jobs.push(newJob);
    }
    console.log(`[Seed] Jobs created: ${jobs.length}`);

    // ── 5. Create 25 Interconnected Applications (20-30 Applications) ────────
    console.log('🌱 [Seed] Creating Applications...');
    const appAuditDefaults = {
      lastUpdatedByRole: 'coordinator',
      moduleSource: 'CoordinatorPortal',
      ...DEMO_TAG
    };

    const appStatuses = ['Applied', 'Shortlisted', 'Round 1 Cleared', 'Round 2 Cleared', 'Selected', 'Rejected'];
    const applications = [];

    // Map out specific student applications to make sure we hit varied status scenarios
    const specificApps = [
      // Amit Sharma CS Jobs (Google, Microsoft, Stripe, Meta)
      { student: studentProfiles[0], job: jobs[0], status: 'Shortlisted', round: 'Online Assessment', result: 'Cleared', coord: coordUsers[0] }, // Student Demo at Google
      { student: studentProfiles[0], job: jobs[1], status: 'Interview Scheduled', round: 'Technical Interview 1', result: 'Pending', coord: coordUsers[0] }, // Student Demo at Microsoft
      { student: studentProfiles[0], job: jobs[6], status: 'Applied', round: 'Resume Screening', result: 'Pending', coord: coordUsers[0] }, // Student Demo at Stripe
      
      { student: studentProfiles[1], job: jobs[0], status: 'Selected', round: 'HR Interview', result: 'Cleared', coord: coordUsers[0] }, // Rahul at Google
      { student: studentProfiles[1], job: jobs[1], status: 'Round 2 Cleared', round: 'Technical Round 2', result: 'Cleared', coord: coordUsers[0] }, // Rahul at Microsoft
      
      { student: studentProfiles[2], job: jobs[2], status: 'Shortlisted', round: 'Online Assessment', result: 'Cleared', coord: coordUsers[1] }, // Neha at JPMorgan
      { student: studentProfiles[2], job: jobs[4], status: 'Selected', round: 'HR Interview', result: 'Cleared', coord: coordUsers[2] }, // Neha at Adobe

      { student: studentProfiles[3], job: jobs[5], status: 'Rejected', round: 'Technical Round 1', result: 'Failed', coord: coordUsers[2] }, // Siddharth at Morgan Stanley
      { student: studentProfiles[4], job: jobs[3], status: 'Selected', round: 'HR Interview', result: 'Cleared', coord: coordUsers[1] }, // Divya at Amazon

      { student: studentProfiles[5], job: jobs[3], status: 'Round 1 Cleared', round: 'Coding Test', result: 'Cleared', coord: coordUsers[1] }, // Vikram at Amazon
      { student: studentProfiles[6], job: jobs[4], status: 'Applied', round: 'Resume Screening', result: 'Pending', coord: coordUsers[2] }, // Ananya at Adobe

      { student: studentProfiles[7], job: jobs[2], status: 'Rejected', round: 'Online Assessment', result: 'Failed', coord: coordUsers[1] }, // Karan at JPMorgan
      { student: studentProfiles[8], job: jobs[5], status: 'Applied', round: 'Resume Screening', result: 'Pending', coord: coordUsers[2] }, // Sneha at Morgan Stanley

      { student: studentProfiles[9], job: jobs[7], status: 'Selected', round: 'HR Interview', result: 'Cleared', coord: coordUsers[1] }, // Arjun at Uber
      { student: studentProfiles[10], job: jobs[0], status: 'Rejected', round: 'Resume Screening', result: 'Failed', coord: coordUsers[0] } // Rhea at Google
    ];

    // Seed specific apps first
    for (const app of specificApps) {
      const interviewDateStr = app.status === 'Interview Scheduled' 
        ? new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
        : null;

      const newApp = await Application.create({
        studentId: app.student._id,
        jobId: app.job._id,
        studentName: app.student.fullName,
        company: app.job.company,
        role: app.job.role,
        logo: app.job.logo,
        status: app.status,
        attendance: app.status === 'Applied' ? 'Pending' : 'Present',
        currentRound: app.round,
        roundResult: app.result,
        interviewDate: interviewDateStr,
        reportingTime: interviewDateStr ? '11:00 AM' : null,
        venue: interviewDateStr ? 'Main Block, Seminar Hall 2' : null,
        coordinatorNotes: `Reviewing technical profile. CGPA is ${app.student.cgpa}.`,
        lastUpdatedById: app.coord._id,
        relatedCoordinatorId: app.coord._id,
        ...appAuditDefaults
      });
      applications.push(newApp);

      // If Selected, mark student status as Placed
      if (app.status === 'Selected') {
        await Student.findByIdAndUpdate(app.student._id, { status: 'Placed' });
      }
    }

    // Add extra random applications to bring the total to 24 applications (realistic drives)
    const extraApps = [
      { sIdx: 1, jIdx: 3, status: 'Applied', round: 'Resume Screening', result: 'Pending', coord: coordUsers[1] },
      { sIdx: 4, jIdx: 0, status: 'Shortlisted', round: 'Online Assessment', result: 'Cleared', coord: coordUsers[0] },
      { sIdx: 11, jIdx: 2, status: 'Round 1 Cleared', round: 'Coding Test', result: 'Cleared', coord: coordUsers[1] },
      { sIdx: 11, jIdx: 4, status: 'Applied', round: 'Resume Screening', result: 'Pending', coord: coordUsers[2] },
      { sIdx: 9, jIdx: 1, status: 'Selected', round: 'HR Interview', result: 'Cleared', coord: coordUsers[0] },
      { sIdx: 6, jIdx: 6, status: 'Shortlisted', round: 'Online Assessment', result: 'Cleared', coord: coordUsers[0] },
      { sIdx: 2, jIdx: 0, status: 'Rejected', round: 'Online Assessment', result: 'Failed', coord: coordUsers[0] },
      { sIdx: 3, jIdx: 2, status: 'Applied', round: 'Resume Screening', result: 'Pending', coord: coordUsers[1] },
      { sIdx: 8, jIdx: 1, status: 'Applied', round: 'Resume Screening', result: 'Pending', coord: coordUsers[0] }
    ];

    for (const extra of extraApps) {
      const stud = studentProfiles[extra.sIdx];
      const job = jobs[extra.jIdx];
      
      // Avoid duplicate application
      const exists = await Application.findOne({ studentId: stud._id, jobId: job._id });
      if (exists) continue;

      const newApp = await Application.create({
        studentId: stud._id,
        jobId: job._id,
        studentName: stud.fullName,
        company: job.company,
        role: job.role,
        logo: job.logo,
        status: extra.status,
        attendance: extra.status === 'Applied' ? 'Pending' : 'Present',
        currentRound: extra.round,
        roundResult: extra.result,
        lastUpdatedById: extra.coord._id,
        relatedCoordinatorId: extra.coord._id,
        ...appAuditDefaults
      });
      applications.push(newApp);

      if (extra.status === 'Selected') {
        await Student.findByIdAndUpdate(stud._id, { status: 'Placed' });
      }
    }

    console.log(`[Seed] Applications created: ${applications.length}`);

    // ── 6. Create 10 Scheduled Interviews linked to applications ────────────
    console.log('🌱 [Seed] Creating Scheduled Interviews...');
    const interviewDefaults = {
      createdByRole: 'coordinator',
      moduleSource: 'CoordinatorPortal',
      ...DEMO_TAG
    };

    const scheduledRounds = [
      { appIdx: 1, round: 'Technical Round 1', time: '10:00 AM', mode: 'Online', venue: 'Microsoft Teams Link', slot: 'SLOT-MS-01' }, // Student Demo at Microsoft
      { appIdx: 0, round: 'Technical Round 1', time: '02:00 PM', mode: 'In-Person', venue: 'Placement Cell Room 3', slot: 'SLOT-GG-02' }, // Student Demo at Google
      { appIdx: 9, round: 'Technical Round 2', time: '11:30 AM', mode: 'Online', venue: 'Amazon Chime Link', slot: 'SLOT-AMZ-01' }, // Vikram at Amazon
      { appIdx: 5, round: 'Online Coding Test', time: '09:00 AM', mode: 'Online', venue: 'JPMorgan HackerRank', slot: 'SLOT-JPMC-04' }, // Neha at JPMorgan
      { appIdx: 10, round: 'System Design Interview', time: '04:00 PM', mode: 'In-Person', venue: 'Seminar Hall B', slot: 'SLOT-ADB-01' } // Ananya at Adobe
    ];

    for (let i = 0; i < scheduledRounds.length; i++) {
      const sch = scheduledRounds[i];
      const app = applications[sch.appIdx];
      if (!app) continue;

      await Interview.create({
        studentId: app.studentId,
        jobId: app.jobId,
        studentName: app.studentName,
        company: app.company,
        role: app.role,
        logo: app.logo,
        date: new Date(Date.now() + 86400000 * (i + 1)).toISOString().split('T')[0],
        time: sch.time,
        mode: sch.mode,
        venue: sch.venue,
        slotId: sch.slot,
        reportingTime: '15 Mins Before',
        status: 'Upcoming',
        createdBy: app.relatedCoordinatorId || adminUser._id,
        relatedApplicationId: app._id,
        ...interviewDefaults
      });
    }
    console.log('[Seed] Scheduled Interviews created');

    // ── 7. Create 8 Complete Preparation Center Resources ──────────────────
    console.log('🌱 [Seed] Creating Preparation Resources...');
    await PrepResource.create([
      { title: 'Google SDE-1 Placement Interview Guide', category: 'company', company: 'Google', topic: 'Algorithms & Graphs', resourceType: 'PDF', difficulty: 'Advanced', description: 'Comprehensive roadmap and breakdown of Google\'s recursive questions, dynamic programming topics, and graph traversal patterns.', tags: ['Google', 'DSA', 'SDE-1'], linkLabel: 'Download PDF', ...DEMO_TAG },
      { title: 'Stripe Frontend Systems Design Blueprint', category: 'company', company: 'Stripe', topic: 'Frontend System Design', resourceType: 'Video', difficulty: 'Intermediate', description: 'Architecting scalable applications, deep integration of Redux/Zustand, and web performance optimization deep-dive.', tags: ['Stripe', 'React', 'Frontend'], linkLabel: 'Watch Session', ...DEMO_TAG },
      { title: 'JPMorgan Chase Quantitative Aptitude Prep', category: 'skill', company: 'JPMorgan Chase & Co.', topic: 'Aptitude & Math', resourceType: 'Sheet', difficulty: 'Intermediate', description: 'Curated worksheets detailing probability, permutations, logic, and quantitative finance reasoning models.', tags: ['JPMC', 'Aptitude', 'Quant'], linkLabel: 'Access Sheet', ...DEMO_TAG },
      { title: 'Amazon AWS & Backend Microservices Guide', category: 'skill', company: 'Amazon', topic: 'Backend Systems', resourceType: 'Link', difficulty: 'Advanced', description: 'AWS Lambda, Docker configurations, and building reliable distributed queues with Apache Kafka.', tags: ['Go', 'Kafka', 'Amazon'], linkLabel: 'Explore Link', ...DEMO_TAG },
      { title: 'Advanced DSA Master Sheet (450 Questions)', category: 'skill', company: 'Any', topic: 'Data Structures', resourceType: 'Sheet', difficulty: 'Advanced', description: 'Complete sheet covering arrays, strings, binary trees, dynamic programming, and greedy algorithms.', tags: ['DSA', 'LeetCode', 'Practice'], linkLabel: 'Open Sheet', ...DEMO_TAG },
      { title: 'Dynamic Interactive Resume Templates', category: 'mock', company: 'Any', topic: 'Resume Building', resourceType: 'PDF', difficulty: 'Beginner', description: 'ATS-friendly standard resume templates to elevate your first impression for tier-1 recruiters.', tags: ['Resume', 'Career', 'Guidance'], linkLabel: 'Download Templates', ...DEMO_TAG },
      { title: 'Full Stack Web Mock Evaluation Test', category: 'mock', company: 'Any', topic: 'Web Development', resourceType: 'Test', difficulty: 'Intermediate', description: 'Simulated 60-minute technical evaluation covering JS, Node, Mongoose, and CSS performance.', tags: ['Mock Test', 'NodeJS', 'React'], linkLabel: 'Start Test', ...DEMO_TAG },
      { title: 'Oracle Cloud Placement Story (Placed: B.Tech)', category: 'experience', company: 'Oracle', topic: 'Interview Experience', resourceType: 'Experience', difficulty: 'Intermediate', description: 'Read about the full selection pipeline, interview tips, and how a student cleared Oracle\'s systems round.', tags: ['Oracle', 'Cloud', 'Alumni'], linkLabel: 'Read Story', ...DEMO_TAG }
    ]);
    console.log('[Seed] Preparation resources loaded');

    // ── 8. Create 15 Realistic Notifications ─────────────────────────────────
    console.log('🌱 [Seed] Creating Notifications...');
    // Create notifications for Amit Sharma, Priya Patel, and student Demo
    const demoStudentUser = studentUsers[0];
    const amitCoordUser = coordUsers[0];
    const priyaCoordUser = coordUsers[1];

    await Notification.create([
      // Student Notifications
      { receiverId: demoStudentUser._id, senderId: adminUser._id, title: 'Google Application Shortlisted! 📄', message: 'Congratulations! You have been shortlisted for the Graduate Software Engineer drive at Google.', type: 'Result', notificationType: 'StatusTransition', relatedJobId: jobs[0]._id, relatedApplicationId: applications[0]._id, visibilityScope: 'Private', isRead: false, ...DEMO_TAG },
      { receiverId: demoStudentUser._id, senderId: amitCoordUser._id, title: 'Interview Scheduled 📅', message: 'Your Technical Round 1 with Microsoft is scheduled for tomorrow at 10:00 AM. Access links are updated.', type: 'Interview', notificationType: 'InterviewReminder', relatedJobId: jobs[1]._id, relatedApplicationId: applications[1]._id, visibilityScope: 'Private', isRead: false, ...DEMO_TAG },
      { receiverId: studentUsers[1]._id, senderId: adminUser._id, title: '🎉 Placement Selection Confirmed!', message: 'Amazing work, Rahul! You have cleared all rounds and secured an offer at Google!', type: 'Result', notificationType: 'OfferExtended', relatedJobId: jobs[0]._id, relatedApplicationId: applications[3]._id, visibilityScope: 'Private', isRead: true, ...DEMO_TAG },
      { receiverId: studentUsers[2]._id, senderId: priyaCoordUser._id, title: 'JPMorgan Interview call', message: 'Hi Neha, you have been shortlisted for JPMorgan\'s technical test.', type: 'Interview', notificationType: 'AssessmentInvite', relatedJobId: jobs[2]._id, relatedApplicationId: applications[5]._id, visibilityScope: 'Private', isRead: false, ...DEMO_TAG },
      { receiverId: demoStudentUser._id, senderId: adminUser._id, title: 'Recommended Prep Material', message: 'A new Stripe Frontend Design resource matches your skills. Check it out in the Prep Library!', type: 'General', notificationType: 'SystemAlert', visibilityScope: 'Cohort', isRead: true, ...DEMO_TAG },
      
      // Coordinator Notifications
      { receiverId: amitCoordUser._id, senderId: adminUser._id, title: 'Google Drive Lead Assigned', message: 'You are designated as the lead coordinator for the Google SDE drive.', type: 'Assignment', notificationType: 'DriveAssignment', relatedJobId: jobs[0]._id, visibilityScope: 'Private', isRead: false, ...DEMO_TAG },
      { receiverId: amitCoordUser._id, senderId: adminUser._id, title: 'Microsoft Drive Lead Assigned', message: 'You have been assigned as lead coordinator for the Microsoft SWE drive.', type: 'Assignment', notificationType: 'DriveAssignment', relatedJobId: jobs[1]._id, visibilityScope: 'Private', isRead: true, ...DEMO_TAG },
      { receiverId: priyaCoordUser._id, senderId: adminUser._id, title: 'Amazon Drive Assigned', message: 'You are lead coordinator for the Amazon Backend Engineer placement event.', type: 'Assignment', notificationType: 'DriveAssignment', relatedJobId: jobs[3]._id, visibilityScope: 'Private', isRead: false, ...DEMO_TAG },
      { receiverId: priyaCoordUser._id, senderId: demoStudentUser._id, title: 'New Student Registration', message: 'A new student profile has been submitted and matches Amazon eligibility.', type: 'General', notificationType: 'CandidateAction', relatedJobId: jobs[3]._id, visibilityScope: 'Private', isRead: false, ...DEMO_TAG }
    ]);
    console.log('[Seed] Notifications created');

    // ── 9. Create Coordinator Tasks & Activity Logs ────────────────────────
    console.log('🌱 [Seed] Creating Coordinator Tasks & Activity Logs...');
    await CoordinatorTask.create([
      { coordinatorId: amitCoordUser._id, title: 'Setup Google Technical Interview Roster', description: 'Schedule slots for all 15 shortlisted CS students and assign Microsoft Teams URLs.', deadline: new Date(Date.now() + 86400000 * 2), priority: 'High', status: 'Pending', ...DEMO_TAG },
      { coordinatorId: amitCoordUser._id, title: 'Verify Stripe Resume Submissions', description: 'Review GitHub and Portfolio profile links for early frontend applicants.', deadline: new Date(Date.now() + 86400000 * 3), priority: 'Medium', status: 'Pending', ...DEMO_TAG },
      { coordinatorId: priyaCoordUser._id, title: 'Collect Amazon Coding OA Scores', description: 'Request assessment reports from the Amazon Campus Recruitment HR.', deadline: new Date(Date.now() - 86400000), priority: 'High', status: 'Completed', ...DEMO_TAG },
      { coordinatorId: priyaCoordUser._id, title: 'JPMorgan Roster Check', description: 'Double check student CGPA eligibility against the JPMorgan quantitative analyst requirements.', deadline: new Date(Date.now() + 86400000), priority: 'Medium', status: 'Completed', ...DEMO_TAG },
      { coordinatorId: amitCoordUser._id, title: 'Broadcast Meta APM Roster Close', description: 'Send final list of selected candidates to Dean Offices.', deadline: new Date(Date.now() - 86400000 * 2), priority: 'Low', status: 'Completed', ...DEMO_TAG }
    ]);

    await CoordinatorActivityLog.create([
      { coordinatorId: amitCoordUser._id, actionType: 'Shortlisted student for Round 2', targetEntityId: applications[0]._id, targetEntityModel: 'Application', details: 'Shortlisted candidate Student Demo after evaluating Round 1 OA results.', relatedJobId: jobs[0]._id, relatedApplicationId: applications[0]._id, relatedStudentId: studentProfiles[0]._id, ...DEMO_TAG },
      { coordinatorId: amitCoordUser._id, actionType: 'Scheduled interview for Amazon drive', targetEntityId: applications[9]._id, targetEntityModel: 'Application', details: 'Scheduled Technical Round 2 Interview for Vikram Malhotra.', relatedJobId: jobs[3]._id, relatedApplicationId: applications[9]._id, relatedStudentId: studentProfiles[5]._id, ...DEMO_TAG },
      { coordinatorId: priyaCoordUser._id, actionType: 'Rejected candidate after technical round', targetEntityId: applications[7]._id, targetEntityModel: 'Application', details: 'Marked Karan Mehta as Rejected based on failure in JPMorgan Quantitative test.', relatedJobId: jobs[2]._id, relatedApplicationId: applications[7]._id, relatedStudentId: studentProfiles[7]._id, ...DEMO_TAG },
      { coordinatorId: amitCoordUser._id, actionType: 'Marked attendance for interview', targetEntityId: applications[1]._id, targetEntityModel: 'Application', details: 'Marked attendance as Present for Student Demo in Microsoft Technical Interview 1.', relatedJobId: jobs[1]._id, relatedApplicationId: applications[1]._id, relatedStudentId: studentProfiles[0]._id, ...DEMO_TAG }
    ]);
    console.log('[Seed] Tasks and Logs created');

    console.log('\n🎉 MEGA DEMO ENVIRONMENT SEEDED SUCCESSFULLY! 🎉');
    console.log('----------------------------------------------------');
    console.log('🤵 Admin Focus:       admin_demo@applywise.com');
    console.log('👨‍💻 Coordinator Focus: coord_amit@applywise.com');
    console.log('🎓 Student Focus:     student_demo@applywise.com');
    console.log('🔑 Password (All):    demo123');
    console.log('----------------------------------------------------');

    process.exit(0);

  } catch (error) {
    console.error('❌ Demo seeding failed:', error);
    process.exit(1);
  }
};

seedDemo();
