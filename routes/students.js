const multer = require("multer");
const path = require("path");
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

router.use(authenticateToken);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Add Student
router.post("/students", upload.single("photo"), (req, res) => {
    const { name, email, phone, course,  } = req.body;
    const photo = req.file ? req.file.filename : null;

    const sql = "INSERT INTO students (name,email,phone,course,photo) VALUES (?,?,?,?,?)";

    db.query(sql, [name, email, phone, course, photo], (err, result) => {
      if (err) {
    console.error("MySQL Error:", err);

    return res.status(500).json({
        success: false,
        message: err.message
    });
}

        res.json({
            success: true,
            message: "Student added successfully"
        });
    });
});

// Get All Students
router.get("/students", (req, res) => {

    db.query("SELECT * FROM students", (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        res.json(result);
    });

});

// Delete Student
router.delete("/students/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM students WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to delete student"
            });
        }

        res.json({
            success: true,
            message: "Student deleted successfully"
        });

    });

});

router.put("/students/:id", upload.single("photo"), (req, res) => {

    const id = req.params.id;

    const { name, email, phone, course } = req.body;

    const photo = req.file ? req.file.filename : null;

    const sql = `
        UPDATE students
        SET name=?, email=?, phone=?, course=?, photo=?
        WHERE id=?
    `;

    db.query(sql, [name, email, phone, course, photo, id], (err, result) => {

        if (err) {
            console.error(err);

         return res.status(500).json({
            success: false,
            message: err.message
            });
        }

        res.json({
            success: true,
            message: "Student updated successfully"
        });

    });

});



module.exports = router;