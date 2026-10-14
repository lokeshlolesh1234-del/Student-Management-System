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
// LOAD MARKS
// ================================

async function loadMarks() {

    try {

        const response = await fetch("/api/marks", {
            headers: getAuthHeaders()
        });


        if (response.status === 401 || response.status === 403) {

            localStorage.removeItem("token");
            window.location.href = "index.html";
            return;

        }


        if (!response.ok) {
            throw new Error("Failed to load marks");
        }


        const marks = await response.json();


        let html = "";


        marks.forEach(m => {

            html += `
                <tr>

                    <td>${m.id}</td>

                    <td>${m.name}</td>

                    <td>${m.subject}</td>

                    <td>${m.internal_marks}</td>

                    <td>${m.external_marks}</td>

                    <td>${m.total}</td>

                    <td>${m.grade}</td>

                    <td>

                        <button
                            onclick="editMarks(${m.id})">
                            Edit
                        </button>

                        <button
                            onclick="deleteMarks(${m.id})"
                            style="background:red;margin-left:5px;">
                            Delete
                        </button>

                    </td>

                </tr>
            `;

        });


        document.getElementById("marksTable").innerHTML = html;


    } catch (error) {

        console.error("Error loading marks:", error);

    }

}


// ================================
// ADD / UPDATE MARKS
// ================================

document
    .getElementById("marksForm")
    .addEventListener("submit", async function(e) {

        e.preventDefault();


        const id =
            document.getElementById("marksId").value;


        const data = {

            student_id:
                document.getElementById("student").value,

            subject:
                document.getElementById("subject").value,

            internal_marks:
                document.getElementById("internal").value,

            external_marks:
                document.getElementById("external").value

        };


        const url = id
            ? `/api/marks/${id}`
            : "/api/marks";


        const method = id
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


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message || "Request failed"
                );

            }


            alert(result.message);


            // Reset form

            document
                .getElementById("marksForm")
                .reset();


            document
                .getElementById("marksId")
                .value = "";


            document
                .querySelector("#marksForm button")
                .innerText = "Save Marks";


            // Reload table

            loadMarks();


        } catch (error) {

            console.error("Error:", error);

            alert(error.message);

        }

    });


// ================================
// EDIT MARKS
// ================================

async function editMarks(id) {

    try {

        const response =
            await fetch("/api/marks", {
                headers: getAuthHeaders()
            });


        if (response.status === 401 || response.status === 403) {

            localStorage.removeItem("token");
            window.location.href = "index.html";
            return;

        }


        const marks =
            await response.json();


        const mark =
            marks.find(m => m.id == id);


        if (!mark) {

            alert("Marks record not found.");

            return;

        }


        document
            .getElementById("marksId")
            .value = mark.id;


        document
            .getElementById("student")
            .value = mark.student_id;


        document
            .getElementById("subject")
            .value = mark.subject;


        document
            .getElementById("internal")
            .value = mark.internal_marks;


        document
            .getElementById("external")
            .value = mark.external_marks;


        document
            .querySelector("#marksForm button")
            .innerText = "Update Marks";


        document
            .getElementById("marksForm")
            .scrollIntoView({
                behavior: "smooth"
            });


    } catch (error) {

        console.error("Error:", error);

    }

}


// ================================
// DELETE MARKS
// ================================

async function deleteMarks(id) {

    if (!confirm("Delete this marks record?")) {
        return;
    }


    try {

        const response =
            await fetch(`/api/marks/${id}`, {

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


        loadMarks();


    } catch (error) {

        console.error("Error:", error);

        alert(error.message);

    }

}


// ================================
// SEARCH MARKS
// ================================

function searchMarks() {

    const input =
        document
            .getElementById("search")
            .value
            .toLowerCase();


    const rows =
        document.querySelectorAll(
            "#marksTable tr"
        );


    rows.forEach(row => {

        const text =
            row.innerText.toLowerCase();


        if (text.includes(input)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

}


// ================================
// INITIAL LOAD
// ================================

loadStudents();
loadMarks();