const express = require("express");
const router = express.Router();
const db = require("../config/db");

const authenticateToken = require("../middleware/authMiddleware");

// Protect all report routes
router.use(authenticateToken);

// =====================================
// STUDENT FULL REPORT
// =====================================

router.get("/reports/students", (req, res) => {

    const sql = `
        SELECT 
            students.id, 
            students.name, 
            students.email, 
            students.phone, 
            students.course, 

            COALESCE(attendance.total_attendance, 0) AS total_attendance,
            COALESCE(attendance.present_count, 0) AS present_count,
            COALESCE(attendance.absent_count, 0) AS absent_count,

            COALESCE(marks.total_marks, 0) AS total_marks,
            COALESCE(marks.average_marks, 0) AS average_marks,

            COALESCE(fees.total_fee, 0) AS total_fee,
            COALESCE(fees.paid_fee, 0) AS paid_fee,
            COALESCE(fees.balance_fee, 0) AS balance_fee

        FROM students

        LEFT JOIN (
            SELECT 
                student_id, 
                COUNT(*) AS total_attendance,

                SUM(
                    CASE 
                        WHEN status = 'Present' THEN 1
                        ELSE 0
                    END
                ) AS present_count,

                SUM(
                    CASE 
                        WHEN status = 'Absent' THEN 1
                        ELSE 0
                    END
                ) AS absent_count

            FROM attendance
            GROUP BY student_id

        ) attendance

        ON students.id = attendance.student_id

        LEFT JOIN (

            SELECT 
                student_id,

                SUM(internal_marks + external_marks) AS total_marks,

                AVG(internal_marks + external_marks) AS average_marks

            FROM marks
            GROUP BY student_id

        ) marks

        ON students.id = marks.student_id

        LEFT JOIN (

            SELECT 
                student_id,
                SUM(total_fee) AS total_fee,
                SUM(paid_fee) AS paid_fee,
                SUM(balance_fee) AS balance_fee

            FROM fees
            GROUP BY student_id

        ) fees

        ON students.id = fees.student_id

        ORDER BY students.id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.error("Report Error:", err);

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        res.json(result);

    });

});

module.exports = router;