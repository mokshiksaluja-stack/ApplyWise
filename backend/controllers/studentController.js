const Student = require('../models/Student');

// @desc    Create and save a new student profile
// @route   POST /api/students/profile
// @access  Public (for now)
const saveStudentProfile = async (req, res) => {
  try {
    const profileData = req.body;
    console.log(`\n--- [DEBUG] NEW STUDENT PROFILE SAVE INFO ---`);
    console.log(`[Flow] DB Target: ${Student.db.name} | Collection: ${Student.collection.name}`);
    console.log(`[Flow] Incoming Payload:`, JSON.stringify(profileData, null, 2));

    const existingStudent = await Student.findOne({ enrollmentNumber: profileData.enrollmentNumber });
    if (existingStudent) {
      return res.status(400).json({ message: "Student profile with this enrollment number already exists." });
    }
    const newStudent = new Student(profileData);
    const savedStudent = await newStudent.save();
    console.log(`[Flow] Document successfully saved:`, savedStudent._id);
    res.status(201).json({
      message: "Student profile saved successfully!",
      student: savedStudent
    });
  } catch (error) {
    console.error("Error saving student profile:", error.message);
    res.status(500).json({ 
      message: "Server Error: Could not save profile", 
      error: error.message 
    });
  }
};

// @desc    Get student profile by ID
// @route   GET /api/students/profile/:id
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

// @desc    Update an existing student profile or create if not exists (upsert)
// @route   PUT /api/students/profile/:id
const updateStudentProfile = async (req, res) => {
  try {
    console.log(`\n--- [DEBUG] UPDATE STUDENT PROFILE INFO ---`);
    console.log(`[Flow] DB Target: ${Student.db.name} | Collection: ${Student.collection.name}`);
    console.log(`[Flow] Updating ID: ${req.params.id}`);
    console.log(`[Flow] Incoming Payload:`, JSON.stringify(req.body, null, 2));

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true } 
    );
    console.log(`[Flow] Document successfully updated:`, updatedStudent._id);
    res.json({
      message: "Student profile updated successfully!",
      student: updatedStudent
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "A profile with this Enrollment Number or Email already exists." });
    }
    console.error("Error updating student profile:", error.message);
    res.status(500).json({ message: "Server Error: Could not update profile", error: error.message });
  }
};

// --------------------------- ADMIN FUNCTIONS ---------------------------
const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const createStudent = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body cannot be empty" });
    }
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body cannot be empty" });
    }
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  saveStudentProfile,
  getStudentProfile,
  updateStudentProfile,
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
