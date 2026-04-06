const Student = require('../models/Student');

// @desc    Create and save a new student profile
// @route   POST /api/students/profile
// @access  Public (for now)
const saveStudentProfile = async (req, res) => {
  try {
    // req.body contains the JSON passed from the frontend (formData)
    const profileData = req.body;

    // Check if a student with this enrollment number already exists
    // (Optional but good practice to prevent duplicates)
    const existingStudent = await Student.findOne({ enrollmentNumber: profileData.enrollmentNumber });
    if (existingStudent) {
      return res.status(400).json({ message: "Student profile with this enrollment number already exists." });
    }

    // Initialize a new Student document utilizing the Mongoose model
    const newStudent = new Student(profileData);

    // Attempt to save to MongoDB
    // Mongoose will automatically validate against the StudentSchema here
    const savedStudent = await newStudent.save();

    // Respond with success status 201 (Created) and the saved profile data
    res.status(201).json({
      message: "Student profile saved successfully!",
      student: savedStudent
    });

  } catch (error) {
    // If validation fails or another database error happens, catch it here
    console.error("Error saving student profile:", error.message);
    res.status(500).json({ 
      message: "Server Error: Could not save profile", 
      error: error.message 
    });
  }
};

// @desc    Get student profile by ID
// @route   GET /api/students/profile/:id
// @access  Public (for now)
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }
    res.json(student);
  } catch (error) {
    console.error("Error fetching student profile:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Update an existing student profile
// @route   PUT /api/students/profile/:id
// @access  Public (for now)
const updateStudentProfile = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      // new: true returns the updated document
      // runValidators: true ensures schema verification rules on update
      { new: true, runValidators: true } 
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    res.json({
      message: "Student profile updated successfully!",
      student: updatedStudent
    });
  } catch (error) {
    console.error("Error updating student profile:", error.message);
    res.status(500).json({ message: "Server Error: Could not update profile", error: error.message });
  }
};

module.exports = {
  saveStudentProfile,
  getStudentProfile,
  updateStudentProfile
};
