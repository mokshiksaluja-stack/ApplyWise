export default function OpportunityCard({
  company,
  role,
  stipend,
  dynamicStatus = "Not Eligible",
  matchedCount = 0,
  totalCount = 0,
  missingSkills = [],
  onViewDetails,
}) {
  let statusStyle = "bg-green-100 text-green-700";
  if (dynamicStatus === "Partially Ready") statusStyle = "bg-yellow-100 text-yellow-700";
  if (dynamicStatus === "Not Eligible") statusStyle = "bg-red-100 text-red-700";

  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{company}</h3>
          <p className="mt-1 text-sm font-medium text-gray-600">{role}</p>
        </div>

        <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${statusStyle}`}>
          {dynamicStatus}
        </span>
      </div>

      <div className="mt-5 flex-1">
        <p className="text-sm font-semibold text-gray-700">
          You match <span className="text-blue-600">{matchedCount}/{totalCount}</span> required skills
        </p>
        
        {missingSkills.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-semibold text-red-500">Missing:</span>
             {missingSkills.map(skill => (
                <span key={skill} className="rounded-md border border-red-100 bg-red-50 px-2 py-0.5 font-medium text-red-600">
                   {skill}
                </span>
             ))}
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4">
        <p className="text-base font-bold text-gray-800">{stipend}</p>
        <button 
          onClick={onViewDetails}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 hover:shadow-sm"
        >
            View Details
        </button>
      </div>
    </div>
  );
}