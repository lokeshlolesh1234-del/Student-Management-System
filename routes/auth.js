const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../config/db");


// ================================
// LOGIN
// ================================

router.post("/login", (req, res) => {

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {

        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });

    }

    const cleanEmail = email.trim().toLowerCase();

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [cleanEmail],
        async (err, result) => {

            if (err) {

                console.error("Login database error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Server error"
                });

            }


            // User not found
            if (result.length === 0) {

                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });

            }


            const user = result[0];


            try {

                const match = await bcrypt.compare(
                    password,
                    user.password
                );


                if (!match) {

                    return res.status(401).json({
                        success: false,
                        message: "Invalid email or password"
                    });

                }


                // Create JWT
                const token = jwt.sign(
                    { id: user.id },
                    process.env.JWT_SECRET,
                    { expiresIn: "1d" }
                );

                res.json({
                    success: true,
                    token: token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                });

            } catch (error) {

                console.error("Password verification error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Server error"
                });

            }

        }
    );

});


// ================================
// REGISTER
// ================================

router.post("/register", async (req, res) => {

    const { name, email, password } = req.body;


    // Validate fields
    if (!name || !email || !password) {

        return res.status(400).json({
            success: false,
            message: "Name, email and password are required"
        });

    }


    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();


    // Validate name
    if (cleanName.length < 2) {

        return res.status(400).json({
            success: false,
            message: "Name must contain at least 2 characters"
        });

    }


    // Validate password
    if (password.length < 6) {

        return res.status(400).json({
            success: false,
            message: "Password must contain at least 6 characters"
        });

    }


    // Validate email
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {

        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address"
        });

    }


    try {

        // Check duplicate email
        db.query(
            "SELECT id FROM users WHERE email = ?",
            [cleanEmail],
            async (err, result) => {

                if (err) {

                    console.error(
                        "Registration check error:",
                        err
                    );

                    return res.status(500).json({
                        success: false,
                        message: "Server error"
                    });

                }


                if (result.length > 0) {

                    return res.status(409).json({
                        success: false,
                        message: "Email is already registered"
                    });

                }


                // Hash password
                const hashedPassword =
                    await bcrypt.hash(password, 10);


                // Insert user
                db.query(
                    `INSERT INTO users
                    (name, email, password)
                    VALUES (?, ?, ?)`,
                    [
                        cleanName,
                        cleanEmail,
                        hashedPassword
                    ],
                    (err, result) => {

                        if (err) {

                            console.error(
                                "Registration error:",
                                err
                            );

                            return res.status(500).json({
                                success: false,
                                message: "Registration failed"
                            });

                        }


                        res.status(201).json({
                            success: true,
                            message: "User registered successfully"
                        });

                    }
                );

            }
        );

    } catch (error) {

        console.error(
            "Registration server error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});


module.exports = router;