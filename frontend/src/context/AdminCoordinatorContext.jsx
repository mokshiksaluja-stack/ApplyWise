import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { assignCoordinatorApi, fetchOpportunities, fetchCoordinatorList } from "../services/api";

const AdminCoordinatorContext = createContext();

const getLoggedInCoordinatorId = () => {
  return localStorage.getItem('userId') || null;
};

export function AdminCoordinatorProvider({ children }) {
  const [opportunities, setOpportunities] = useState([]);
  const [coordinators, setCoordinators] = useState([]);

  const loadRealData = useCallback(async () => {
    try {
      const [oppRes, coordRes] = await Promise.all([
         fetchOpportunities(),
         fetchCoordinatorList()
      ]);
      
      setOpportunities(oppRes.data.map(opp => ({
        ...opp,
        id: opp._id,
        type: opp.opportunityType || 'Full-time'
      })));
      
      if (Array.isArray(coordRes.data)) {
        setCoordinators(coordRes.data);
      }
    } catch (err) {
      console.error("Failed to load data for context", err);
    }
  }, []);

  useEffect(() => {
    loadRealData();
  }, [loadRealData]);

  // ── assignDrive ──────────────────────────────────────────────────────────
  const assignDrive = useCallback(async (opportunityId, coordinatorId) => {
    const coordName = coordinators.find(c => c.id === coordinatorId)?.name || "";

    // Optimistic local update first
    setOpportunities((prev) =>
      prev.map((opp) =>
        opp.id === opportunityId ? { ...opp, assignedCoordinatorId: coordinatorId, assignedCoordinatorName: coordName } : opp
      )
    );
    try {
      if (opportunityId) await assignCoordinatorApi(opportunityId, coordinatorId, coordName);
    } catch (err) {
      console.error("Assignment failed", err);
    }
  }, [coordinators]);

  // ── reassignDrive ────────────────────────────────────────────────────────
  const reassignDrive = useCallback((opportunityId, newCoordinatorId) => {
    assignDrive(opportunityId, newCoordinatorId);
  }, [assignDrive]);

  // ── unassignDrive ────────────────────────────────────────────────────────
  const unassignDrive = useCallback(async (opportunityId) => {
    setOpportunities((prev) =>
      prev.map((opp) =>
        opp.id === opportunityId ? { ...opp, assignedCoordinatorId: null, assignedCoordinatorName: null } : opp
      )
    );
    try {
      if (opportunityId) await assignCoordinatorApi(opportunityId, null, null);
    } catch (err) {
       console.error("Unassignment failed", err);
    }
  }, []);

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
        currentCoordinatorId: getLoggedInCoordinatorId(),
        sharedOpportunities: opportunities,
        coordinators,
        assignDrive,
        reassignDrive,
        unassignDrive,
        logCoordinatorActivity,
        refreshOpportunities: loadRealData,
      }}
    >
      {children}
    </AdminCoordinatorContext.Provider>
  );
}

export function useAdminCoordinatorContext() {
  return useContext(AdminCoordinatorContext);
}
