const express = require("express");
const router = express.Router();
const db = require("../config/db");

const authenticateToken = require("../middleware/authMiddleware");

// Protect all attendance routes
router.use(authenticateToken);


// ================================
// ADD ATTENDANCE
// ================================

router.post("/attendance", (req, res) => {

    const {
        student_id,
        attendance_date,
        status
    } = req.body;

    const sql = `
        INSERT INTO attendance
        (student_id, attendance_date, status)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [student_id, attendance_date, status],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Attendance added successfully"
            });

        }
    );

});


// ================================
// GET ATTENDANCE
// ================================

router.get("/attendance", (req, res) => {

    const sql = `
        SELECT
            attendance.id,
            attendance.student_id,
            students.name,
            attendance.attendance_date,
            attendance.status
        FROM attendance
        JOIN students
            ON attendance.student_id = students.id
        ORDER BY attendance.attendance_date DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json(result);

    });

});


// ================================
// UPDATE ATTENDANCE
// ================================

router.put("/attendance/:id", (req, res) => {

    const {
        student_id,
        attendance_date,
        status
    } = req.body;

    const sql = `
        UPDATE attendance
        SET
            student_id = ?,
            attendance_date = ?,
            status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            student_id,
            attendance_date,
            status,
            req.params.id
        ],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Attendance updated successfully"
            });

        }
    );

});


// ================================
// DELETE ATTENDANCE
// ================================

router.delete("/attendance/:id", (req, res) => {

    const sql = `
        DELETE FROM attendance
        WHERE id = ?
    `;

    db.query(
        sql,
        [req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Attendance deleted successfully"
            });

        }
    );

});


module.exports = router;