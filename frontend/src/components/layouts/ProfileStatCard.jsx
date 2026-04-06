// export default function StatCard({ title, value, description }) {
//   return (
//     <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
//       <p className="text-sm text-gray-500">{title}</p>
//       <h3 className="mt-2 text-3xl font-bold text-gray-900">{value}</h3>
//       <p className="mt-2 text-sm text-gray-500">{description}</p>
//     </div>
//   );
// }



import { CheckCircle } from "lucide-react";

export default function ProfileStatCard({
  percentage = 40,
  title = "Profile Completion",
}) {
  const radius = 42;
  const stroke = 10;
  const normalizedRadius = radius;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

      <div className="mt-5 flex items-center justify-between gap-6 rounded-2xl bg-gray-50 p-4">
        {/* Circular Progress */}
        <div className="relative h-32 w-32">
          <svg
            height="128"
            width="128"
            viewBox="0 0 100 100"
            className="-rotate-90"
          >
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r={normalizedRadius}
              fill="none"
              stroke="#DDF3EC"
              strokeWidth={stroke}
            />

            {/* Progress ring */}
            <circle
              cx="50"
              cy="50"
              r={normalizedRadius}
              fill="none"
              stroke="#12A36D"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-sm">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>

        {/* Right side info */}
        <div className="flex-1">
          <p className="text-4xl font-bold text-gray-900">{percentage}%</p>

          <div className="mt-4 h-2.5 w-full rounded-full bg-gray-200">
            <div
              className="h-2.5 rounded-full bg-emerald-500"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className="mt-3 text-sm font-medium text-emerald-600">
            Good progress
          </p>
        </div>
      </div>
    </div>
  );
}