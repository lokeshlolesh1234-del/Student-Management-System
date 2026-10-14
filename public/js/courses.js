function logout() {

    localStorage.removeItem("token");

    window.location.href = "index.html";

}


// ==============================
// LOAD COURSES
// ==============================

async function loadCourses() {

    const response = await fetch("/api/courses", {
        headers: getAuthHeaders()
    });


    if (response.status === 401 || response.status === 403) {

        localStorage.removeItem("token");
        window.location.href = "index.html";
        return;

    }


    const courses = await response.json();

    let html = "";


    courses.forEach(course => {

        html += `
            <tr>

                <td>${course.id}</td>

                <td>${course.course_name}</td>

                <td>${course.course_code}</td>

                <td>${course.duration}</td>

                <td>₹${course.fees}</td>

                <td>

                    <button
                        onclick='editCourse(${JSON.stringify(course)})'>
                        Edit
                    </button>

                    <button
                        onclick="deleteCourse(${course.id})"
                        style="background:red;margin-left:5px;">
                        Delete
                    </button>

                </td>

            </tr>
        `;

    });


    document.getElementById("courseTable").innerHTML = html;

}


// ==============================
// ADD / UPDATE COURSE
// ==============================

document
    .getElementById("courseForm")
    .addEventListener("submit", async function(e) {

        e.preventDefault();


        const courseId =
            document.getElementById("courseId").value;


        const course = {

            course_name:
                document.getElementById("course_name").value,

            course_code:
                document.getElementById("course_code").value,

            duration:
                document.getElementById("duration").value,

            fees:
                document.getElementById("fees").value

        };


        const url = courseId
            ? `/api/courses/${courseId}`
            : "/api/courses";


        const method = courseId
            ? "PUT"
            : "POST";


        const response = await fetch(url, {

            method: method,

            headers: getAuthHeaders(),

            body: JSON.stringify(course)

        });


        if (response.status === 401 || response.status === 403) {

            localStorage.removeItem("token");
            window.location.href = "index.html";
            return;

        }


        const data = await response.json();


        alert(data.message);


        if (data.success) {

            // Reset form

            document
                .getElementById("courseForm")
                .reset();


            document
                .getElementById("courseId")
                .value = "";


            // Change button back

            document
                .querySelector("#courseForm button")
                .innerText = "Add Course";


            // Reload courses

            loadCourses();

        }

    });


// ==============================
// EDIT COURSE
// ==============================

function editCourse(course) {

    document
        .getElementById("courseId")
        .value = course.id;


    document
        .getElementById("course_name")
        .value = course.course_name;


    document
        .getElementById("course_code")
        .value = course.course_code;


    document
        .getElementById("duration")
        .value = course.duration;


    document
        .getElementById("fees")
        .value = course.fees;


    document
        .querySelector("#courseForm button")
        .innerText = "Update Course";


    // Scroll to form

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==============================
// DELETE COURSE
// ==============================

async function deleteCourse(id) {

    if (!confirm("Delete this course?")) {
        return;
    }


    const response = await fetch(
        `/api/courses/${id}`,
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


    alert(data.message);


    if (data.success) {
        loadCourses();
    }

}


// ==============================
// SEARCH COURSES
// ==============================

function searchCourses() {

    const input =
        document
            .getElementById("search")
            .value
            .toLowerCase();


    const rows =
        document.querySelectorAll("#courseTable tr");


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


// ==============================
// INITIAL LOAD
// ==============================

loadCourses();