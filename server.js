require("dotenv").config();

const reportsRoutes = require("./routes/reports");
const userRoutes = require("./routes/userRoutes");
const express = require("express");
const cors = require("cors");
const dashboardRoutes = require("./routes/dashboard");
const courseRoutes = require("./routes/courseRoutes");
const attendanceRoutes = require("./routes/attendance");
const marksRoutes = require("./routes/marks");
const feesRoutes = require("./routes/fees");
const analyticsRoutes = require("./routes/analytics");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/students"));
app.use("/api", courseRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", userRoutes);
app.use("/api", attendanceRoutes);
app.use("/api", marksRoutes);
app.use("/api", feesRoutes);
app.use("/api", analyticsRoutes);
app.use("/api", reportsRoutes);


app.listen(3000,()=>{
    console.log("Server Running on http://localhost:3000");
});