const skillOptions = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "NodeJS",
  "ExpressJS",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "Java",
  "Python",
  "C++",
  "C",
  "TypeScript",
  "SQL",
  "Git",
  "GitHub",
  "Docker",
  "Kubernetes",
  "AWS",
  "Linux",
  "Excel",
  "Power BI",
  "Tableau",
  "Figma",
];

const levelOptions = ["Beginner", "Intermediate", "Advanced"];

const domainOptions = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Data Analytics",
  "Data Science",
  "Machine Learning",
  "Cyber Security",
  "DevOps",
  "Cloud Computing",
  "UI/UX Design",
  "Product / Business",
  "Finance / Operations",
  "Marketing / Sales",
];

const languageOptions = [
  "Java",
  "JavaScript",
  "Python",
  "C++",
  "C",
  "TypeScript",
  "SQL",
  "PHP",
  "Go",
  "Rust",
  "None Yet",
];

const databaseOptions = [
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "Firebase",
  "SQL Server",
  "None",
];

const backendOptions = [
  "REST APIs",
  "ExpressJS",
  "Spring Boot",
  "Django",
  "GraphQL",
  "None",
];

const certificationOptions = [
  "None",
  "NPTEL",
  "Coursera",
  "Udemy",
  "AWS",
  "Google",
  "Microsoft",
  "Cisco",
  "Other",
];

const codingPlatformOptions = [
  "None",
  "LeetCode",
  "HackerRank",
  "CodeChef",
  "Codeforces",
  "GeeksforGeeks",
];

export default function SkillsStep({ formData, updateFormData, errors = {} }) {
  const handleSkillToggle = (skill) => {
    const alreadySelected = formData.technicalSkills.includes(skill);

    if (alreadySelected) {
      const updatedSkills = formData.technicalSkills.filter((item) => item !== skill);

      const updatedProficiency = { ...formData.skillProficiency };
      delete updatedProficiency[skill];

      updateFormData("technicalSkills", updatedSkills);
      updateFormData("skillProficiency", updatedProficiency);
    } else {
      updateFormData("technicalSkills", [...formData.technicalSkills, skill]);
      updateFormData("skillProficiency", {
        ...formData.skillProficiency,
        [skill]: "",
      });
    }
  };

  const handleProficiencyChange = (skill, level) => {
    updateFormData("skillProficiency", {
      ...formData.skillProficiency,
      [skill]: level,
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Skills & Technologies
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Select your skills and define your proficiency for accurate readiness and eligibility analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Primary Skill Domain
          </label>
          <select
            value={formData.primaryDomain}
            onChange={(e) => updateFormData("primaryDomain", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.primaryDomain ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select primary domain</option>
            {domainOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.primaryDomain && <p className="mt-1 text-sm text-red-500">{errors.primaryDomain}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Primary Programming Language
          </label>
          <select
            value={formData.primaryLanguage}
            onChange={(e) => updateFormData("primaryLanguage", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.primaryLanguage ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select language</option>
            {languageOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.primaryLanguage && <p className="mt-1 text-sm text-red-500">{errors.primaryLanguage}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Overall Skill Level
          </label>
          <select
            value={formData.overallSkillLevel}
            onChange={(e) => updateFormData("overallSkillLevel", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.overallSkillLevel ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select overall level</option>
            {levelOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.overallSkillLevel && <p className="mt-1 text-sm text-red-500">{errors.overallSkillLevel}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Database Familiarity
          </label>
          <select
            value={formData.databaseFamiliarity}
            onChange={(e) => updateFormData("databaseFamiliarity", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.databaseFamiliarity ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select database familiarity</option>
            {databaseOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.databaseFamiliarity && <p className="mt-1 text-sm text-red-500">{errors.databaseFamiliarity}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Backend / API Familiarity
          </label>
          <select
            value={formData.backendFamiliarity}
            onChange={(e) => updateFormData("backendFamiliarity", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.backendFamiliarity ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select backend familiarity</option>
            {backendOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.backendFamiliarity && <p className="mt-1 text-sm text-red-500">{errors.backendFamiliarity}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Certification Source
          </label>
          <select
            value={formData.certificationSource}
            onChange={(e) => updateFormData("certificationSource", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Select certification source</option>
            {certificationOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Communication Level
          </label>
          <select
            value={formData.communicationLevel}
            onChange={(e) => updateFormData("communicationLevel", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.communicationLevel ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select level</option>
            {levelOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.communicationLevel && <p className="mt-1 text-sm text-red-500">{errors.communicationLevel}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Problem Solving Level
          </label>
          <select
            value={formData.problemSolvingLevel}
            onChange={(e) => updateFormData("problemSolvingLevel", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.problemSolvingLevel ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select level</option>
            {levelOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.problemSolvingLevel && <p className="mt-1 text-sm text-red-500">{errors.problemSolvingLevel}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Teamwork Level
          </label>
          <select
            value={formData.teamworkLevel}
            onChange={(e) => updateFormData("teamworkLevel", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Select level</option>
            {levelOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Leadership Level
          </label>
          <select
            value={formData.leadershipLevel}
            onChange={(e) => updateFormData("leadershipLevel", e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Select level</option>
            {levelOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Coding Practice Platform
          </label>
          <select
            value={formData.codingPlatform}
            onChange={(e) => updateFormData("codingPlatform", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.codingPlatform ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select platform</option>
            {codingPlatformOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.codingPlatform && <p className="mt-1 text-sm text-red-500">{errors.codingPlatform}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            DSA Comfort Level
          </label>
          <select
            value={formData.dsaLevel}
            onChange={(e) => updateFormData("dsaLevel", e.target.value)}
            className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${errors.dsaLevel ? "border-red-500 bg-red-50" : "border-gray-200"}`}
          >
            <option value="">Select DSA level</option>
            {levelOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.dsaLevel && <p className="mt-1 text-sm text-red-500">{errors.dsaLevel}</p>}
        </div>
      </div>

      {/* Multi-select Skills */}
      <div className="mt-8">
        <label className="mb-3 block text-sm font-medium text-gray-700">
          Select Technical Skills
        </label>
        {errors.technicalSkills && <p className="mb-2 text-sm text-red-500">{errors.technicalSkills}</p>}

        <div className="flex flex-wrap gap-3">
          {skillOptions.map((skill) => {
            const selected = formData.technicalSkills.includes(skill);

            return (
              <button
                type="button"
                key={skill}
                onClick={() => handleSkillToggle(skill)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  selected
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : errors.technicalSkills ? "border-red-300 bg-white text-gray-700 hover:border-red-400" : "border-gray-200 bg-white text-gray-700 hover:border-blue-400"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Proficiency Fields */}
      {formData.technicalSkills.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Skill Proficiency
          </h3>
          {errors.skillProficiency && <p className="mb-2 text-sm text-red-500">{errors.skillProficiency}</p>}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {formData.technicalSkills.map((skill) => {
              const hasError = errors.skillProficiency && !formData.skillProficiency[skill];
              return (
                <div key={skill}>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {skill} Proficiency
                  </label>
                  <select
                    value={formData.skillProficiency[skill] || ""}
                    onChange={(e) => handleProficiencyChange(skill, e.target.value)}
                    className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500 ${hasError ? "border-red-500 bg-red-50" : "border-gray-200"}`}
                  >
                    <option value="">Select proficiency</option>
                    {levelOptions.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}