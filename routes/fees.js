const express = require("express");
const router = express.Router();
const db = require("../config/db");

const authenticateToken = require("../middleware/authMiddleware");

// Protect all fee routes
router.use(authenticateToken);


// ================================
// ADD FEE
// ================================

router.post("/fees", (req, res) => {

    const {
        student_id,
        total_fee,
        paid_fee,
        payment_date
    } = req.body;

    const total = Number(total_fee);
    const paid = Number(paid_fee);


    if (!student_id || !payment_date) {

        return res.status(400).json({
            success: false,
            message: "Student and payment date are required."
        });

    }


    if (total < 0 || paid < 0) {

        return res.status(400).json({
            success: false,
            message: "Fee amount cannot be negative."
        });

    }


    if (paid > total) {

        return res.status(400).json({
            success: false,
            message: "Paid fee cannot be greater than total fee."
        });

    }


    const balance_fee = total - paid;


    const sql = `
        INSERT INTO fees
        (student_id, total_fee, paid_fee, balance_fee, payment_date)
        VALUES (?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            student_id,
            total,
            paid,
            balance_fee,
            payment_date
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
                message: "Fee added successfully"
            });

        }
    );

});


// ================================
// GET FEES
// ================================

router.get("/fees", (req, res) => {

    const sql = `
        SELECT
            fees.id,
            fees.student_id,
            students.name,
            fees.total_fee,
            fees.paid_fee,
            fees.balance_fee,
            fees.payment_date
        FROM fees
        JOIN students
        ON fees.student_id = students.id
        ORDER BY fees.id DESC
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
// UPDATE FEE
// ================================

router.put("/fees/:id", (req, res) => {

    const {
        student_id,
        total_fee,
        paid_fee,
        payment_date
    } = req.body;


    const total = Number(total_fee);
    const paid = Number(paid_fee);


    if (!student_id || !payment_date) {

        return res.status(400).json({
            success: false,
            message: "Student and payment date are required."
        });

    }


    if (total < 0 || paid < 0) {

        return res.status(400).json({
            success: false,
            message: "Fee amount cannot be negative."
        });

    }


    if (paid > total) {

        return res.status(400).json({
            success: false,
            message: "Paid fee cannot be greater than total fee."
        });

    }


    const balance_fee = total - paid;


    const sql = `
        UPDATE fees
        SET
            student_id = ?,
            total_fee = ?,
            paid_fee = ?,
            balance_fee = ?,
            payment_date = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [
            student_id,
            total,
            paid,
            balance_fee,
            payment_date,
            req.params.id
        ],
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Fee record not found."
                });

            }


            res.json({
                success: true,
                message: "Fee updated successfully"
            });

        }
    );

});


// ================================
// DELETE FEE
// ================================

router.delete("/fees/:id", (req, res) => {

    const sql =
        "DELETE FROM fees WHERE id = ?";


    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Fee record not found."
                });

            }


            res.json({
                success: true,
                message: "Fee deleted successfully"
            });

        }
    );

});


module.exports = router;