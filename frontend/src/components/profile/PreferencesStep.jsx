const roleOptions = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Software Engineer",
  "Data Analyst",
  "Data Scientist",
  "ML Engineer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Cyber Security Analyst",
  "UI/UX Designer",
  "Product Analyst",
  "Business Analyst",
  "Marketing Executive",
  "Finance Analyst",
  "HR Associate",
];

const domainOptions = [
  "Software Development",
  "Data & Analytics",
  "Artificial Intelligence",
  "Cloud & DevOps",
  "Cyber Security",
  "Product Management",
  "Finance",
  "Consulting",
  "Sales & Marketing",
  "Operations",
  "EdTech",
  "Healthcare Tech",
  "E-commerce",
  "SaaS",
  "Startups",
];

const jobTypeOptions = ["Internship", "Full-time", "Both"];

const workModeOptions = ["On-site", "Remote", "Hybrid", "Open to Any"];

const locationOptions = [
  "Bangalore",
  "Gurgaon",
  "Noida",
  "Hyderabad",
  "Pune",
  "Mumbai",
  "Delhi",
  "Chennai",
  "Kolkata",
  "Open to Any",
];

const relocationOptions = ["Yes", "No", "Depends on Role"];

const compensationOptions = [
  "Open / Flexible",
  "Below ₹10,000/month",
  "₹10,000 – ₹20,000/month",
  "₹20,000 – ₹40,000/month",
  "₹40,000+/month",
  "Below ₹4 LPA",
  "₹4 – ₹6 LPA",
  "₹6 – ₹10 LPA",
  "₹10+ LPA",
];

const availabilityOptions = [
  "Immediately Available",
  "Available after current semester",
  "Only for internships right now",
  "Not actively available",
];

const companyTypeOptions = [
  "Startup",
  "Mid-size Company",
  "MNC",
  "Open to Any",
];

const offCampusOptions = [
  "Yes",
  "No",
  "Both On-Campus and Off-Campus",
];

export default function PreferencesStep({ formData, updateFormData, errors = {} }) {
  const toggleRole = (role) => {
    const alreadySelected = formData.interestedRoles.includes(role);

    if (alreadySelected) {
      updateFormData(
        "interestedRoles",
        formData.interestedRoles.filter((item) => item !== role)
      );
    } else {
      updateFormData("interestedRoles", [...formData.interestedRoles, role]);
    }
  };

  const toggleDomain = (domain) => {
    const alreadySelected = formData.preferredDomains.includes(domain);

    if (alreadySelected) {
      updateFormData(
        "preferredDomains",
        formData.preferredDomains.filter((item) => item !== domain)
      );
    } else {
      updateFormData("preferredDomains", [...formData.preferredDomains, domain]);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Career Preferences
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Define what kind of opportunities you are looking for so the platform can recommend better roles.
        </p>
      </div>

      {/* Interested Roles */}
      <div className="mb-8">
        <label className="mb-3 block text-sm font-medium text-gray-700">
          Interested Roles
        </label>
        {errors.interestedRoles && <p className="mb-2 text-sm text-red-500">{errors.interestedRoles}</p>}

        <div className="flex flex-wrap gap-3">
          {roleOptions.map((role) => {
            const selected = formData.interestedRoles.includes(role);

            return (
              <button
                type="button"
                key={role}
                onClick={() => toggleRole(role)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  selected
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : errors.interestedRoles ? "border-red-300 bg-white text-gray-700 hover:border-red-400" : "border-gray-200 bg-white text-gray-700 hover:border-blue-400"
                }`}
              >
                {role}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Preferred Job Type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Preferred Job Type
          </label>
          <select
            value={formData.preferredJobType}
            onChange={(e) => updateFormData("preferredJobType", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.preferredJobType ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select job type</option>
            {jobTypeOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.preferredJobType && <p className="mt-1 text-sm text-red-500">{errors.preferredJobType}</p>}
        </div>

        {/* Work Mode */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Preferred Work Mode
          </label>
          <select
            value={formData.preferredWorkMode}
            onChange={(e) => updateFormData("preferredWorkMode", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.preferredWorkMode ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select work mode</option>
            {workModeOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.preferredWorkMode && <p className="mt-1 text-sm text-red-500">{errors.preferredWorkMode}</p>}
        </div>

        {/* Location */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Preferred Location
          </label>
          <select
            value={formData.preferredLocation}
            onChange={(e) => updateFormData("preferredLocation", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.preferredLocation ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select location</option>
            {locationOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.preferredLocation && <p className="mt-1 text-sm text-red-500">{errors.preferredLocation}</p>}
        </div>

        {/* Relocation */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Open to Relocation
          </label>
          <select
            value={formData.openToRelocation}
            onChange={(e) => updateFormData("openToRelocation", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.openToRelocation ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select relocation preference</option>
            {relocationOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.openToRelocation && <p className="mt-1 text-sm text-red-500">{errors.openToRelocation}</p>}
        </div>

        {/* Compensation */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Expected Compensation
          </label>
          <select
            value={formData.expectedCompensation}
            onChange={(e) =>
              updateFormData("expectedCompensation", e.target.value)
            }
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.expectedCompensation ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select expected compensation</option>
            {compensationOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.expectedCompensation && <p className="mt-1 text-sm text-red-500">{errors.expectedCompensation}</p>}
        </div>

        {/* Availability */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Availability Status
          </label>
          <select
            value={formData.availabilityStatus}
            onChange={(e) => updateFormData("availabilityStatus", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.availabilityStatus ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select availability</option>
            {availabilityOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.availabilityStatus && <p className="mt-1 text-sm text-red-500">{errors.availabilityStatus}</p>}
        </div>

        {/* Company Type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Preferred Company Type
          </label>
          <select
            value={formData.preferredCompanyType}
            onChange={(e) =>
              updateFormData("preferredCompanyType", e.target.value)
            }
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.preferredCompanyType ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select company type</option>
            {companyTypeOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.preferredCompanyType && <p className="mt-1 text-sm text-red-500">{errors.preferredCompanyType}</p>}
        </div>

        {/* Off-Campus */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Interested in Off-Campus Opportunities?
          </label>
          <select
            value={formData.offCampusInterest}
            onChange={(e) => updateFormData("offCampusInterest", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.offCampusInterest ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select option</option>
            {offCampusOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.offCampusInterest && <p className="mt-1 text-sm text-red-500">{errors.offCampusInterest}</p>}
        </div>
      </div>

      {/* Preferred Domains */}
      <div className="mt-8">
        <label className="mb-3 block text-sm font-medium text-gray-700">
          Preferred Domains / Industries
        </label>
        {errors.preferredDomains && <p className="mb-2 text-sm text-red-500">{errors.preferredDomains}</p>}

        <div className="flex flex-wrap gap-3">
          {domainOptions.map((domain) => {
            const selected = formData.preferredDomains.includes(domain);

            return (
              <button
                type="button"
                key={domain}
                onClick={() => toggleDomain(domain)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  selected
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : errors.preferredDomains ? "border-red-300 bg-white text-gray-700 hover:border-red-400" : "border-gray-200 bg-white text-gray-700 hover:border-blue-400"
                }`}
              >
                {domain}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}