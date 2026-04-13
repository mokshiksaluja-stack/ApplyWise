import { useState, useEffect } from "react";
import ProfileStatCard from "../components/layouts/ProfileStatCard";
import PersonalInfoStep from "../components/profile/PersonalInfoStep";
import AcademicInfoStep from "../components/profile/AcademicInfoStep";
import SkillsStep from "../components/profile/SkillsStep";
import PreferencesStep from "../components/profile/PreferencesStep";
import LinksStep from "../components/profile/LinksStep";
import ProfileStepper from "../components/profile/ProfileStepper";
import { saveStudentProfile, fetchStudentProfile, updateStudentProfile } from "../services/studentService";

export default function ProfileWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [submitError, setSubmitError] = useState("");
  // Determine if we already have a saved profile ID stored logically
  const cachedId = localStorage.getItem("studentId");
  const [studentId, setStudentId] = useState(
    cachedId && cachedId !== "null" && cachedId !== "undefined" ? cachedId : null
  );

  const [formData, setFormData] = useState({
  // Personal Info
  fullName: "John Doe",
  enrollmentNumber: "EN12345678",
  collegeEmail: "john.doe@college.edu",
  personalEmail: "john.doe.personal@gmail.com",
  phone: "9876543210",
  gender: "Male",

  // Academic Info
  degree: "B.Tech",
  branch: "Computer Science",
  semester: "8th",
  cgpa: "8.5",
  tenthPercentage: "90",
  twelfthPercentage: "85",
  backlogs: "0",
  academicStatus: "Active",

  // Skills & Technologies
  primaryDomain: "Full Stack Development",
  primaryLanguage: "JavaScript",
  overallSkillLevel: "Intermediate",
  technicalSkills: ["React", "NodeJS", "MongoDB"],
  skillProficiency: { "React": "Advanced", "NodeJS": "Intermediate", "MongoDB": "Intermediate" },
  databaseFamiliarity: "MongoDB, SQL",
  backendFamiliarity: "NodeJS, ExpressJS",
  communicationLevel: "Excellent",
  problemSolvingLevel: "Strong",
  teamworkLevel: "Excellent",
  leadershipLevel: "Good",
  certificationSource: "Coursera",
  codingPlatform: "LeetCode",
  dsaLevel: "Intermediate",

  // Career Preferences
  interestedRoles: ["Software Engineer", "Frontend Developer"],
  preferredJobType: "Full-Time",
  preferredWorkMode: "Hybrid",
  preferredLocation: "Bangalore",
  openToRelocation: "Yes",
  preferredDomains: ["IT", "Product"],
  expectedCompensation: "10 LPA",
  availabilityStatus: "Immediate",
  preferredCompanyType: "MNC",
  offCampusInterest: "Yes",

  // Resume & Links
  resumeLink: "https://example.com/resume.pdf",
  resumeStatus: "Updated",
  linkedIn: "https://linkedin.com/in/johndoe",
  github: "https://github.com/johndoe",
  portfolio: "https://johndoe.dev",
  leetcode: "https://leetcode.com/johndoe",
  additionalProfilePlatform: "HackerRank",
  additionalProfileLink: "https://hackerrank.com/johndoe",
  profileVisibility: "Public",
});

  // Pre-fill existing data if we hold a studentId
  useEffect(() => {
    const loadProfileData = async () => {
      if (studentId) {
        setIsFetching(true);
        try {
          const fetchedProfile = await fetchStudentProfile(studentId);
          // Pre-fill the state
          setFormData((prev) => ({
            ...prev,
            ...fetchedProfile,
          }));
        } catch (error) {
          setSubmitError(error.message || "Failed to load existing profile.");
        } finally {
          setIsFetching(false);
        }
      }
    };
    loadProfileData();
  }, [studentId]);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!formData.enrollmentNumber.trim()) newErrors.enrollmentNumber = "Enrollment number is required";
      
      if (!formData.collegeEmail.trim()) {
        newErrors.collegeEmail = "College email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.collegeEmail)) {
        newErrors.collegeEmail = "Invalid email format";
      }
      
      if (!formData.personalEmail.trim()) {
        newErrors.personalEmail = "Personal email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalEmail)) {
        newErrors.personalEmail = "Invalid email format";
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = "Phone must be exactly 10 digits";
      }
      
      if (!formData.gender) newErrors.gender = "Gender is required";
    }

    if (step === 2) {
      if (!formData.degree) newErrors.degree = "Degree is required";
      if (!formData.branch.trim()) newErrors.branch = "Branch is required";
      if (!formData.semester.trim()) newErrors.semester = "Semester is required";
      
      if (!formData.cgpa.trim()) {
        newErrors.cgpa = "CGPA is required";
      } else if (isNaN(formData.cgpa)) {
        newErrors.cgpa = "CGPA must be a number";
      }
      
      if (!formData.tenthPercentage.trim()) {
        newErrors.tenthPercentage = "10th percentage is required";
      } else if (isNaN(formData.tenthPercentage)) {
        newErrors.tenthPercentage = "10th percentage must be a number";
      }
      
      if (!formData.twelfthPercentage.trim()) {
        newErrors.twelfthPercentage = "12th percentage is required";
      } else if (isNaN(formData.twelfthPercentage)) {
        newErrors.twelfthPercentage = "12th percentage must be a number";
      }
      
      if (!formData.backlogs) newErrors.backlogs = "Backlogs are required";
      if (!formData.academicStatus) newErrors.academicStatus = "Academic status is required";
    }

    if (step === 3) {
      if (!formData.primaryDomain) newErrors.primaryDomain = "Primary domain is required";
      if (!formData.primaryLanguage) newErrors.primaryLanguage = "Primary language is required";
      if (!formData.overallSkillLevel) newErrors.overallSkillLevel = "Overall skill level is required";
      
      if (formData.technicalSkills.length === 0) {
        newErrors.technicalSkills = "At least 1 technical skill must be selected";
      } else {
        const missingProficiencies = formData.technicalSkills.filter(
          skill => !formData.skillProficiency[skill]
        );
        if (missingProficiencies.length > 0) {
          newErrors.skillProficiency = "Every selected technical skill must have proficiency selected";
        }
      }
      
      if (!formData.codingPlatform) newErrors.codingPlatform = "Coding platform is required";
      if (!formData.dsaLevel) newErrors.dsaLevel = "DSA comfort level is required";
      // Note: databaseFamiliarity, backendFamiliarity, communicationLevel, problemSolvingLevel
      // are intentionally not required here as stored values may use free-text not matching dropdown options
    }

    if (step === 4) {
      if (formData.interestedRoles.length === 0) newErrors.interestedRoles = "At least 1 interested role required";
      if (!formData.preferredJobType) newErrors.preferredJobType = "Preferred job type required";
      if (!formData.preferredWorkMode) newErrors.preferredWorkMode = "Preferred work mode required";
      if (!formData.preferredLocation) newErrors.preferredLocation = "Preferred location required";
      if (!formData.openToRelocation) newErrors.openToRelocation = "Open to relocation required";
      if (formData.preferredDomains.length === 0) newErrors.preferredDomains = "At least 1 preferred domain required";
      if (!formData.expectedCompensation) newErrors.expectedCompensation = "Expected compensation required";
      if (!formData.availabilityStatus) newErrors.availabilityStatus = "Availability status required";
      if (!formData.preferredCompanyType) newErrors.preferredCompanyType = "Preferred company type required";
      if (!formData.offCampusInterest) newErrors.offCampusInterest = "Off-campus interest required";
    }

    if (step === 5) {
      if (!formData.resumeLink.trim()) newErrors.resumeLink = "Resume link required";
      if (!formData.resumeStatus) newErrors.resumeStatus = "Resume status required";
      if (!formData.linkedIn.trim()) newErrors.linkedIn = "LinkedIn profile required";
      if (!formData.github.trim()) newErrors.github = "GitHub profile required";
      if (!formData.profileVisibility) newErrors.profileVisibility = "Profile visibility required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (field === "technicalSkills" || field === "skillProficiency") {
        if (errors.technicalSkills || errors.skillProficiency) {
            setErrors((prev) => ({ ...prev, technicalSkills: undefined, skillProficiency: undefined }));
        }
    }
    if (field === "interestedRoles" && errors.interestedRoles) {
      setErrors((prev) => ({ ...prev, interestedRoles: undefined }));
    }
    if (field === "preferredDomains" && errors.preferredDomains) {
      setErrors((prev) => ({ ...prev, preferredDomains: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (validateStep(5)) {
      setSubmitError("");
      setIsLoading(true);

      try {
        if (studentId) {
          // Edit existing profile
          await updateStudentProfile(studentId, formData);
        } else {
          // Create new profile
          const response = await saveStudentProfile(formData);
          // Store ID securely in client for subsequent re-edits
          const newId = response.student._id;
          setStudentId(newId);
          localStorage.setItem("studentId", newId);
        }
        
        console.log("=== FINAL FORM DATA ===");
        console.dir(formData, { depth: null });
        console.log("=======================");
        setIsSuccess(true);
      } catch (error) {
        setSubmitError(error.message || "Failed to save profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 2:
        return <AcademicInfoStep formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 3:
        return <SkillsStep formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 4:
        return <PreferencesStep formData={formData} updateFormData={updateFormData} errors={errors} />;
      case 5:
        return <LinksStep formData={formData} updateFormData={updateFormData} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <>
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Student Profile Setup
                </h1>
                <p className="mt-2 text-gray-500">
                  Complete your professional profile to improve eligibility and recommendations.
                </p>
              </div>

              <button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700">
                Save Changes
              </button>
            </div>

            {isSuccess ? (
              <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-16 shadow-sm text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                  <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Profile Successfully Saved!</h2>
                <p className="mt-4 text-gray-500 max-w-md mx-auto">
                  Your details have been recorded safely in the database.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)} 
                  className="mt-8 rounded-xl bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700 transition"
                >
                  Edit Profile
                </button>
              </div>
            ) : isFetching ? (
              <div className="mt-8 flex justify-center py-20">
                <p className="text-gray-500 text-lg">Loading your profile data...</p>
              </div>
            ) : (
              <>
                <ProfileStepper currentStep={currentStep} />

                <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                  {renderStep()}

                  {submitError && (
                    <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                      {submitError}
                    </div>
                  )}

                  <div className="mt-8 flex items-center justify-between">
                    <button
                      onClick={prevStep}
                      disabled={currentStep === 1 || isLoading}
                      className={`rounded-xl px-5 py-3 text-sm font-medium transition ${
                        currentStep === 1 || isLoading
                          ? "cursor-not-allowed bg-gray-100 text-gray-400"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Previous
                    </button>

                    {currentStep < 5 ? (
                      <button
                        onClick={nextStep}
                        disabled={isLoading}
                        className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Next
                      </button>
                    ) : (
                      <button 
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`rounded-xl px-6 py-3 text-sm font-medium text-white transition ${
                          isLoading ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                      >
                        {isLoading ? "Saving..." : "Complete Profile"}
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
    </>
  );
}