const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/analytics", (req, res) => {

    const sql = `
        SELECT
            (SELECT COUNT(*) FROM students) AS students,
            (SELECT COUNT(*) FROM courses) AS courses,
            (SELECT COUNT(*) FROM users) AS users,
            (SELECT COUNT(*) FROM attendance WHERE status='Present') AS present,
            (SELECT COUNT(*) FROM attendance WHERE status='Absent') AS absent,
            (SELECT IFNULL(SUM(paid_fee),0) FROM fees) AS collected,
            (SELECT IFNULL(SUM(balance_fee),0) FROM fees) AS pending
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json(result[0]);

    });

});

module.exports = router;