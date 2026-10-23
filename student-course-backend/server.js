require("dotenv").config();

const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
const client = new MongoClient(
    process.env.MONGO_URI
);

let db;

// Check ObjectId
function isValidId(id) {
    return ObjectId.isValid(id);
}

// Admin Login
app.post("/api/admin/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const admin = await db.collection("admins").findOne({
            email: email.trim().toLowerCase()
        });

        if (!admin) {
            return res.status(401).json({
                message: "Invalid Admin email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid Admin email or password"
            });
        }

        const token = jwt.sign(
            {
                role: "admin",
                email: admin.email,
                id: admin._id.toString()
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );

        res.json({
            message: "Admin login successful",
            token: token,
            admin: {
                id: admin._id.toString(),
                name: admin.name,
                email: admin.email
            }
        });

    } catch (error) {
        console.log("Admin login error:", error);

        res.status(500).json({
            message: "Admin login failed"
        });
    }
});

// Check Admin Authentication
function verifyAdmin(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Please login as Admin"
        });    
    }

    const token= authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (decoded.role !== "admin") {
            return res.status(403).json({
                message: "Admin access required"
            });
        }

        req.admin = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired Admin token"
        });
    }
}

// ==================================================
// ADMIN DASHBOARD STATISTICS
// ==================================================

app.get("/api/admin/statistics", verifyAdmin, async (req, res) => {
    try {
        // Count students
        const totalStudents = await db
            .collection("students")
            .countDocuments();

        // Count courses
        const totalCourses = await db
            .collection("courses")
            .countDocuments();

        // Count enrollments
        const totalEnrollments = await db
            .collection("enrollments")
            .countDocuments();

        // Find the most popular course
        const popularCourses = await db
            .collection("enrollments")
            .aggregate([
                {
                    $group: {
                        _id: "$courseId",
                        enrollmentCount: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        enrollmentCount: -1
                    }
                },
                {
                    $limit: 1
                },
                {
                    $lookup: {
                        from: "courses",
                        localField: "_id",
                        foreignField: "_id",
                        as: "course"
                    }
                },
                {
                    $unwind: "$course"
                },
                {
                    $project: {
                        _id: 0,
                        courseName: "$course.name",
                        enrollmentCount: 1
                    }
                }
            ])
            .toArray();

        const mostPopularCourse = popularCourses.length > 0
            ? popularCourses[0]
            : null;

        res.json({
            totalStudents,
            totalCourses,
            totalEnrollments,
            mostPopularCourse
        });

    } catch (error) {
        console.error("Admin statistics error:", error);

        res.status(500).json({
            message: "Unable to load admin dashboard statistics."
        });
    }
});

// Start server
async function startServer() {
    try {
        await client.connect();

        db = client.db(process.env.DB_NAME);

        console.log("MongoDB Connected");

        app.listen(5000, () => {
            console.log("Server running on port 5000");
        });

    } catch (error) {
        console.log("Database connection failed:", error);
    }
}

// Home route
app.get("/", (req, res) => {
    res.send("Student Course Management API is running");
});


// ==================================================
// STUDENT MODULE
// ==================================================

// Get all students
app.get("/api/students", verifyAdmin, async (req, res) => {
    try {
        const students = await db
            .collection("students")
            .find(
                {},
                {
                    projection: {
                        password: 0
                    }
                }
            )
            .toArray();

        res.json(students);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching students"
        });
    }
});


// Add student
app.post("/api/students", verifyAdmin, async (req, res) => {
    try {
        const { name, email, password, course } = req.body;

        if (!name || !email || !password || !course) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingStudent= await db.collection("students").findOne({ email });

        if(existingStudent){
            return res.status(400).json({
                message: "Email already registred"
            });
        }

        const hashedPassword= await bcrypt.hash(password, 10);

        const student = {
            name: name,
            email: email,
            password: hashedPassword,
            course: course
        };

        const result = await db
            .collection("students")
            .insertOne(student);

        res.status(201).json({
            message: "Student registered successfully",
            studentId: result.insertedId
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});


// Get one student
app.get("/api/students/:id", verifyAdmin,  async (req, res) => {
    try {
        const id = req.params.id;

        if (!isValidId(id)) {
            return res.status(400).json({
                message: "Invalid student ID"
            });
        }

        const student = await db
            .collection("students")
            .findOne(
            {
                _id: new ObjectId(id)
            },
            {
                projection: {
                    password: 0
                }
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching student"
        });
    }
});


// Update student
app.put("/api/students/:id", verifyAdmin, async (req, res) => {
    try {
        const id = req.params.id;

        if (!isValidId(id)) {
            return res.status(400).json({
                message: "Invalid student ID"
            });
        }

        const { name, email, course } = req.body;

        const result = await db
            .collection("students")
            .updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        name: name,
                        email: email,
                        course: course
                    }
                }
            );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating student"
        });
    }
});


