// ================================
// LOGOUT
// ================================

function logout() {

    localStorage.removeItem("token");
    window.location.href = "index.html";

}


// ================================
// LOAD STUDENTS
// ================================

async function loadStudents() {

    try {

        const response = await fetch("/api/students", {
            headers: getAuthHeaders()
        });


        if (response.status === 401 || response.status === 403) {

            localStorage.removeItem("token");
            window.location.href = "index.html";
            return;

        }


        if (!response.ok) {
            throw new Error("Failed to load students");
        }


        const students = await response.json();


        let html = `
            <option value="">Select Student</option>
        `;


        students.forEach(student => {

            html += `
                <option value="${student.id}">
                    ${student.name}
                </option>
            `;

        });


        document.getElementById("student").innerHTML = html;


    } catch (error) {

        console.error("Error loading students:", error);

    }

}


// ================================
// LOAD ATTENDANCE
// ================================

async function loadAttendance() {

    try {

        const response = await fetch("/api/attendance", {
            headers: getAuthHeaders()
        });


        if (response.status === 401 || response.status === 403) {

            localStorage.removeItem("token");
            window.location.href = "index.html";
            return;

        }


        if (!response.ok) {
            throw new Error("Failed to load attendance");
        }


        const attendance = await response.json();


        let html = "";


        attendance.forEach(a => {

            const date =
                String(a.attendance_date).split("T")[0];


            html += `
                <tr>

                    <td>${a.id}</td>

                    <td>${a.name}</td>

                    <td>${date}</td>

                    <td>${a.status}</td>

                    <td>

                        <button
                            onclick="editAttendance(
                                ${a.id},
                                '${date}',
                                '${a.status}',
                                ${a.student_id}
                            )">
                            Edit
                        </button>

                        <button
                            onclick="deleteAttendance(${a.id})"
                            style="background:red;margin-left:5px;">
                            Delete
                        </button>

                    </td>

                </tr>
            `;

        });


        document.getElementById("attendanceTable").innerHTML = html;


    } catch (error) {

        console.error("Error loading attendance:", error);

    }

}


// ================================
// ADD / UPDATE ATTENDANCE
// ================================

document
    .getElementById("attendanceForm")
    .addEventListener("submit", async function(e) {

        e.preventDefault();


        const attendanceId =
            document.getElementById("attendanceId").value;


        const data = {

            student_id:
                document.getElementById("student").value,

            attendance_date:
                document.getElementById("attendance_date").value,

            status:
                document.getElementById("status").value

        };


        const url = attendanceId
            ? `/api/attendance/${attendanceId}`
            : "/api/attendance";


        const method = attendanceId
            ? "PUT"
            : "POST";


        try {

            const response = await fetch(url, {

                method: method,

                headers: getAuthHeaders(),

                body: JSON.stringify(data)

            });


            if (response.status === 401 || response.status === 403) {

                localStorage.removeItem("token");
                window.location.href = "index.html";
                return;

            }


            const result = await response.json();


            if (!response.ok) {
                throw new Error(
                    result.message || "Request failed"
                );
            }


            alert(result.message);


            // Reset form

            document
                .getElementById("attendanceForm")
                .reset();


            document
                .getElementById("attendanceId")
                .value = "";


            document
                .querySelector("#attendanceForm button")
                .innerText = "Save Attendance";


            loadAttendance();


        } catch (error) {

            console.error("Error:", error);

            alert(error.message);

        }

    });


// ================================
// EDIT ATTENDANCE
// ================================

function editAttendance(id, date, status, studentId) {

    document
        .getElementById("attendanceId")
        .value = id;


    document
        .getElementById("student")
        .value = studentId;


    document
        .getElementById("attendance_date")
        .value = date;


    document
        .getElementById("status")
        .value = status;


    document
        .querySelector("#attendanceForm button")
        .innerText = "Update Attendance";


    document
        .getElementById("attendanceForm")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ================================
// DELETE ATTENDANCE
// ================================

async function deleteAttendance(id) {

    if (!confirm("Delete this attendance record?")) {
        return;
    }


    try {

        const response =
            await fetch(`/api/attendance/${id}`, {

                method: "DELETE",

                headers: getAuthHeaders()

            });


        if (response.status === 401 || response.status === 403) {

            localStorage.removeItem("token");
            window.location.href = "index.html";
            return;

        }


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message || "Delete failed"
            );

        }


        alert(result.message);


        loadAttendance();


    } catch (error) {

        console.error("Error:", error);

        alert(error.message);

    }

}


// ================================
// SEARCH ATTENDANCE
// ================================

function searchAttendance() {

    const input =
        document
            .getElementById("search")
            .value
            .toLowerCase();


    const rows =
        document.querySelectorAll(
            "#attendanceTable tr"
        );


    rows.forEach(row => {

        const text =
            row.innerText.toLowerCase();


        row.style.display =
            text.includes(input) ? "" : "none";

    });

}


// ================================
// INITIAL LOAD
// ================================

loadStudents();
loadAttendance();