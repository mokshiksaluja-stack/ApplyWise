export default function PersonalInfoStep({ formData, updateFormData, errors = {} }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Personal Information
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Add your basic identity and contact details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => updateFormData("fullName", e.target.value)}
            placeholder="Enter your full name"
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.fullName ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          />
          {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Enrollment Number
          </label>
          <input
            type="text"
            value={formData.enrollmentNumber}
            onChange={(e) => updateFormData("enrollmentNumber", e.target.value)}
            placeholder="Enter enrollment number"
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.enrollmentNumber ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          />
           {errors.enrollmentNumber && <p className="mt-1 text-sm text-red-500">{errors.enrollmentNumber}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            College Email
          </label>
          <input
            type="email"
            value={formData.collegeEmail}
            onChange={(e) => updateFormData("collegeEmail", e.target.value)}
            placeholder="Enter college email"
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.collegeEmail ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          />
          {errors.collegeEmail && <p className="mt-1 text-sm text-red-500">{errors.collegeEmail}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Personal Email
          </label>
          <input
            type="email"
            value={formData.personalEmail}
            onChange={(e) => updateFormData("personalEmail", e.target.value)}
            placeholder="Enter personal email"
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.personalEmail ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          />
          {errors.personalEmail && <p className="mt-1 text-sm text-red-500">{errors.personalEmail}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => updateFormData("phone", e.target.value)}
            placeholder="Enter phone number"
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.phone ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) => updateFormData("gender", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.gender ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
          {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
        </div>
      </div>
    </div>
  );
}