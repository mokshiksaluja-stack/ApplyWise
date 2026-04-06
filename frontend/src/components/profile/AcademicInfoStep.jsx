export default function AcademicInfoStep({ formData, updateFormData, errors = {} }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Academic Information
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          This data will be used for eligibility screening and readiness analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Degree</label>
          <select
            value={formData.degree}
            onChange={(e) => updateFormData("degree", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.degree ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select degree</option>
            <option value="BTech">B.Tech</option>
            <option value="BBA">BBA</option>
            <option value="MBA">MBA</option>
            <option value="MCA">MCA</option>
          </select>
          {errors.degree && <p className="mt-1 text-sm text-red-500">{errors.degree}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Branch</label>
          <input
            type="text"
            value={formData.branch}
            onChange={(e) => updateFormData("branch", e.target.value)}
            placeholder="Enter branch / specialization"
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.branch ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          />
          {errors.branch && <p className="mt-1 text-sm text-red-500">{errors.branch}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Semester</label>
          <input
            type="text"
            value={formData.semester}
            onChange={(e) => updateFormData("semester", e.target.value)}
            placeholder="Enter current semester"
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.semester ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          />
          {errors.semester && <p className="mt-1 text-sm text-red-500">{errors.semester}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">CGPA</label>
          <input
            type="text"
            value={formData.cgpa}
            onChange={(e) => updateFormData("cgpa", e.target.value)}
            placeholder="Enter CGPA"
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.cgpa ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          />
          {errors.cgpa && <p className="mt-1 text-sm text-red-500">{errors.cgpa}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">10th Percentage</label>
          <input
            type="text"
            value={formData.tenthPercentage}
            onChange={(e) => updateFormData("tenthPercentage", e.target.value)}
            placeholder="Enter 10th percentage"
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.tenthPercentage ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          />
          {errors.tenthPercentage && <p className="mt-1 text-sm text-red-500">{errors.tenthPercentage}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">12th Percentage</label>
          <input
            type="text"
            value={formData.twelfthPercentage}
            onChange={(e) => updateFormData("twelfthPercentage", e.target.value)}
            placeholder="Enter 12th percentage"
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.twelfthPercentage ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          />
          {errors.twelfthPercentage && <p className="mt-1 text-sm text-red-500">{errors.twelfthPercentage}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Backlogs</label>
          <select
            value={formData.backlogs}
            onChange={(e) => updateFormData("backlogs", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.backlogs ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select backlog status</option>
            <option value="0">None</option>
            <option value="1">1</option>
            <option value="2+">2+</option>
          </select>
          {errors.backlogs && <p className="mt-1 text-sm text-red-500">{errors.backlogs}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Academic Status</label>
          <select
            value={formData.academicStatus}
            onChange={(e) => updateFormData("academicStatus", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.academicStatus ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select status</option>
            <option value="good-standing">Good Standing</option>
            <option value="probation">Probation</option>
          </select>
          {errors.academicStatus && <p className="mt-1 text-sm text-red-500">{errors.academicStatus}</p>}
        </div>
      </div>
    </div>
  );
}