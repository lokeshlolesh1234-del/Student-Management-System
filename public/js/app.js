async function loadCharts() {

    try {

        // =========================
        // Attendance
        // =========================

        const attendanceRes = await fetch("/api/attendance");

        if (!attendanceRes.ok) {
            throw new Error(
                "Attendance API error: " + attendanceRes.status
            );
        }

        const attendance = await attendanceRes.json();

        let present = 0;
        let absent = 0;

        attendance.forEach(a => {

            if (a.status === "Present") {
                present++;
            }

            if (a.status === "Absent") {
                absent++;
            }

        });


        new Chart(
            document.getElementById("attendanceChart"),
            {
                type: "doughnut",

                data: {
                    labels: ["Present", "Absent"],

                    datasets: [{
                        data: [present, absent],

                        backgroundColor: [
                            "#22c55e",
                            "#ef4444"
                        ]
                    }]
                },

                options: {
                    responsive: true,

                    plugins: {
                        legend: {
                            position: "top"
                        }
                    }
                }
            }
        );


        // =========================
        // Fees
        // =========================

        const feesRes = await fetch("/api/fees");

        if (!feesRes.ok) {
            throw new Error(
                "Fees API error: " + feesRes.status
            );
        }

        const fees = await feesRes.json();

        let paid = 0;
        let pending = 0;

        fees.forEach(f => {

            paid += Number(f.paid_fee || 0);
            pending += Number(f.balance_fee || 0);

        });


        new Chart(
            document.getElementById("feesChart"),
            {
                type: "bar",

                data: {
                    labels: ["Collected", "Pending"],

                    datasets: [{
                        label: "Fees",

                        data: [paid, pending],

                        backgroundColor: [
                            "#2563EB",
                            "#F59E0B"
                        ]
                    }]
                },

                options: {
                    responsive: true,

                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },

                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            }
        );

    } catch (error) {

        console.error("Dashboard chart error:", error);

    }

}

loadCharts();