const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Add User
router.post("/users", (req, res) => {

    const { name, email, password, role } = req.body;

    const sql = `
        INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [name, email, password, role], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            message: "User added successfully"
        });

    });

});

// Get All Users
router.get("/users", (req, res) => {

    db.query(
        "SELECT id, name, email, role FROM users",
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

// Update User
router.put("/users/:id", (req, res) => {

    const id = req.params.id;
    const { name, email, role } = req.body;

    const sql = `
        UPDATE users
        SET name=?, email=?, role=?
        WHERE id=?
    `;

    db.query(sql, [name, email, role, id], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            message: "User updated successfully"
        });

    });

});

// Delete User
router.delete("/users/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM users WHERE id=?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "User deleted successfully"
            });

        }
    );

});

module.exports = router;