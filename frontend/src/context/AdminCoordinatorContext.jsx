import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { dashboardData } from "../models/data";
import { assignCoordinatorApi, fetchOpportunities } from "../services/api";

const AdminCoordinatorContext = createContext();

const getLoggedInCoordinatorId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) return user.id;
  } catch {}
  return "60d5ecb8b392d700153abcd1"; // Dev fallback
};

export function AdminCoordinatorProvider({ children }) {
  const [opportunities, setOpportunities] = useState([]);
  const [coordinators, setCoordinators] = useState(dashboardData.coordinators);

  useEffect(() => {
    const loadRealData = async () => {
      try {
        const { data } = await fetchOpportunities();
        setOpportunities(data.map(opp => ({
          ...opp,
          id: opp._id, // map for Admin UI compatibility
          type: opp.opportunityType || 'Full-time' // Admin UI expects 'type'
        })));
      } catch (err) {
        console.error("Failed to load opportunities for context", err);
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
