export const applicationsData = [
  {
    id: 1,
    company: "TCS",
    role: "System Engineer",
    appliedDate: "10 Oct 2023",
    status: "Interview Scheduled",
    currentRound: "Technical Interview SR-1",
    interviewDate: "24 Oct 2023",
    roomNumber: "Block A - Room 302",
    reportingTime: "09:30 AM",
    roundHistory: [
      { name: "Aptitude Test", result: "Cleared", date: "12 Oct 2023" },
      { name: "Coding Round", result: "Cleared", date: "18 Oct 2023" }
    ],
    instructions: "Arrive 30 minutes early. Ensure your laptop is fully charged. Formal attire is mandatory.",
    documents: ["Updated Resume (3 copies)", "College ID", "10th/12th Marksheets Original"],
    coordinatorUpdate: "Technical round focuses heavily on core Java and DBMS. Review normalization forms."
  },
  {
    id: 2,
    company: "Wipro",
    role: "Project Engineer",
    appliedDate: "15 Oct 2023",
    status: "Shortlisted",
    currentRound: "Online Aptitude Test",
    interviewDate: "28 Oct 2023",
    roomNumber: "Computer Lab 2",
    reportingTime: "11:00 AM",
    roundHistory: [
      { name: "Resume Screening", result: "Cleared", date: "16 Oct 2023" }
    ],
    instructions: "Test will be conducted on the AMCAT platform. Rough sheets will be provided.",
    documents: ["Hall Ticket", "Digital copy of Resume", "Aadhar Card"],
    coordinatorUpdate: "Test links will be emailed one day prior directly by Wipro. Check spam folders."
  },
  {
    id: 3,
    company: "Infosys",
    role: "Specialist Programmer",
    appliedDate: "05 Sep 2023",
    status: "Selected",
    currentRound: "HR Interview",
    interviewDate: "20 Sep 2023",
    roomNumber: "Online WebEx",
    reportingTime: "02:00 PM",
    roundHistory: [
      { name: "Online Hackathon", result: "Cleared", date: "10 Sep 2023" },
      { name: "Technical Interview", result: "Cleared", date: "15 Sep 2023" },
      { name: "HR Interview", result: "Cleared", date: "20 Sep 2023" }
    ],
    instructions: "Congratulations! Wait for the official offer letter email from the HR department.",
    documents: ["Offer Acceptance Form", "Bank Passport/Cancelled Cheque", "Passport Size Photos"],
    coordinatorUpdate: "Please do NOT apply to further tier-2 companies as per college placement policy."
  },
  {
    id: 4,
    company: "Cognizant",
    role: "GenC Developer",
    appliedDate: "02 Oct 2023",
    status: "Rejected",
    currentRound: "Technical Interview",
    interviewDate: "12 Oct 2023",
    roomNumber: "Block D - Room 104",
    reportingTime: "10:00 AM",
    roundHistory: [
        { name: "Aptitude Test", result: "Cleared", date: "05 Oct 2023" },
        { name: "Technical Interview", result: "Failed", date: "12 Oct 2023" }
    ],
    instructions: "Candidate did not clear technical round 1.",
    documents: [],
    coordinatorUpdate: "Work on Object Oriented Programming concepts. Next batch of mass recruiters is coming next month."
  },
  {
    id: 5,
    company: "Accenture",
    role: "Advanced App Engineering Analyst",
    appliedDate: "26 Oct 2023",
    status: "Applied",
    currentRound: "Resume Screening",
    interviewDate: "TBD",
    roomNumber: "TBD",
    reportingTime: "TBD",
    roundHistory: [],
    instructions: "Your profile is under review by the hiring manager.",
    documents: ["Default Profile Resume"],
    coordinatorUpdate: "Company usually takes 2 weeks to release the shortlist. Keep preparing."
  }
];
