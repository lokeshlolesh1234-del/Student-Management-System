async function loadDashboard() {

    try {

        const response = await fetch("/api/dashboard");

        const data = await response.json();


        // =========================
        // DASHBOARD CARDS
        // =========================

        document.getElementById("studentCount").innerText =
            data.students;

        document.getElementById("courseCount").innerText =
            data.courses;

        document.getElementById("userCount").innerText =
            data.users;

        document.getElementById("todayCount").innerText =
            data.todayStudents;


        // =========================
        // ATTENDANCE CHART
        // =========================

        let present = 0;
        let absent = 0;

        data.attendance.forEach(item => {

            if (item.status === "Present") {
                present = item.count;
            }

            if (item.status === "Absent") {
                absent = item.count;
            }

        });


        const ctx =
            document.getElementById("attendanceChart");


        new Chart(ctx, {

            type: "doughnut",

            data: {

                labels: [
                    "Present",
                    "Absent"
                ],

                datasets: [{

                    data: [
                        present,
                        absent
                    ]

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false

            }

        });


    } catch (err) {

        console.error(
            "Dashboard Error:",
            err
        );

    }

}


loadDashboard();