const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/dashboard", (req, res) => {

    const dashboard = {};

    // Total Students
    db.query(
        "SELECT COUNT(*) AS totalStudents FROM students",
        (err, studentResult) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            dashboard.students = studentResult[0].totalStudents;


            // Total Courses
            db.query(
                "SELECT COUNT(*) AS totalCourses FROM courses",
                (err, courseResult) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    dashboard.courses =
                        courseResult[0].totalCourses;


                    // Total Users
                    db.query(
                        "SELECT COUNT(*) AS totalUsers FROM users",
                        (err, userResult) => {

                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message: err.message
                                });
                            }

                            dashboard.users =
                                userResult[0].totalUsers;


                            // Today's Students
                            db.query(
                                `SELECT COUNT(*) AS todayStudents
                                 FROM students
                                 WHERE DATE(created_at)=CURDATE()`,
                                (err, todayResult) => {

                                    if (err) {
                                        return res.status(500).json({
                                            success: false,
                                            message: err.message
                                        });
                                    }

                                    dashboard.todayStudents =
                                        todayResult[0].todayStudents;


                                    // Attendance Overview
                                    db.query(
                                        `SELECT status, COUNT(*) AS count
                                         FROM attendance
                                         GROUP BY status`,
                                        (err, attendanceResult) => {

                                            if (err) {
                                                return res.status(500).json({
                                                    success: false,
                                                    message: err.message
                                                });
                                            }

                                            dashboard.attendance =
                                                attendanceResult;


                                            res.json(dashboard);

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );

        }
    );

});

module.exports = router;