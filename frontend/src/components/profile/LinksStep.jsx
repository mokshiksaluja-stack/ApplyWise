const resumeStatusOptions = [
  "Updated Recently",
  "Needs Update",
  "Not Uploaded Yet",
];

const additionalPlatformOptions = [
  "None",
  "HackerRank",
  "CodeChef",
  "Codeforces",
  "Kaggle",
  "Behance",
  "Dribbble",
  "Other",
];

const visibilityOptions = [
  "Yes",
  "No",
  "Only for Placement Cell",
];

export default function LinksStep({ formData, updateFormData, errors = {} }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Resume & Professional Links
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Add your professional links to improve visibility and strengthen your placement profile.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Resume Link */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Resume Link
          </label>
          <input
            type="text"
            value={formData.resumeLink}
            onChange={(e) => updateFormData("resumeLink", e.target.value)}
            placeholder="Paste Google Drive / PDF resume link"
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.resumeLink ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          />
          {errors.resumeLink && <p className="mt-1 text-sm text-red-500">{errors.resumeLink}</p>}
        </div>

        {/* Resume Status */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Resume Status
          </label>
          <select
            value={formData.resumeStatus}
            onChange={(e) => updateFormData("resumeStatus", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.resumeStatus ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select resume status</option>
            {resumeStatusOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.resumeStatus && <p className="mt-1 text-sm text-red-500">{errors.resumeStatus}</p>}
        </div>

        {/* Profile Visibility */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Public Profile Visibility
          </label>
          <select
            value={formData.profileVisibility}
            onChange={(e) => updateFormData("profileVisibility", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.profileVisibility ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select visibility</option>
            {visibilityOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.profileVisibility && <p className="mt-1 text-sm text-red-500">{errors.profileVisibility}</p>}
        </div>

        {/* LinkedIn */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            LinkedIn Profile
          </label>
          <input
            type="text"
            value={formData.linkedIn}
            onChange={(e) => updateFormData("linkedIn", e.target.value)}
            placeholder="Paste LinkedIn profile URL"
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.linkedIn ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          />
          {errors.linkedIn && <p className="mt-1 text-sm text-red-500">{errors.linkedIn}</p>}
        </div>

        {/* GitHub */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            GitHub Profile
          </label>
          <input
            type="text"
            value={formData.github}
            onChange={(e) => updateFormData("github", e.target.value)}
            placeholder="Paste GitHub profile URL"
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.github ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          />
          {errors.github && <p className="mt-1 text-sm text-red-500">{errors.github}</p>}
        </div>

        {/* Portfolio */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Portfolio Website
          </label>
          <input
            type="text"
            value={formData.portfolio}
            onChange={(e) => updateFormData("portfolio", e.target.value)}
            placeholder="Paste portfolio website URL"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* LeetCode */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            LeetCode / Coding Profile
          </label>
          <input
            type="text"
            value={formData.leetcode}
            onChange={(e) => updateFormData("leetcode", e.target.value)}
            placeholder="Paste LeetCode or coding profile URL"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Additional Platform */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Additional Profile Platform
          </label>
          <select
            value={formData.additionalProfilePlatform}
            onChange={(e) =>
              updateFormData("additionalProfilePlatform", e.target.value)
            }
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Select platform</option>
            {additionalPlatformOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Additional Profile Link */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Additional Profile Link
          </label>
          <input
            type="text"
            value={formData.additionalProfileLink}
            onChange={(e) => updateFormData("additionalProfileLink", e.target.value)}
            placeholder="Paste additional profile link"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}