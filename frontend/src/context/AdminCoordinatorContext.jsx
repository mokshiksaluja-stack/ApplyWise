import { createContext, useContext, useState, useCallback } from "react";
import { opportunitiesList } from "../data/dummyOpportunities";
import { dashboardData } from "../models/data";
import { assignCoordinatorApi } from "../services/api";

const AdminCoordinatorContext = createContext();

const CURRENT_COORDINATOR_ID = 1;

const initialOpportunities = opportunitiesList.map((opp, idx) => ({
  ...opp,
  assignedCoordinatorId: idx === 0 ? CURRENT_COORDINATOR_ID : null,
}));

export function AdminCoordinatorProvider({ children }) {
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [coordinators, setCoordinators] = useState(dashboardData.coordinators);

  // ── assignDrive ──────────────────────────────────────────────────────────
  const assignDrive = useCallback(async (opportunityId, coordinatorId) => {
    // Optimistic local update first
    setOpportunities((prev) =>
      prev.map((opp) =>
        opp.id === opportunityId ? { ...opp, assignedCoordinatorId: coordinatorId } : opp
      )
    );
    try {
      // Use MongoDB _id if available, otherwise fall through silently
      const mongoId = opportunities.find((o) => o.id === opportunityId)?._id;
      if (mongoId) await assignCoordinatorApi(mongoId, coordinatorId);
    } catch {
      // Silent — optimistic state is authoritative during dummy mode
    }
  }, [opportunities]);

  // ── reassignDrive ────────────────────────────────────────────────────────
  const reassignDrive = useCallback((opportunityId, newCoordinatorId) => {
    assignDrive(opportunityId, newCoordinatorId);
  }, [assignDrive]);

  // ── unassignDrive ────────────────────────────────────────────────────────
  const unassignDrive = useCallback(async (opportunityId) => {
    setOpportunities((prev) =>
      prev.map((opp) =>
        opp.id === opportunityId ? { ...opp, assignedCoordinatorId: null } : opp
      )
    );
    try {
      const mongoId = opportunities.find((o) => o.id === opportunityId)?._id;
      if (mongoId) await assignCoordinatorApi(mongoId, null);
    } catch {
      // Silent
    }
  }, [opportunities]);

  // ── logCoordinatorActivity ───────────────────────────────────────────────
  const logCoordinatorActivity = useCallback((coordinatorId, activityType) => {
    setCoordinators((prev) =>
      prev.map((coord) => {
        if (coord.id !== coordinatorId) return coord;
        const count = parseInt(coord.tasksCompleted) || 0;
        const increment = ['TASK_COMPLETED', 'SCHEDULED_INTERVIEW'].includes(activityType) ? 1 : 0;
        return { ...coord, tasksCompleted: (count + increment).toString() };
      })
    );
  }, []);

  return (
    <AdminCoordinatorContext.Provider
      value={{
        currentCoordinatorId: CURRENT_COORDINATOR_ID,
        sharedOpportunities: opportunities,
        coordinators,
        assignDrive,
        reassignDrive,
        unassignDrive,
        logCoordinatorActivity,
      }}
    >
      {children}
    </AdminCoordinatorContext.Provider>
  );
}

export function useAdminCoordinatorContext() {
  return useContext(AdminCoordinatorContext);
}
