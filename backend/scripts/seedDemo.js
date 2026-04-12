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
    const collections = [User, Student, Job, Application, Notification, CoordinatorProfile, CoordinatorActivityLog, CoordinatorTask, Interview, PrepResource];
    for (const model of collections) {
      await model.deleteMany(DEMO_TAG);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('demo123', salt);

    console.log('🌱 Seeding demo personas...');

    // ── 1. Create Users ───────────────────────────────────────────────────────
    const adminUser = await User.create({
      name: 'Admin Demo', email: 'admin_demo@applywise.com', password: hashedPassword, role: 'admin', ...DEMO_TAG
    });

    const coordinatorUser = await User.create({
      name: 'Coordinator Demo', email: 'coordinator_demo@applywise.com', password: hashedPassword, role: 'coordinator', ...DEMO_TAG
    });

    const studentUser = await User.create({
      name: 'Student Demo', email: 'student_demo@applywise.com', password: hashedPassword, role: 'student', ...DEMO_TAG
    });

    console.log('🌱 Seeding profiles & skills matching data...');

    // ── 2. Create Student Profile (Matchable) ───────────────────────────────
    const studentProfile = await Student.create({
      _id: studentUser._id,
      fullName: 'Student Demo',
      enrollmentNumber: 'DEMO-CS-2024-001',
      collegeEmail: 'student_demo@applywise.com',
      personalEmail: 'student_demo_personal@example.com',
      phone: '+91 9876543210',
      gender: 'Non-Binary',
      degree: 'B.Tech',
      branch: 'Computer Science',
      semester: '8',
      cgpa: 8.9,
      tenthPercentage: 92,
      twelfthPercentage: 89,
      backlogs: '0',
      academicStatus: 'Clear',
      primaryDomain: 'Full Stack Development',
      primaryLanguage: 'JavaScript',
      overallSkillLevel: 'Advanced',
      technicalSkills: ['React', 'Node.js', 'MongoDB', 'Python', 'AWS'],
      databaseFamiliarity: 'High',
      backendFamiliarity: 'High',
      communicationLevel: 'Excellent',
      problemSolvingLevel: 'High',
      codingPlatform: 'LeetCode',
      dsaLevel: 'Intermediate',
      preferredJobType: 'Full-time',
      preferredWorkMode: 'Hybrid',
      preferredLocation: 'Bengaluru',
      openToRelocation: 'Yes',
      expectedCompensation: '12 LPA+',
      availabilityStatus: 'Immediate',
      preferredCompanyType: 'Product-based',
      offCampusInterest: 'High',
      resumeLink: 'https://example.com/resume.pdf',
      resumeStatus: 'Verified',
      status: 'Not Placed',
      profileVisibility: 'Public',
      github: 'https://github.com/studentdemo',
      linkedIn: 'https://linkedin.com/in/studentdemo',
      ...DEMO_TAG
    });

    const coordProfile = await CoordinatorProfile.create({
      userId: coordinatorUser._id,
      name: 'Coordinator Demo',
      department: 'Computer Science',
      phoneNumber: '+91 9988776655',
      stats: { tasksCompleted: 15, interviewsScheduled: 4, attendanceUpdates: 12, statusUpdates: 20, jobsManaged: 4, totalActions: 62 },
      ...DEMO_TAG
    });

    console.log('🌱 Seeding multiple opportunities for the Coordinator & Admin...');

    // ── 3. Create Diverse Jobs ───────────────────────────────────────────────
    const jobAuditDefaults = {
      createdBy: adminUser._id,
      createdByRole: 'admin',
      lastUpdatedById: adminUser._id,
      lastUpdatedByRole: 'admin',
      moduleSource: 'AdminPortal',
      ...DEMO_TAG
    };
    
    // Eligible & Applied (Shortlisted)
    const jobGoogle = await Job.create({
      company: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
      title: 'Graduate Software Engineer', role: 'SDE-1', opportunityType: 'Full-time', employmentMode: 'Hybrid', location: 'Bengaluru, India',
      eligibleBatch: ['2023', '2024'], salary: '32 LPA', requiredSkills: ['React', 'Node.js', 'Python'], minCGPA: 8.0,
      assignedCoordinatorId: coordinatorUser._id, assignedCoordinatorName: 'Coordinator Demo', status: 'Ongoing', visibilityRule: 'All', ...jobAuditDefaults
    });

    // Eligible & Interview Scheduled
    const jobMicrosoft = await Job.create({
      company: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
      title: 'Data Science Intern', role: 'Data Scientist', opportunityType: 'Internship + PPO', employmentMode: 'Remote', location: 'Remote',
      eligibleBatch: ['2024'], stipend: '1.2 LPM', requiredSkills: ['Python', 'SQL'], minCGPA: 8.0,
      assignedCoordinatorId: coordinatorUser._id, assignedCoordinatorName: 'Coordinator Demo', status: 'Ongoing', visibilityRule: 'EligibleOnly', ...jobAuditDefaults
    });

    // Highly Eligible but Not Applied (Feed targeted)
    const jobStripe = await Job.create({
      company: 'Stripe', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
      title: 'Frontend Engineer', role: 'Frontend Engineer', opportunityType: 'Full-time', employmentMode: 'Remote', location: 'Remote',
      eligibleBatch: ['2024'], salary: '45 LPA', requiredSkills: ['React', 'JavaScript', 'AWS'], minCGPA: 8.5,
      assignedCoordinatorId: coordinatorUser._id, assignedCoordinatorName: 'Coordinator Demo', status: 'Open', visibilityRule: 'All', ...jobAuditDefaults
    });

    // Partially Ready (Missing Skills)
    const jobUber = await Job.create({
      company: 'Uber', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png',
      title: 'Backend Systems Engineer', role: 'Backend Engineer', opportunityType: 'Full-time', employmentMode: 'Hybrid', location: 'Hyderabad, India',
      eligibleBatch: ['2024'], salary: '35 LPA', requiredSkills: ['Go', 'Kafka', 'Cassandra'], preferredSkills: ['Node.js'], minCGPA: 8.0,
      assignedCoordinatorId: coordinatorUser._id, assignedCoordinatorName: 'Coordinator Demo', status: 'Open', visibilityRule: 'All', ...jobAuditDefaults
    });

    // Not Eligible (Low CGPA req / strict constraints)
    const jobJPMC = await Job.create({
      company: 'JPMorgan Chase & Co.', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/JPMorgan_Chase_Logo_2008_1.svg',
      title: 'Quantitative Analyst', role: 'Quant', opportunityType: 'Full-time', employmentMode: 'On-site', location: 'Mumbai, India',
      eligibleBatch: ['2024'], salary: '25 LPA', requiredSkills: ['C++', 'Math'], minCGPA: 9.5, // Fails CGPA check (Student has 8.9)
      assignedCoordinatorId: null, assignedCoordinatorName: null, status: 'Open', visibilityRule: 'All', ...jobAuditDefaults
    });

    // Terminal Application Statuses
    const jobOracle = await Job.create({
      company: 'Oracle', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg',
      title: 'Cloud Infrastructure Dev', role: 'Cloud Engineer', opportunityType: 'Full-time', employmentMode: 'On-site', location: 'Pune, India',
      eligibleBatch: ['2024'], salary: '18 LPA', requiredSkills: ['Java', 'SQL', 'AWS'], minCGPA: 7.5,
      assignedCoordinatorId: coordinatorUser._id, assignedCoordinatorName: 'Coordinator Demo', status: 'Completed', visibilityRule: 'All', ...jobAuditDefaults
    });

    const jobMeta = await Job.create({
      company: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
      title: 'Product Manager', role: 'APM', opportunityType: 'Full-time', employmentMode: 'In-office', location: 'Gurugram',
      eligibleBatch: ['2024'], salary: '40 LPA', requiredSkills: ['Product', 'Data'], minCGPA: 8.0,
      assignedCoordinatorId: coordinatorUser._id, assignedCoordinatorName: 'Coordinator Demo', status: 'Closed', visibilityRule: 'All', ...jobAuditDefaults
    });


    console.log('🌱 Seeding robust application records with varied lifecycles...');

    // ── 4. Create Applications (Spanning all statuses) ───────────────────────
    
    const appAuditDefaults = {
      lastUpdatedById: coordinatorUser._id,
      lastUpdatedByRole: 'coordinator',
      relatedCoordinatorId: coordinatorUser._id,
      moduleSource: 'CoordinatorPortal',
      ...DEMO_TAG
    };

    // 1. Shortlisted App
    const appGoogle = await Application.create({
      studentId: studentProfile._id, jobId: jobGoogle._id, studentName: 'Student Demo', company: 'Google', role: 'SDE-1',
      status: 'Shortlisted', attendance: 'Present', currentRound: 'Online Assessment', roundResult: 'Cleared', ...appAuditDefaults
    });

    // 2. Interview Scheduled App
    const appMicrosoft = await Application.create({
      studentId: studentProfile._id, jobId: jobMicrosoft._id, studentName: 'Student Demo', company: 'Microsoft', role: 'Data Scientist',
      status: 'Interview Scheduled', attendance: 'Pending', currentRound: 'Technical Interview 1', roundResult: 'Pending',
      interviewDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], reportingTime: '10:00 AM', venue: 'Microsoft Teams Link', coordinatorNotes: 'Candidate is strong in Python. Expecting system design questions.', ...appAuditDefaults
    });

    // 3. Selected App
    const appOracle = await Application.create({
      studentId: studentProfile._id, jobId: jobOracle._id, studentName: 'Student Demo', company: 'Oracle', role: 'Cloud Engineer',
      status: 'Selected', attendance: 'Present', currentRound: 'HR Round', roundResult: 'Cleared', ...appAuditDefaults
    });

    // 4. Rejected App
    const appMeta = await Application.create({
      studentId: studentProfile._id, jobId: jobMeta._id, studentName: 'Student Demo', company: 'Meta', role: 'APM',
      status: 'Rejected', attendance: 'Present', currentRound: 'Product Sense Round', roundResult: 'Failed', ...appAuditDefaults
    });

    // 5. Applied (Early stage - updated by student)
    const appStripe = await Application.create({
      studentId: studentProfile._id, jobId: jobStripe._id, studentName: 'Student Demo', company: 'Stripe', role: 'Frontend Engineer',
      status: 'Applied', attendance: 'Pending', currentRound: 'Resume Screening', roundResult: 'Pending',
      lastUpdatedById: studentUser._id, lastUpdatedByRole: 'student', relatedCoordinatorId: coordinatorUser._id, moduleSource: 'StudentPortal', ...DEMO_TAG
    });


    console.log('🌱 Seeding Prep Center Resources...');

    // ── 5. Create Preparation Center Resources ───────────────────────────────
    await PrepResource.create([
      { title: 'Google SDE-1 Interview Guide', category: 'company', company: 'Google', topic: 'Algorithms', resourceType: 'PDF', difficulty: 'Advanced', description: 'Comprehensive guide covering Google\'s most asked graph and dynamic programming questions.', tags: ['Google', 'DSA', 'SDE-1'], ...DEMO_TAG },
      { title: 'Stripe Frontend Systems Design', category: 'company', company: 'Stripe', topic: 'System Design', resourceType: 'Video', difficulty: 'Intermediate', description: 'Deconstructing modern React architectures and state management.', tags: ['Stripe', 'React', 'Frontend'], ...DEMO_TAG },
      { title: 'Go & Kafka Crash Course', category: 'skill', company: 'Any', topic: 'Backend', resourceType: 'Link', difficulty: 'Intermediate', description: 'Missing Go in your stack? Get up to speed quickly for backend roles like Uber.', tags: ['Go', 'Kafka'], ...DEMO_TAG },
      { title: 'Full Stack Mock Interview', category: 'mock', company: 'Any', topic: 'Full Stack', resourceType: 'Test', difficulty: 'Intermediate', description: 'Simulated 60-minute technical evaluation covering JS, Node, and db design.', tags: ['Mock', 'Node.js', 'React'], ...DEMO_TAG },
      { title: 'Oracle Cloud Experience 2023', category: 'experience', company: 'Oracle', topic: 'Interview Experience', resourceType: 'Experience', difficulty: 'Beginner', description: 'A breakdown of the hr and technical workflow from a recently placed senior.', tags: ['Oracle', 'Cloud'], ...DEMO_TAG }
    ]);


    console.log('🌱 Seeding Notifications...');

    // ── 6. Create Notifications (Student and Coordinator) ────────────────────
    
    // Student Notifications
    await Notification.create([
      { receiverId: studentUser._id, senderId: adminUser._id, title: 'Application Shortlisted! 📄', message: 'Great news! You have been shortlisted for the SDE-1 position at Google.', type: 'Result', notificationType: 'StatusTransition', relatedJobId: jobGoogle._id, relatedApplicationId: appGoogle._id, visibilityScope: 'Private', isRead: false, ...DEMO_TAG },
      { receiverId: studentUser._id, senderId: coordinatorUser._id, title: 'Interview Scheduled 📅', message: 'Your interview for Microsoft (Data Scientist) is scheduled for tomorrow at 10:00 AM.', type: 'Interview', notificationType: 'InterviewReminder', relatedJobId: jobMicrosoft._id, relatedApplicationId: appMicrosoft._id, visibilityScope: 'Private', isRead: false, ...DEMO_TAG },
      { receiverId: studentUser._id, senderId: adminUser._id, title: '🎉 Congratulations!', message: 'You have successfully cleared all rounds and secured the Cloud Engineer position at Oracle!', type: 'Result', notificationType: 'OfferExtended', relatedJobId: jobOracle._id, relatedApplicationId: appOracle._id, visibilityScope: 'Private', isRead: true, ...DEMO_TAG },
      { receiverId: studentUser._id, senderId: adminUser._id, title: 'New Prep Resource Added', message: 'We just compiled a new Stripe Frontend Systems Design prep guide based on your profile match.', type: 'General', notificationType: 'SystemAlert', visibilityScope: 'Cohort', isRead: false, ...DEMO_TAG }
    ]);

    // Coordinator Notifications
    await Notification.create([
      { receiverId: coordinatorUser._id, senderId: adminUser._id, title: 'Drive Assigned', message: 'You have been assigned as the lead coordinator for the upcoming Microsoft placement drive.', type: 'Alert', notificationType: 'DriveAssignment', relatedJobId: jobMicrosoft._id, visibilityScope: 'Private', isRead: false, ...DEMO_TAG },
      { receiverId: coordinatorUser._id, senderId: adminUser._id, title: 'Drive Assigned', message: 'You have been assigned as the lead coordinator for the Google hiring event.', type: 'Alert', notificationType: 'DriveAssignment', relatedJobId: jobGoogle._id, visibilityScope: 'Private', isRead: true, ...DEMO_TAG },
      { receiverId: coordinatorUser._id, senderId: studentUser._id, title: 'Attendance Update', message: 'Student Demo has confirmed attendance for the Microsoft Data Scientist interview.', type: 'General', notificationType: 'CandidateAction', relatedJobId: jobMicrosoft._id, relatedApplicationId: appMicrosoft._id, visibilityScope: 'Private', isRead: false, ...DEMO_TAG }
    ]);

    console.log('🌱 Seeding Coordinator Tasks & Logs...');

    // ── 7. Create Coordinator Tasks & Activity Logs ──────────────────────────
    await CoordinatorTask.create([
      { coordinatorId: coordinatorUser._id, title: 'Finalize Microsoft Interview Roster', description: 'Ensure all 20 shortlisted candidates have valid Teams links generated.', deadline: new Date(Date.now() + 86400000), priority: 'High', status: 'Pending', ...DEMO_TAG },
      { coordinatorId: coordinatorUser._id, title: 'Collect Google OT Scores', description: 'Reach out to Google HR for the online test results.', deadline: new Date(Date.now() - 86400000), priority: 'Medium', status: 'Completed', ...DEMO_TAG },
      { coordinatorId: coordinatorUser._id, title: 'Verify Student Resumes for Stripe', description: 'Spot-check student resumes applying for the Stripe Frontend role.', deadline: new Date(Date.now() + 172800000), priority: 'Low', status: 'Pending', ...DEMO_TAG }
    ]);

    await CoordinatorActivityLog.create([
      { coordinatorId: coordinatorUser._id, actionType: 'Schedule Interview', targetEntityId: appMicrosoft._id, targetEntityModel: 'Application', details: 'Scheduled initial interview for Microsoft Data Scientist.',
        relatedJobId: jobMicrosoft._id, relatedApplicationId: appMicrosoft._id, relatedStudentId: studentProfile._id, ...DEMO_TAG },
      { coordinatorId: coordinatorUser._id, actionType: 'Status Update', targetEntityId: appGoogle._id, targetEntityModel: 'Application', details: 'Updated status to Shortlisted for Google SDE-1.',
        relatedJobId: jobGoogle._id, relatedApplicationId: appGoogle._id, relatedStudentId: studentProfile._id, ...DEMO_TAG },
      { coordinatorId: coordinatorUser._id, actionType: 'Round Update', targetEntityId: appOracle._id, targetEntityModel: 'Application', details: 'Marked Oracle HR round as cleared.',
        relatedJobId: jobOracle._id, relatedApplicationId: appOracle._id, relatedStudentId: studentProfile._id, ...DEMO_TAG }
    ]);

    console.log('\n🎉 MEGA DEMO ENVIRONMENT SEEDED SUCCESSFULLY! 🎉');
    console.log('----------------------------------------------------');
    console.log('🤵 Admin Focus:       admin_demo@applywise.com');
    console.log('👨‍💻 Coordinator Focus: coordinator_demo@applywise.com');
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
