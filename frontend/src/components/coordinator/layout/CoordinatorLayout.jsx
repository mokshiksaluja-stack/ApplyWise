import { Outlet } from "react-router-dom";
import CoordinatorSidebar from "./CoordinatorSidebar";
import CoordinatorTopNavbar from "./CoordinatorTopNavbar";

export default function CoordinatorLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <CoordinatorSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <CoordinatorTopNavbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8 relative">
          <div className="mx-auto max-w-7xl h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
