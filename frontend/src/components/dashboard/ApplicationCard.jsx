import { Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

export default function ApplicationCard({
  total = 4,
  active = 3,
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 border-l-4 border-blue-600 pl-3">Your Applications</h2>
        <Link to="/student/applications" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all
        </Link>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
          <Briefcase className="text-gray-600" size={22} />
        </div>

        <div>
          <p className="text-3xl font-bold text-gray-900">{total}</p>
          <p className="text-sm text-gray-500">{active} Active</p>
        </div>
      </div>

      <Link to="/student/applications" className="mt-6 block text-center w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition shadow-sm hover:shadow-md">
        Track all applications
      </Link>
    </div>
  );
}