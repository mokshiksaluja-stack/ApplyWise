import { createContext, useContext, useState, useCallback } from "react";
import {
  fetchApplications,
  updateAppStatusApi,
  scheduleInterviewApi,
  markAttendanceApi,
} from "../services/api";
import { applicationsData } from "../data/dummyApplications";

const PlacementContext = createContext();

// Seed shape: local dummy data seeded for the logged-in student
const buildLocalSeed = () => [
  ...applicationsData.map((app) => ({
    ...app,
    studentId: "user_me",
    studentName: "Mokshik Saluja",
    rollNo: "20CS054",
    branch: "Computer Science",
    cgpa: 8.6,
    skillMatch: 90,
    attendance: "Pending",
  })),
  {
    id: "app_201", studentId: "stu_10", studentName: "Sneha Patel",
    rollNo: "20IT112", branch: "Information Tech", cgpa: 9.1, skillMatch: 88,
    company: "Google", role: "Software Engineer", status: "Shortlisted",
    currentRound: "Online Assessment", interviewDate: "Tomorrow",
    roomNumber: "TBD", reportingTime: "10:00 AM", roundHistory: [],
    instructions: "Check your portal.", documents: [], coordinatorUpdate: "", attendance: "Pending",
  },
  {
    id: "app_202", studentId: "stu_11", studentName: "Arjun Singh",
    rollNo: "20ME005", branch: "Mechanical", cgpa: 7.2, skillMatch: 60,
    company: "Atlassian", role: "Backend Engineer", status: "In Progress",
    currentRound: "Resume Screening", interviewDate: "TBD",
    roomNumber: "TBD", reportingTime: "TBD", roundHistory: [],
    instructions: "", documents: [], coordinatorUpdate: "", attendance: "Pending",
  },
];

export function PlacementProvider({ children }) {
  const [globalApplications, setGlobalApplications] = useState(buildLocalSeed);

  // Optimistic updater — applies locally immediately, calls API in background
  const optimisticUpdate = useCallback((appId, patch) => {
    setGlobalApplications((prev) =>
      prev.map((app) => (app.id === appId || app._id === appId ? { ...app, ...patch } : app))
    );
  }, []);

  // ── updateApplicationStatus ────────────────────────────────────────────
  const updateApplicationStatus = useCallback(async (appId, newStatus) => {
    optimisticUpdate(appId, { status: newStatus });
    try {
      await updateAppStatusApi(appId, { status: newStatus });
    } catch {
      // Backend unavailable — optimistic state already applied (dummy mode)
    }
  }, [optimisticUpdate]);

  // ── updateCurrentRound ─────────────────────────────────────────────────
  const updateCurrentRound = useCallback(async (appId, newRoundName, lastRoundResult) => {
    setGlobalApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId && app._id !== appId) return app;
        const historyEntry = app.currentRound
          ? { name: app.currentRound, result: lastRoundResult, date: "Just Now" }
          : null;
        return {
          ...app,
          roundHistory: historyEntry ? [...(app.roundHistory || []), historyEntry] : (app.roundHistory || []),
          currentRound: newRoundName,
        };
      })
    );
    try {
      await updateAppStatusApi(appId, { currentRound: newRoundName, roundResult: lastRoundResult });
    } catch {
      // Fallback silent — local state is authoritative
    }
  }, []);

  // ── markAttendance ────────────────────────────────────────────────────
  const markAttendance = useCallback(async (appId, attendanceMark) => {
    optimisticUpdate(appId, { attendance: attendanceMark });
    try {
      await markAttendanceApi(appId, attendanceMark);
    } catch {
      // Silent fallback
    }
  }, [optimisticUpdate]);

  // ── scheduleInterview ──────────────────────────────────────────────────
  const scheduleInterview = useCallback(async (appId, newDate, newTime, venue) => {
    optimisticUpdate(appId, {
      interviewDate: newDate,
      reportingTime: newTime,
      roomNumber: venue,
      status: "Interview Scheduled",
    });
    try {
      await scheduleInterviewApi(appId, { interviewDate: newDate, reportingTime: newTime, roomNumber: venue });
    } catch {
      // Silent fallback
    }
  }, [optimisticUpdate]);

  return (
    <PlacementContext.Provider
      value={{
        globalApplications,
        myApplications: globalApplications.filter((a) => a.studentId === "user_me"),
        updateApplicationStatus,
        updateCurrentRound,
        markAttendance,
        scheduleInterview,
      }}
    >
      {children}
    </PlacementContext.Provider>
  );
}

export function usePlacementContext() {
  return useContext(PlacementContext);
}
