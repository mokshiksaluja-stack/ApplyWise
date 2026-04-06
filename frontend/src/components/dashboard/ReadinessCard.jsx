import { Send } from "lucide-react";

export default function ReadinessCard({
  score = 0,
  title = "Readiness Score",
}) {
  const radius = 42;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (score / 100) * circumference;

  let label = "Not Ready";
  let colorClass = "text-red-600";
  let bgClass = "bg-red-500";
  let strokeColor = "#EF4444";
  let strokeBg = "#FEE2E2";

  if (score >= 70) {
    label = "Placement Ready";
    colorClass = "text-emerald-600";
    bgClass = "bg-emerald-500";
    strokeColor = "#10B981";
    strokeBg = "#D1FAE5";
  } else if (score >= 40) {
    label = "Partially Ready";
    colorClass = "text-amber-600";
    bgClass = "bg-amber-500";
    strokeColor = "#F59E0B";
    strokeBg = "#FEF3C7";
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

      <div className="mt-5 flex items-center justify-between gap-6 rounded-2xl bg-gray-50 p-4">
        <div className="relative h-32 w-32">
          <svg
            height="128"
            width="128"
            viewBox="0 0 100 100"
            className="-rotate-90"
          >
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={strokeBg}
              strokeWidth={stroke}
            />

            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm ${bgClass}`}>
              <Send size={22} />
            </div>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-4xl font-bold text-gray-900">{score}</p>

          <div className="mt-4 h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className={`h-2.5 rounded-full ${bgClass} transition-all duration-1000 ease-out`}
              style={{ width: `${score}%` }}
            />
          </div>

          <p className={`mt-3 text-sm font-semibold ${colorClass}`}>
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}