function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}


// ===============================
// LOAD COURSE DROPDOWN
// ===============================

async function loadCourseDropdown() {

    const response = await fetch("/api/courses", {
        headers: getAuthHeaders()
    });

    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "index.html";
        return;
    }

    const courses = await response.json();

    const courseSelect = document.getElementById("course");

    courseSelect.innerHTML =
        '<option value="">Select Course</option>';

    courses.forEach(course => {

        courseSelect.innerHTML += `
            <option value="${course.course_name}">
                ${course.course_name}
            </option>
        `;

    });

}


// ===============================
// LOAD STUDENTS
// ===============================

async function loadStudents() {

    const response = await fetch("/api/students", {
        headers: getAuthHeaders()
    });

    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "index.html";
        return;
    }

    const students = await response.json();

    let rows = "";

    students.forEach(student => {

        rows += `
            <tr>
                <td>${student.id}</td>

                <td>
                    <img 
                        src="${
                            student.photo
                            ? "http://localhost:3000/uploads/" + student.photo
                            : "default.png"
                        }"
                        width="60"
                        height="60"
                        style="border-radius:50%; object-fit:cover;"
                    >
                </td>

                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.phone}</td>
                <td>${student.course}</td>

                <td>
                    <button onclick="editStudent(event, ${student.id})">
                        Edit
                    </button>

                    <button 
                        onclick="deleteStudent(${student.id})"
                        style="background:red;margin-left:5px;"
                    >
                        Delete
                    </button>
                </td>
            </tr>
        `;

    });

    document.getElementById("studentTable").innerHTML = rows;

}


// ===============================
// ADD / UPDATE STUDENT
// ===============================

document
    .getElementById("studentForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const formData = new FormData();

        formData.append(
            "name",
            document.getElementById("name").value
        );

        formData.append(
            "email",
            document.getElementById("email").value
        );

        formData.append(
            "phone",
            document.getElementById("phone").value
        );

        formData.append(
            "course",
            document.getElementById("course").value
        );

        const photo = document.getElementById("photo").files[0];

        if (photo) {
            formData.append("photo", photo);
        }

        const studentId =
            document.getElementById("studentId").value;

        const url = studentId
            ? `/api/students/${studentId}`
            : "/api/students";

        const method = studentId
            ? "PUT"
            : "POST";


        // IMPORTANT:
        // FormData must NOT use Content-Type: application/json

        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "index.html";
            return;
        }

        const response = await fetch(url, {

            method: method,

            headers: {
                "Authorization": `Bearer ${token}`
            },

            body: formData
        });


        if (response.status === 401 || response.status === 403) {

            localStorage.removeItem("token");
            window.location.href = "index.html";
            return;
        }


        const data = await response.json();

        alert(data.message);


        if (data.success) {

            document
                .getElementById("studentForm")
                .reset();

            document
                .getElementById("studentId")
                .value = "";

            document
                .querySelector("#studentForm button")
                .innerText = "Add Student";

            loadStudents();
        }

    });


// ===============================
// DELETE STUDENT
// ===============================

async function deleteStudent(id) {

    if (!confirm("Delete this student?")) {
        return;
    }

    const response = await fetch(
        `/api/students/${id}`,
        {
            method: "DELETE",
            headers: getAuthHeaders()
        }
    );


    if (response.status === 401 || response.status === 403) {

        localStorage.removeItem("token");
        window.location.href = "index.html";
        return;
    }


    const data = await response.json();


    if (data.success) {

        alert("Student deleted successfully");

        loadStudents();

    } else {

        alert("Failed to delete student");

    }

}


// ===============================
// EDIT STUDENT
// ===============================

function editStudent(event, id) {

    const row = event.target.closest("tr");

    document.getElementById("studentId").value = id;

    document.getElementById("name").value =
        row.cells[2].innerText;

    document.getElementById("email").value =
        row.cells[3].innerText;

    document.getElementById("phone").value =
        row.cells[4].innerText;

    document.getElementById("course").value =
        row.cells[5].innerText;


    document
        .querySelector("#studentForm button")
        .innerText = "Update Student";

}


// ===============================
// SEARCH STUDENTS
// ===============================

function searchStudents() {

    const input =
        document
            .getElementById("search")
            .value
            .toLowerCase();


    const rows =
        document.querySelectorAll("#studentTable tr");


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


// ===============================
// INITIAL LOAD
// ===============================

loadCourseDropdown();
loadStudents();