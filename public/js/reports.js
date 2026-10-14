async function loadReport() {

    try {

        const response =
            await fetch("/api/reports/students", {
                headers: getAuthHeaders()
            });


        if (response.status === 401 || response.status === 403) {

            localStorage.removeItem("token");
            window.location.href = "index.html";
            return;

        }


        if (!response.ok) {

            throw new Error("Failed to load report");

        }


        const students =
            await response.json();


        let studentHTML = "";
        let attendanceHTML = "";
        let marksHTML = "";
        let feesHTML = "";


        students.forEach(student => {


            // ================================
            // ATTENDANCE PERCENTAGE
            // ================================

            let attendancePercentage = 0;


            if (Number(student.total_attendance) > 0) {

                attendancePercentage =
                    (
                        Number(student.present_count) /
                        Number(student.total_attendance)
                    ) * 100;

            }


            attendancePercentage =
                attendancePercentage.toFixed(2);


            // ================================
            // STUDENT INFORMATION
            // ================================

            studentHTML += `

                <tr>

                    <td>${student.id}</td>

                    <td>${student.name}</td>

                    <td>${student.email}</td>

                    <td>${student.phone}</td>

                    <td>${student.course}</td>

                </tr>

            `;


            // ================================
            // ATTENDANCE
            // ================================

            attendanceHTML += `

                <tr>

                    <td>${student.name}</td>

                    <td>${student.total_attendance}</td>

                    <td>${student.present_count}</td>

                    <td>${student.absent_count}</td>

                    <td>${attendancePercentage}%</td>

                </tr>

            `;


            // ================================
            // MARKS
            // ================================

            marksHTML += `

                <tr>

                    <td>${student.name}</td>

                    <td>${Number(student.total_marks).toFixed(2)}</td>

                    <td>${Number(student.average_marks).toFixed(2)}</td>

                </tr>

            `;


            // ================================
            // FEES
            // ================================

            feesHTML += `

                <tr>

                    <td>${student.name}</td>

                    <td>₹${Number(student.total_fee).toFixed(2)}</td>

                    <td>₹${Number(student.paid_fee).toFixed(2)}</td>

                    <td>₹${Number(student.balance_fee).toFixed(2)}</td>

                </tr>

            `;

        });


        // ================================
        // DISPLAY DATA
        // ================================

        document.getElementById("studentTable").innerHTML =
            studentHTML;


        document.getElementById("attendanceTable").innerHTML =
            attendanceHTML;


        document.getElementById("marksTable").innerHTML =
            marksHTML;


        document.getElementById("feesTable").innerHTML =
            feesHTML;


    } catch (error) {

        console.error("Error loading report:", error);


        document.getElementById("studentTable").innerHTML = `
            <tr>
                <td colspan="5">
                    Failed to load student report.
                </td>
            </tr>
        `;


        document.getElementById("attendanceTable").innerHTML = `
            <tr>
                <td colspan="5">
                    Failed to load attendance report.
                </td>
            </tr>
        `;


        document.getElementById("marksTable").innerHTML = `
            <tr>
                <td colspan="3">
                    Failed to load marks report.
                </td>
            </tr>
        `;


        document.getElementById("feesTable").innerHTML = `
            <tr>
                <td colspan="4">
                    Failed to load fees report.
                </td>
            </tr>
        `;

    }

}