// Delete student
app.delete("/api/students/:id", verifyAdmin, async (req, res) => {
    try {
        const id = req.params.id;

        if (!isValidId(id)) {
            return res.status(400).json({
                message: "Invalid student ID"
            });
        }

        const result = await db
            .collection("students")
            .deleteOne({
                _id: new ObjectId(id)
            });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting student"
        });
    }
});


// Student login
app.post("/api/students/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({
                message: "Email and password are required"
            });
        }
        
        const student = await db
            .collection("students")
            .findOne({ email });

        if (!student) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch= await bcrypt.compare(
            password,
            student.password
        );

        if(!passwordMatch){
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful",
            student: {
                _id:student._id,
                name:student.name,
                email:student.email,
                course:student.course
            }
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ==================================================
// COURSE MODULE
// ==================================================

// Get all courses
app.get("/api/courses", async (req, res) => {
    try {
        const courses = await db
            .collection("courses")
            .find()
            .toArray();

        res.json(courses);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching courses"
        });
    }
});


// Add course
app.post("/api/courses", verifyAdmin, async (req, res) => {
    try {
        const { name, duration, description } = req.body;

        if (!name || !duration || !description) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const course = {
            name: name,
            duration: duration,
            description: description
        };

        const result = await db
            .collection("courses")
            .insertOne(course);

        res.json({
            message: "Course added successfully",
            id: result.insertedId
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding course"
        });
    }
});


app.put("/api/courses/:id", verifyAdmin, async (req, res) => {

    try {

        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        const { name, duration, description } = req.body;

        const result = await db.collection("courses").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    name: name,
                    duration: duration,
                    description: description
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.json({
            message: "Course updated successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error updating course"
        });
    }
});


// Get one course
app.get("/api/courses/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!isValidId(id)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        const course = await db
            .collection("courses")
            .findOne({
                _id: new ObjectId(id)
            });

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.json(course);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching course"
        });
    }
});


// Delete course
app.delete("/api/courses/:id", verifyAdmin, async (req, res) => {
    try {
        const id = req.params.id;

        if (!isValidId(id)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        const result = await db
            .collection("courses")
            .deleteOne({
                _id: new ObjectId(id)
            });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.json({
            message: "Course deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting course"
        });
    }
});


// ==================================================
// ENROLLMENT MODULE
// ==================================================

// Enroll student in course with validation and duplicate prevention
app.post("/api/enrollments", async (req, res) => {
    try {
        const { studentId, courseId } = req.body;

        // Validate required fields
        if (!studentId || !courseId) {
            return res.status(400).json({
                message: "Student ID and Course ID are required"
            });
        }

        // Validate MongoDB ObjectIds
        if (!ObjectId.isValid(studentId) ||
            !ObjectId.isValid(courseId)) {
            return res.status(400).json({
                message: "Invalid student or course ID"
            });
        }

        const studentObjectId = new ObjectId(studentId);
        const courseObjectId = new ObjectId(courseId);

        // Check whether student exists
        const student = await db
            .collection("students")
            .findOne({
                _id: studentObjectId
            });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Check whether course exists
        const course = await db
            .collection("courses")
            .findOne({
                _id: courseObjectId
            });

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        // Check whether this student is already enrolled
        const existingEnrollment = await db
            .collection("enrollments")
            .findOne({
                studentId: studentObjectId,
                courseId: courseObjectId
            });

        if (existingEnrollment) {
            return res.status(409).json({
                message: "You are already enrolled in this course."
            });
        }

        // Create enrollment
        const enrollment = {
            studentId: studentObjectId,
            courseId: courseObjectId,
            status: "Active",
            enrollmentDate: new Date()
        };

        const result = await db
            .collection("enrollments")
            .insertOne(enrollment);

        return res.status(201).json({
            message: "Enrollment successful!",
            id: result.insertedId
        });

    } catch (error) {
        // The unique index also prevents simultaneous duplicate requests.
        if (error.code === 11000) {
            return res.status(409).json({
                message: "You are already enrolled in this course."
            });
        }

        console.error("Enrollment error:", error);

        return res.status(500).json({
            message: "Error enrolling student"
        });
    }
});


// Get courses of one student
app.get("/api/enrollments/student/:id", async (req, res) => {
    try {
        const studentId = req.params.id;

        if (!isValidId(studentId)) {
            return res.status(400).json({
                message: "Invalid student ID"
            });
        }

        const enrollments = await db
            .collection("enrollments")
            .aggregate([
                {
                    $match: {
                        studentId: new ObjectId(studentId)
                    }
                },
                {
                    $lookup: {
                        from: "courses",
                        localField: "courseId",
                        foreignField: "_id",
                        as: "course"
                    }
                },
                {
                    $unwind: "$course"
                }
            ])
            .toArray();

        res.json(enrollments);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching enrollments"
        });
    }
});


// Start application
startServer();