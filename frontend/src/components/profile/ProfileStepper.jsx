const steps = [
  "Personal Info",
  "Academic Info",
  "Skills",
  "Preferences",
  "Links",
];

export default function ProfileStepper({ currentStep }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">
          Step {currentStep} of 5
        </h2>
        <span className="text-sm text-gray-500">
          Profile Setup Progress
        </span>
      </div>

      <div className="mb-4 h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${(currentStep / 5) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-5 gap-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;

          return (
            <div
              key={step}
              className={`rounded-xl px-3 py-2 text-center text-xs font-medium ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : isCompleted
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-50 text-gray-500"
              }`}
            >
              {step}
            </div>
          );
        })}
      </div>
    </div>
  );
}