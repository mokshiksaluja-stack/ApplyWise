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
        
        const adminUser = await User.create({
            email: 'admin@college.edu',
            password: hashedPassword,
            role: 'admin'
        });

        const studentUsersData = [
            { email: 'student1@college.edu', password: hashedPassword, role: 'student' },
            { email: 'student2@college.edu', password: hashedPassword, role: 'student' },
            { email: 'student3@college.edu', password: hashedPassword, role: 'student' }
        ];
        const studentUsers = await User.insertMany(studentUsersData);

        // Create Students (Bypass validation due to many new required fields)
        const studentsData = [
            { _id: new mongoose.Types.ObjectId(), name: "John Doe", fullName: "John Doe", enrollmentNumber: "111", email: "student1@college.edu", course: "B.Tech Computer Science", year: "4th Year", status: "Not Placed" },
            { _id: new mongoose.Types.ObjectId(), name: "Jane Smith", fullName: "Jane Smith", enrollmentNumber: "222", email: "student2@college.edu", course: "B.Tech IT", year: "3rd Year", status: "Placed" },
            { _id: new mongoose.Types.ObjectId(), name: "Sam Wilson", fullName: "Sam Wilson", enrollmentNumber: "333", email: "student3@college.edu", course: "MBA", year: "2nd Year", status: "Not Placed" },
            { _id: new mongoose.Types.ObjectId(), name: "Emily Clark", fullName: "Emily Clark", enrollmentNumber: "444", email: "emily@college.edu", course: "B.Tech ECE", year: "4th Year", status: "Not Placed" },
            { _id: new mongoose.Types.ObjectId(), name: "Michael Gray", fullName: "Michael Gray", enrollmentNumber: "555", email: "michael@college.edu", course: "MCA", year: "3rd Year", status: "Placed" }
        ];
        await Student.collection.insertMany(studentsData);
        const students = studentsData;

        // Create Jobs
        const jobs = await Job.insertMany([
            {
                company: "Google",
                role: "Software Engineer",
                salary: "$120,000",
                deadline: "2026-05-15",
                logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
                tags: ["React", "Node.js", "MongoDB"],
                description: "Looking for a full-stack developer to join our team and build amazing products.",
                applied: false,
                type: "Full Time"
            },
            {
                company: "Microsoft",
                role: "Front-end Developer",
                salary: "$110,000",
                deadline: "2026-06-01",
                logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
                tags: ["React", "TypeScript", "CSS"],
                description: "Join the Azure UI team to build scalable interfaces.",
                applied: false,
                type: "Full Time"
            },
            {
                company: "Amazon",
                role: "Data Analyst",
                salary: "$95,000",
                deadline: "2026-04-30",
                logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
                tags: ["Python", "SQL", "Tableau"],
                description: "Analyze vast amounts of data and provide actionable insights.",
                applied: false,
                type: "Internship"
            },
            {
                company: "Apple",
                role: "iOS Developer",
                salary: "$130,000",
                deadline: "2026-05-20",
                logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
                tags: ["Swift", "Objective-C"],
                description: "Develop seamless experiences for Apple users globally.",
                applied: false,
                type: "Full Time"
            }
        ]);

        // Create Applications
        const applications = await Application.insertMany([
            {
                studentId: students[0]._id,
                jobId: jobs[0]._id,
                studentName: students[0].name,
                company: jobs[0].company,
                role: jobs[0].role,
                logo: jobs[0].logo,
                status: "Applied",
                date: "2026-04-01"
            },
            {
                studentId: students[0]._id,
                jobId: jobs[1]._id,
                studentName: students[0].name,
                company: jobs[1].company,
                role: jobs[1].role,
                logo: jobs[1].logo,
                status: "Shortlisted",
                date: "2026-04-03"
            },
            {
                studentId: students[1]._id,
                jobId: jobs[2]._id,
                studentName: students[1].name,
                company: jobs[2].company,
                role: jobs[2].role,
                logo: jobs[2].logo,
                status: "Selected",
                date: "2026-03-15"
            },
            {
                studentId: students[2]._id,
                jobId: jobs[0]._id,
                studentName: students[2].name,
                company: jobs[0].company,
                role: jobs[0].role,
                logo: jobs[0].logo,
                status: "Rejected",
                date: "2026-04-05"
            }
        ]);

        // Create Interviews
        const interviews = await Interview.insertMany([
            {
                studentId: students[0]._id,
                jobId: jobs[1]._id,
                studentName: students[0].name,
                company: jobs[1].company,
                role: jobs[1].role,
                logo: jobs[1].logo,
                date: "2026-04-10",
                time: "10:00 AM",
                mode: "Online",
                status: "Upcoming"
            },
            {
                studentId: students[1]._id,
                jobId: jobs[2]._id,
                studentName: students[1].name,
                company: jobs[2].company,
                role: jobs[2].role,
                logo: jobs[2].logo,
                date: "2026-03-25",
                time: "02:00 PM",
                mode: "Offline",
                status: "Completed"
            },
            {
                studentId: students[3]._id,
                jobId: jobs[3]._id,
                studentName: students[3].name,
                company: jobs[3].company,
                role: jobs[3].role,
                logo: jobs[3].logo,
                date: "2026-04-12",
                time: "11:30 AM",
                mode: "Online",
                status: "Upcoming"
            }
        ]);

        console.log("Database seeded successfully with dummy data!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();
