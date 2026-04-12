export const dashboardData = {
  stats: [
    { id: 1, title: "Students Registered", value: "820", subtext: "19 Students", trend: "+5.2%", isPositive: true, iconType: "users" },
    { id: 2, title: "Total Applications", value: "156", subtext: "1559 jobs", trend: "+7.8%", isPositive: true, iconType: "file-text" },
    { id: 3, title: "Interview Scheduled", value: "14", subtext: "23:4:278 stoles", trend: "+2.9%", isPositive: true, iconType: "calendar" }
  ],
  opportunities: [
    { id: 1, company: "Google", role: "Software Engineer Intern", salary: "₹25-40 LPA", deadline: "Apply bf-day", logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg", tags: ["Eligible"], description: "Join Google's Core Engineering team to build the next generation of Search infrastructure.", applied: false, type: "Backend" },
    { id: 2, company: "Amazon", role: "Backend Developer", salary: "₹15-25 LPA", deadline: "Reply ed + 1s", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", tags: [], description: "Come build the future of AWS with our cloud storage team.", applied: false, type: "Backend" },
    { id: 3, company: "Infosys", role: "Data Analyst Internship", salary: "₹120-25k/mth", deadline: "", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg", tags: [], description: "Analyze large datasets to derive business insights for enterprise clients.", applied: false, type: "Data Analyst" },
    { id: 4, company: "Microsoft", role: "Frontend Developer Intern", salary: "₹20-30 LPA", deadline: "Apply by 15 June", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", tags: ["Remote"], description: "Work on the latest React and Fluent UI components for Office 365.", applied: false, type: "Frontend" },
    { id: 5, company: "Flipkart", role: "Data Scientist Intern", salary: "₹18-28 LPA", deadline: "Apply by 20 June", logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg", tags: ["Eligible"], description: "Build recommendation engines and optimize supply chain algorithms.", applied: false, type: "Data Analyst" },
    { id: 6, company: "Netflix", role: "Senior Frontend Engineer", salary: "₹50-80 LPA", deadline: "Apply soon", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", tags: ["Onsite"], description: "Create immersive UI experiences for millions of streaming users.", applied: false, type: "Frontend" },
  ],
  tasks: [
    { id: 1, title: "Coordinate Google Interviews", assignee: "Rahul Sharma", dueDate: "24 May 2024", status: "In Progress", description: "Reach out to 15 shortlisted candidates for the Google SE Internship and schedule their technical screening rounds." },
    { id: 2, title: "Update Round Results for Amazon", assignee: "Priya Singh", dueDate: "23 May 2024", status: "Pending", description: "Download the Amazon Online Assessment results CSV from their portal and update the local database with pass/fail statuses." },
    { id: 3, title: "Schedule Infosys HR Interview", assignee: "Amit Patel", dueDate: "22 May 2024", status: "Completed", description: "Finalize the HR interview slots for all cleared candidates. Send out the Zoom links and confirm attendance." },
    { id: 4, title: "Onboard new coordinater batch", assignee: "Ravi Kumar", dueDate: "30 May 2024", status: "Pending", description: "Provide access credentials and run through the SOP for the 2025 placement season." },
    { id: 5, title: "Draft Placement Report 2024", assignee: "Neha Gupta", dueDate: "05 Jun 2024", status: "In Progress", description: "Compile placement statistics, highest packages, and company-wise demographics for the annual report." },
  ],
  coordinators: [
    { id: "60d5ecb8b392d700153abcd1", name: "Rahul Sharma", rating: "4.8", tasksCompleted: "100", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: "60d5ecb8b392d700153abcd2", name: "Priya Singh", rating: "4.5", tasksCompleted: "103", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: "60d5ecb8b392d700153abcd3", name: "Amit Patel", rating: "4.3", tasksCompleted: "98", avatar: "https://randomuser.me/api/portraits/men/67.jpg" },
    { id: "60d5ecb8b392d700153abcd4", name: "Ravi Kumar", rating: "4.9", tasksCompleted: "150", avatar: "https://randomuser.me/api/portraits/men/22.jpg" },
    { id: "60d5ecb8b392d700153abcd5", name: "Neha Gupta", rating: "4.7", tasksCompleted: "112", avatar: "https://randomuser.me/api/portraits/women/68.jpg" }
  ],
  students: [
    { id: 1, name: "Arun Verma", email: "arun.v@college.edu", course: "B.Tech Computer Science", year: "4th Year", status: "Placed" },
    { id: 2, name: "Sneha Rao", email: "sneha.r@college.edu", course: "B.Tech Information Technology", year: "4th Year", status: "Not Placed" },
    { id: 3, name: "Rohan Desai", email: "rohan.d@college.edu", course: "B.Tech Electronics", year: "3rd Year", status: "Not Placed" },
    { id: 4, name: "Pooja Mishra", email: "pooja.m@college.edu", course: "MCA", year: "Final Year", status: "Placed" },
    { id: 5, name: "Vikram Singh", email: "vikram.s@college.edu", course: "B.Tech Computer Science", year: "4th Year", status: "Not Placed" }
  ],
  applications: [
    { id: 1, studentName: "Arun Verma", company: "Google", role: "Software Engineer Intern", status: "Shortlisted", date: "15 May 2024", logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" },
    { id: 2, studentName: "Sneha Rao", company: "Amazon", role: "Backend Developer", status: "Applied", date: "18 May 2024", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { id: 3, studentName: "Rohan Desai", company: "Microsoft", role: "Frontend Developer Intern", status: "Rejected", date: "10 May 2024", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
    { id: 4, studentName: "Pooja Mishra", company: "Flipkart", role: "Data Scientist Intern", status: "Shortlisted", date: "20 May 2024", logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg" },
    { id: 5, studentName: "Vikram Singh", company: "Infosys", role: "Data Analyst Internship", status: "Applied", date: "22 May 2024", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" }
  ],
  interviews: [
    { id: 1, studentName: "Arun Verma", company: "Google", role: "Software Engineer Intern", date: "28 May 2024", time: "10:00 AM - 11:00 AM", mode: "Online", status: "Upcoming", logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" },
    { id: 2, studentName: "Pooja Mishra", company: "Flipkart", role: "Data Scientist Intern", date: "02 Jun 2024", time: "02:00 PM - 03:30 PM", mode: "Offline", status: "Upcoming", logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg" },
    { id: 3, studentName: "Arun Verma", company: "Microsoft", role: "Frontend Developer Intern", date: "05 Jun 2024", time: "11:00 AM - 12:00 PM", mode: "Online", status: "Completed", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" }
  ],
  taskDistribution: [
    { name: "Pending", value: 35, color: "#3B82F6" },
    { name: "In Progress", value: 25, color: "#10B981" },
    { name: "Completed", value: 40, color: "#F59E0B" }
  ],
  applicationOverview: [
    { month: "Jan", applications: 35, placements: 25, trend: 20 },
    { month: "Feb", applications: 40, placements: 30, trend: 35 },
    { month: "Mar", applications: 55, placements: 40, trend: 45 },
    { month: "Apr", applications: 65, placements: 60, trend: 55 },
    { month: "May", applications: 85, placements: 70, trend: 75 },
    { month: "Jun", applications: 120, placements: 90, trend: 85 }
  ],
  analyticsSummary: {
    totalApplied: 452,
    totalSelected: 128,
    successRate: "28.3%",
    activeInterviews: 45
  },
  notifications: [
    { id: 1, text: "New job posted: Software Engineer Intern at Google", time: "2 hours ago", read: false, type: "job", linkId: 1 },
    { id: 2, text: "Interview scheduled for Frontend Developer Intern", time: "5 hours ago", read: false, type: "interview", linkId: null },
    { id: 3, text: "Application status updated: Data Scientist Intern", time: "1 day ago", read: true, type: "application", linkId: null }
  ],
  messages: [
    { 
      id: 1, 
      sender: "Google HR", 
      company: "Google", 
      avatar: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
      preview: "Your interview is scheduled tomorrow.", 
      time: "10 min ago", 
      unread: true,
      thread: [
        { id: 101, text: "Hi, congratulations on passing the initial screening!", sender: "Google HR", time: "Yesterday, 10:00 AM", isSender: false },
        { id: 102, text: "Thank you! I'm looking forward to the next steps.", sender: "You", time: "Yesterday, 10:30 AM", isSender: true },
        { id: 103, text: "Your interview is scheduled tomorrow at 10 AM PST. Please confirm.", sender: "Google HR", time: "10 min ago", isSender: false }
      ]
    },
    { 
      id: 2, 
      sender: "Neha Gupta", 
      company: "Placement Coordinator", 
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      preview: "Please upload your updated resume.", 
      time: "2h ago", 
      unread: true,
      thread: [
        { id: 201, text: "Hi, we are compiling resumes for the upcoming Microsoft drive.", sender: "Neha Gupta", time: "2h ago", isSender: false },
        { id: 202, text: "Please upload your updated resume by EOD today on the portal.", sender: "Neha Gupta", time: "2h ago", isSender: false }
      ]
    },
    { 
      id: 3, 
      sender: "Amazon Campus Team", 
      company: "Amazon", 
      avatar: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      preview: "Your application has been shortlisted.", 
      time: "1 day ago", 
      unread: false,
      thread: [
        { id: 301, text: "We are pleased to inform you that your application has been shortlisted for the Backend Developer role.", sender: "Amazon Campus Team", time: "1 day ago", isSender: false },
        { id: 302, text: "You will receive an assessment link shortly.", sender: "Amazon Campus Team", time: "1 day ago", isSender: false }
      ]
    }
  ]
};
