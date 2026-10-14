const express = require("express");
const router = express.Router();
const db = require("../config/db");

const authenticateToken = require("../middleware/authMiddleware");

// Protect all marks routes
router.use(authenticateToken);


// ================================
// ADD MARKS
// ================================

router.post("/marks", (req, res) => {

    const {
        student_id,
        subject,
        internal_marks,
        external_marks
    } = req.body;

    const total =
        Number(internal_marks) + Number(external_marks);

    let grade = "";

    if (total >= 90) grade = "A+";
    else if (total >= 80) grade = "A";
    else if (total >= 70) grade = "B";
    else if (total >= 60) grade = "C";
    else if (total >= 50) grade = "D";
    else grade = "F";


    const sql = `
        INSERT INTO marks
        (student_id, subject, internal_marks, external_marks, total, grade)
        VALUES (?, ?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            student_id,
            subject,
            internal_marks,
            external_marks,
            total,
            grade
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
                message: "Marks added successfully"
            });

        }
    );

});


// ================================
// GET ALL MARKS
// ================================

router.get("/marks", (req, res) => {

    const sql = `
        SELECT
            marks.id,
            marks.student_id,
            students.name,
            marks.subject,
            marks.internal_marks,
            marks.external_marks,
            marks.total,
            marks.grade
        FROM marks
        JOIN students
        ON marks.student_id = students.id
        ORDER BY marks.id DESC
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
// DELETE MARKS
// ================================

router.delete("/marks/:id", (req, res) => {

    const sql =
        "DELETE FROM marks WHERE id=?";


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
                message: "Marks deleted successfully"
            });

        }
    );

});


// ================================
// UPDATE MARKS
// ================================

router.put("/marks/:id", (req, res) => {

    const {
        student_id,
        subject,
        internal_marks,
        external_marks
    } = req.body;


    const total =
        Number(internal_marks) + Number(external_marks);


    let grade = "";

    if (total >= 90) grade = "A+";
    else if (total >= 80) grade = "A";
    else if (total >= 70) grade = "B";
    else if (total >= 60) grade = "C";
    else if (total >= 50) grade = "D";
    else grade = "F";


    const sql = `
        UPDATE marks
        SET
            student_id=?,
            subject=?,
            internal_marks=?,
            external_marks=?,
            total=?,
            grade=?
        WHERE id=?
    `;


    db.query(
        sql,
        [
            student_id,
            subject,
            internal_marks,
            external_marks,
            total,
            grade,
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
                message: "Marks updated successfully"
            });

        }
    );

});


module.exports = router;