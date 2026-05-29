require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./models/User');
const Student = require('./models/Student');
const Job = require('./models/Job');
const Application = require('./models/Application');
const Interview = require('./models/Interview');

const seedDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/applywise_db');
        console.log(`Connected to MongoDB Database for seeding (${conn.connection.name})...`);

        // Clear existing data
        await User.deleteMany({});
        await Student.deleteMany({});
        await Job.deleteMany({});
        await Application.deleteMany({});
        await Interview.deleteMany({});
        console.log("Cleared existing data.");

        // Create Users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        
        await User.create({
            email: 'admin@college.edu',
            password: hashedPassword,
            role: 'admin'
        });

        // Also seed an admin@example.com, student@example.com, and coordinator@example.com for frontend fallback quick-access consistency
        await User.create({
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
        });

        await User.create({
            email: 'coordinator@example.com',
            password: hashedPassword,
            role: 'coordinator'
        });

        const studentUsersData = [
            { email: 'student1@college.edu', password: hashedPassword, role: 'student' },
            { email: 'student2@college.edu', password: hashedPassword, role: 'student' },
            { email: 'student3@college.edu', password: hashedPassword, role: 'student' },
            { email: 'emily@college.edu', password: hashedPassword, role: 'student' },
            { email: 'michael@college.edu', password: hashedPassword, role: 'student' },
            { email: 'student@example.com', password: hashedPassword, role: 'student' } // For quick access
        ];
        const studentUsers = await User.insertMany(studentUsersData);
        console.log(`Created ${studentUsers.length} student user accounts.`);

        // Create Students (With ALL required Mongoose fields populated and linked)
        const studentsData = [
            {
                _id: new mongoose.Types.ObjectId(),
                userId: studentUsers.find(u => u.email === 'student1@college.edu')._id,
                fullName: "John Doe",
                name: "John Doe",
                enrollmentNumber: "111",
                collegeEmail: "student1@college.edu",
                personalEmail: "john.doe.personal@gmail.com",
                phone: "9876543210",
                gender: "male",
                degree: "BTech",
                branch: "Computer Science",
                semester: "8th",
                cgpa: 8.5,
                tenthPercentage: 90,
                twelfthPercentage: 85,
                backlogs: "0",
                academicStatus: "good-standing",
                primaryDomain: "Full Stack Development",
                primaryLanguage: "JavaScript",
                overallSkillLevel: "Intermediate",
                technicalSkills: ["React", "NodeJS", "MongoDB"],
                skillProficiency: { "React": "Advanced", "NodeJS": "Intermediate", "MongoDB": "Intermediate" },
                databaseFamiliarity: "MongoDB",
                backendFamiliarity: "ExpressJS",
                communicationLevel: "Advanced",
                problemSolvingLevel: "Advanced",
                codingPlatform: "LeetCode",
                dsaLevel: "Intermediate",
                interestedRoles: ["Software Engineer", "Frontend Developer"],
                preferredJobType: "Full-time",
                preferredWorkMode: "Hybrid",
                preferredLocation: "Bangalore",
                openToRelocation: "Yes",
                preferredDomains: ["Software Development"],
                expectedCompensation: "₹10+ LPA",
                availabilityStatus: "Immediately Available",
                preferredCompanyType: "MNC",
                offCampusInterest: "Yes",
                resumeLink: "https://example.com/resume.pdf",
                resumeStatus: "Updated Recently",
                linkedIn: "https://linkedin.com/in/johndoe",
                github: "https://github.com/johndoe",
                profileVisibility: "Yes",
                status: "Not Placed"
            },
            {
                _id: new mongoose.Types.ObjectId(),
                userId: studentUsers.find(u => u.email === 'student2@college.edu')._id,
                fullName: "Jane Smith",
                name: "Jane Smith",
                enrollmentNumber: "222",
                collegeEmail: "student2@college.edu",
                personalEmail: "jane.smith@gmail.com",
                phone: "9876543211",
                gender: "female",
                degree: "BTech",
                branch: "Information Technology",
                semester: "8th",
                cgpa: 9.0,
                tenthPercentage: 95,
                twelfthPercentage: 92,
                backlogs: "0",
                academicStatus: "good-standing",
                primaryDomain: "Frontend Development",
                primaryLanguage: "JavaScript",
                overallSkillLevel: "Advanced",
                technicalSkills: ["React", "CSS", "TypeScript"],
                skillProficiency: { "React": "Advanced", "CSS": "Advanced", "TypeScript": "Intermediate" },
                databaseFamiliarity: "MySQL",
                backendFamiliarity: "REST APIs",
                communicationLevel: "Advanced",
                problemSolvingLevel: "Advanced",
                codingPlatform: "LeetCode",
                dsaLevel: "Intermediate",
                interestedRoles: ["Frontend Developer"],
                preferredJobType: "Full-time",
                preferredWorkMode: "On-site",
                preferredLocation: "Bangalore",
                openToRelocation: "Yes",
                preferredDomains: ["Software Development"],
                expectedCompensation: "₹10+ LPA",
                availabilityStatus: "Immediately Available",
                preferredCompanyType: "MNC",
                offCampusInterest: "Yes",
                resumeLink: "https://example.com/resume.pdf",
                resumeStatus: "Updated Recently",
                linkedIn: "https://linkedin.com/in/janesmith",
                github: "https://github.com/janesmith",
                profileVisibility: "Yes",
                status: "Placed"
            },
            {
                _id: new mongoose.Types.ObjectId(),
                userId: studentUsers.find(u => u.email === 'student3@college.edu')._id,
                fullName: "Sam Wilson",
                name: "Sam Wilson",
                enrollmentNumber: "333",
                collegeEmail: "student3@college.edu",
                personalEmail: "sam.wilson@gmail.com",
                phone: "9876543212",
                gender: "male",
                degree: "MBA",
                branch: "Marketing",
                semester: "4th",
                cgpa: 7.8,
                tenthPercentage: 82,
                twelfthPercentage: 80,
                backlogs: "0",
                academicStatus: "good-standing",
                primaryDomain: "Product / Business",
                primaryLanguage: "None Yet",
                overallSkillLevel: "Intermediate",
                technicalSkills: ["Excel", "Power BI"],
                skillProficiency: { "Excel": "Advanced", "Power BI": "Intermediate" },
                databaseFamiliarity: "None",
                backendFamiliarity: "None",
                communicationLevel: "Advanced",
                problemSolvingLevel: "Intermediate",
                codingPlatform: "None",
                dsaLevel: "Beginner",
                interestedRoles: ["Marketing Executive"],
                preferredJobType: "Full-time",
                preferredWorkMode: "Hybrid",
                preferredLocation: "Mumbai",
                openToRelocation: "Yes",
                preferredDomains: ["Sales & Marketing"],
                expectedCompensation: "₹6 – ₹10 LPA",
                availabilityStatus: "Immediately Available",
                preferredCompanyType: "Mid-size Company",
                offCampusInterest: "Yes",
                resumeLink: "https://example.com/resume.pdf",
                resumeStatus: "Updated Recently",
                linkedIn: "https://linkedin.com/in/samwilson",
                github: "https://github.com/samwilson",
                profileVisibility: "Yes",
                status: "Not Placed"
            },
            {
                _id: new mongoose.Types.ObjectId(),
                userId: studentUsers.find(u => u.email === 'emily@college.edu')._id,
                fullName: "Emily Clark",
                name: "Emily Clark",
                enrollmentNumber: "444",
                collegeEmail: "emily@college.edu",
                personalEmail: "emily.clark@gmail.com",
                phone: "9876543213",
                gender: "female",
                degree: "BTech",
                branch: "Electronics",
                semester: "8th",
                cgpa: 8.2,
                tenthPercentage: 88,
                twelfthPercentage: 84,
                backlogs: "0",
                academicStatus: "good-standing",
                primaryDomain: "DevOps",
                primaryLanguage: "Python",
                overallSkillLevel: "Intermediate",
                technicalSkills: ["Linux", "Git", "Docker"],
                skillProficiency: { "Linux": "Advanced", "Git": "Advanced", "Docker": "Intermediate" },
                databaseFamiliarity: "SQL Server",
                backendFamiliarity: "REST APIs",
                communicationLevel: "Advanced",
                problemSolvingLevel: "Advanced",
                codingPlatform: "HackerRank",
                dsaLevel: "Intermediate",
                interestedRoles: ["DevOps Engineer", "Software Engineer"],
                preferredJobType: "Full-time",
                preferredWorkMode: "Remote",
                preferredLocation: "Pune",
                openToRelocation: "Yes",
                preferredDomains: ["Cloud & DevOps"],
                expectedCompensation: "₹6 – ₹10 LPA",
                availabilityStatus: "Immediately Available",
                preferredCompanyType: "MNC",
                offCampusInterest: "Yes",
                resumeLink: "https://example.com/resume.pdf",
                resumeStatus: "Updated Recently",
                linkedIn: "https://linkedin.com/in/emilyclark",
                github: "https://github.com/emilyclark",
                profileVisibility: "Yes",
                status: "Not Placed"
            },
            {
                _id: new mongoose.Types.ObjectId(),
                userId: studentUsers.find(u => u.email === 'michael@college.edu')._id,
                fullName: "Michael Gray",
                name: "Michael Gray",
                enrollmentNumber: "555",
                collegeEmail: "michael@college.edu",
                personalEmail: "michael.gray@gmail.com",
                phone: "9876543214",
                gender: "male",
                degree: "MCA",
                branch: "Computer Applications",
                semester: "6th",
                cgpa: 8.9,
                tenthPercentage: 91,
                twelfthPercentage: 89,
                backlogs: "0",
                academicStatus: "good-standing",
                primaryDomain: "Backend Development",
                primaryLanguage: "Java",
                overallSkillLevel: "Advanced",
                technicalSkills: ["Java", "MySQL", "Git"],
                skillProficiency: { "Java": "Advanced", "MySQL": "Advanced", "Git": "Intermediate" },
                databaseFamiliarity: "MySQL",
                backendFamiliarity: "Spring Boot",
                communicationLevel: "Advanced",
                problemSolvingLevel: "Advanced",
                codingPlatform: "LeetCode",
                dsaLevel: "Advanced",
                interestedRoles: ["Software Engineer", "Backend Developer"],
                preferredJobType: "Full-time",
                preferredWorkMode: "Hybrid",
                preferredLocation: "Noida",
                openToRelocation: "Yes",
                preferredDomains: ["Software Development"],
                expectedCompensation: "₹10+ LPA",
                availabilityStatus: "Immediately Available",
                preferredCompanyType: "MNC",
                offCampusInterest: "Yes",
                resumeLink: "https://example.com/resume.pdf",
                resumeStatus: "Updated Recently",
                linkedIn: "https://linkedin.com/in/michaelgray",
                github: "https://github.com/michaelgray",
                profileVisibility: "Yes",
                status: "Placed"
            },
            {
                _id: new mongoose.Types.ObjectId(),
                userId: studentUsers.find(u => u.email === 'student@example.com')._id,
                fullName: "Student Demo",
                name: "Student Demo",
                enrollmentNumber: "666",
                collegeEmail: "student@example.com",
                personalEmail: "student.demo@gmail.com",
                phone: "9876543215",
                gender: "male",
                degree: "BTech",
                branch: "Computer Science",
                semester: "8th",
                cgpa: 8.8,
                tenthPercentage: 92,
                twelfthPercentage: 90,
                backlogs: "0",
                academicStatus: "good-standing",
                primaryDomain: "Full Stack Development",
                primaryLanguage: "JavaScript",
                overallSkillLevel: "Advanced",
                technicalSkills: ["React", "NodeJS", "ExpressJS", "MongoDB"],
                skillProficiency: { "React": "Advanced", "NodeJS": "Advanced", "ExpressJS": "Advanced", "MongoDB": "Intermediate" },
                databaseFamiliarity: "MongoDB",
                backendFamiliarity: "ExpressJS",
                communicationLevel: "Advanced",
                problemSolvingLevel: "Advanced",
                codingPlatform: "LeetCode",
                dsaLevel: "Intermediate",
                interestedRoles: ["Software Engineer", "Full Stack Developer"],
                preferredJobType: "Full-time",
                preferredWorkMode: "Hybrid",
                preferredLocation: "Bangalore",
                openToRelocation: "Yes",
                preferredDomains: ["Software Development"],
                expectedCompensation: "₹10+ LPA",
                availabilityStatus: "Immediately Available",
                preferredCompanyType: "MNC",
                offCampusInterest: "Yes",
                resumeLink: "https://example.com/resume.pdf",
                resumeStatus: "Updated Recently",
                linkedIn: "https://linkedin.com/in/studentdemo",
                github: "https://github.com/studentdemo",
                profileVisibility: "Yes",
                status: "Not Placed"
            }
        ];

        // Bulk insert using standard model saves or collection insertion to populate the Student documents
        const createdStudents = await Student.insertMany(studentsData);
        console.log(`Successfully seeded ${createdStudents.length} fully structured student profiles.`);

        // Create Jobs
        const jobs = await Job.insertMany([
            {
                company: "Google",
                role: "Software Engineer",
                salary: "$120,000",
                deadline: "2026-05-15",
                logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
                tags: ["React", "Node.js", "MongoDB"],
                requiredSkills: ["React", "NodeJS", "MongoDB"],
                description: "Looking for a full-stack developer to join our team and build amazing products.",
                applied: false,
                type: "Full Time",
                status: "Open"
            },
            {
                company: "Microsoft",
                role: "Front-end Developer",
                salary: "$110,000",
                deadline: "2026-06-01",
                logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
                tags: ["React", "TypeScript", "CSS"],
                requiredSkills: ["React", "CSS", "TypeScript"],
                description: "Join the Azure UI team to build scalable interfaces.",
                applied: false,
                type: "Full Time",
                status: "Open"
            },
            {
                company: "Amazon",
                role: "Data Analyst",
                salary: "$95,000",
                deadline: "2026-04-30",
                logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
                tags: ["Python", "SQL", "Tableau"],
                requiredSkills: ["Excel", "Power BI"],
                description: "Analyze vast amounts of data and provide actionable insights.",
                applied: false,
                type: "Internship",
                status: "Open"
            },
            {
                company: "Apple",
                role: "iOS Developer",
                salary: "$130,000",
                deadline: "2026-05-20",
                logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
                tags: ["Swift", "Objective-C"],
                requiredSkills: ["Swift"],
                description: "Develop seamless experiences for Apple users globally.",
                applied: false,
                type: "Full Time",
                status: "Open"
            }
        ]);
        console.log(`Created ${jobs.length} open job opportunities.`);

        // Create Applications
        const student1Doc = createdStudents.find(s => s.enrollmentNumber === "111");
        const student2Doc = createdStudents.find(s => s.enrollmentNumber === "222");
        const student3Doc = createdStudents.find(s => s.enrollmentNumber === "333");

        const applications = await Application.insertMany([
            {
                studentId: student1Doc._id,
                jobId: jobs[0]._id,
                studentName: student1Doc.fullName,
                company: jobs[0].company,
                role: jobs[0].role,
                logo: jobs[0].logo,
                status: "Applied",
                currentRound: "Applied",
                roundResult: "Pending",
                date: "2026-04-01"
            },
            {
                studentId: student1Doc._id,
                jobId: jobs[1]._id,
                studentName: student1Doc.fullName,
                company: jobs[1].company,
                role: jobs[1].role,
                logo: jobs[1].logo,
                status: "Shortlisted",
                currentRound: "Profile Screening",
                roundResult: "Cleared",
                date: "2026-04-03"
            },
            {
                studentId: student2Doc._id,
                jobId: jobs[2]._id,
                studentName: student2Doc.fullName,
                company: jobs[2].company,
                role: jobs[2].role,
                logo: jobs[2].logo,
                status: "Selected",
                currentRound: "HR Round",
                roundResult: "Cleared",
                date: "2026-03-15"
            },
            {
                studentId: student3Doc._id,
                jobId: jobs[0]._id,
                studentName: student3Doc.fullName,
                company: jobs[0].company,
                role: jobs[0].role,
                logo: jobs[0].logo,
                status: "Rejected",
                currentRound: "Technical Assessment",
                roundResult: "Rejected",
                date: "2026-04-05"
            }
        ]);
        console.log(`Created ${applications.length} applications.`);

        // Update applications counts in Student documents
        await Student.findByIdAndUpdate(student1Doc._id, { $set: { applicationsCount: 2 } });
        await Student.findByIdAndUpdate(student2Doc._id, { $set: { applicationsCount: 1 } });
        await Student.findByIdAndUpdate(student3Doc._id, { $set: { applicationsCount: 1 } });

        // Create Interviews
        await Interview.insertMany([
            {
                studentId: student1Doc._id,
                jobId: jobs[1]._id,
                studentName: student1Doc.fullName,
                company: jobs[1].company,
                role: jobs[1].role,
                logo: jobs[1].logo,
                date: "2026-04-10",
                time: "10:00 AM",
                mode: "Online",
                status: "Upcoming"
            },
            {
                studentId: student2Doc._id,
                jobId: jobs[2]._id,
                studentName: student2Doc.fullName,
                company: jobs[2].company,
                role: jobs[2].role,
                logo: jobs[2].logo,
                date: "2026-03-25",
                time: "02:00 PM",
                mode: "Offline",
                status: "Completed"
            }
        ]);
        console.log("Created interviews.");

        console.log("✅ Database seeded successfully with perfectly linked dummy data!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();
