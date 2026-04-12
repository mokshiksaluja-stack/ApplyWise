import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { assignCoordinatorApi, fetchOpportunities, fetchCoordinatorMonitoring } from "../services/api";

const AdminCoordinatorContext = createContext();

const getLoggedInCoordinatorId = () => {
  return localStorage.getItem('userId') || null;
};

export function AdminCoordinatorProvider({ children }) {
  const [opportunities, setOpportunities] = useState([]);
  const [coordinators, setCoordinators] = useState([]);

  useEffect(() => {
    const loadRealData = async () => {
      try {
        const [oppRes, monitoringRes] = await Promise.all([
           fetchOpportunities(),
           fetchCoordinatorMonitoring()
        ]);
        
        setOpportunities(oppRes.data.map(opp => ({
          ...opp,
          id: opp._id, // map for Admin UI compatibility
          type: opp.opportunityType || 'Full-time' // Admin UI expects 'type'
        })));
        
        if (monitoringRes.data && monitoringRes.data.fullMetrics) {
           setCoordinators(monitoringRes.data.fullMetrics.map(m => ({
              id: m.coordinatorId,
              name: m.name,
              email: m.email,
              tasksCompleted: m.stats?.totalActions || 0,
              tier: m.tier
           })));
        }
      } catch (err) {
        console.error("Failed to load data for context", err);
      }
    };
    loadRealData();
  }, []);

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
      }}
    >
      {children}
    </AdminCoordinatorContext.Provider>
  );
}

export function useAdminCoordinatorContext() {
  return useContext(AdminCoordinatorContext);
}
