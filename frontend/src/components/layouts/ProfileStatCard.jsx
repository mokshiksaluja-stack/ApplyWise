import { CheckCircle, TrendingUp, Briefcase } from "lucide-react";

export default function ProfileStatCard({
  value = 0,
  label = "Metric",
  suffix = "",
  trend = "",
  color = "blue"
}) {
  const isCompletion = label.includes("Completion");
  const isReadiness = label.includes("Readiness");
  
  const Icon = isCompletion ? CheckCircle : isReadiness ? TrendingUp : Briefcase;
  
  // Custom colors based on prop
  const colorMap = {
    blue: { text: "text-blue-500", bg: "bg-blue-500", ring: "#12A36D", fade: "#DDF3EC", light: "bg-emerald-500", title: "text-emerald-600" },
    indigo: { text: "text-indigo-500", bg: "bg-indigo-500", ring: "#6366f1", fade: "#e0e7ff", light: "bg-indigo-500", title: "text-indigo-600" },
    slate: { text: "text-slate-500", bg: "bg-slate-500", ring: "#64748b", fade: "#f1f5f9", light: "bg-slate-500", title: "text-slate-600" }
  };
  
  const c = colorMap[color] || colorMap.blue;

  if (isCompletion) {
    const percentage = Number(value) || 0;
    const radius = 42;
    const stroke = 10;
    const normalizedRadius = radius;
    const circumference = 2 * Math.PI * normalizedRadius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm premium-card">
        <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
        <div className="mt-5 flex items-center justify-between gap-6 rounded-2xl bg-gray-50 p-4">
          <div className="relative h-32 w-32 shrink-0">
            <svg height="128" width="128" viewBox="0 0 100 100" className="-rotate-90">
              <circle cx="50" cy="50" r={normalizedRadius} fill="none" stroke={c.fade} strokeWidth={stroke} />
              <circle cx="50" cy="50" r={normalizedRadius} fill="none" stroke={c.ring} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${c.bg} text-white shadow-sm`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
          <div className="flex-1 w-full">
            <p className="text-4xl font-bold text-gray-900">{percentage}{suffix}</p>
            <div className="mt-4 h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-2.5 rounded-full ${c.light}`} style={{ width: `${percentage}%` }} />
            </div>
            <p className={`mt-3 text-sm font-medium ${c.title}`}>{trend}</p>
          </div>
        </div>
      </div>
    );
  }

  // Non-circular standard cards for Readiness / Apps
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm premium-card flex flex-col justify-between">
      <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
      <div className="mt-5 flex items-center justify-between gap-6 rounded-2xl bg-gray-50 p-4 flex-1">
        <div className="flex-1">
          <p className="text-4xl font-bold text-gray-900">{value}{suffix}</p>
          <div className="mt-4 h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
             <div className={`h-2.5 rounded-full ${c.light}`} style={{ width: `${Number(value) > 100 ? 100 : Number(value) || 20}%` }} />
          </div>
          <p className={`mt-3 text-sm font-medium ${c.title}`}>{trend}</p>
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${c.bg} text-white shadow-sm shrink-0`}>
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}