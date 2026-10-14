const express = require("express");
const router = express.Router();
const db = require("../config/db");

const authenticateToken = require("../middleware/authMiddleware");

// Protect ALL course routes
router.use(authenticateToken);


// ===============================
// ADD COURSE
// ===============================

router.post("/courses", (req, res) => {

    const { course_name, course_code, duration, fees } = req.body;

    const sql = `
        INSERT INTO courses (course_name, course_code, duration, fees)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [course_name, course_code, duration, fees],
        (err) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Course added successfully"
            });

        }
    );

});


// ===============================
// GET ALL COURSES
// ===============================

router.get("/courses", (req, res) => {

    db.query(
        "SELECT * FROM courses",
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.json(result);

        }
    );

});


// ===============================
// UPDATE COURSE
// ===============================

router.put("/courses/:id", (req, res) => {

    const id = req.params.id;

    const {
        course_name,
        course_code,
        duration,
        fees
    } = req.body;

    const sql = `
        UPDATE courses
        SET course_name=?, course_code=?, duration=?, fees=?
        WHERE id=?
    `;

    db.query(
        sql,
        [
            course_name,
            course_code,
            duration,
            fees,
            id
        ],
        (err) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.json({
                success: true,
                message: "Course updated successfully"
            });

        }
    );

});


// ===============================
// DELETE COURSE
// ===============================

router.delete("/courses/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM courses WHERE id=?",
        [id],
        (err) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.json({
                success: true,
                message: "Course deleted successfully"
            });

        }
    );

});


module.exports = router;