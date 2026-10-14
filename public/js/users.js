// ================================
// LOGOUT
// ================================

function logout() {

    localStorage.removeItem("token");

    window.location.href = "index.html";
}


// ================================
// LOAD USERS
// ================================

async function loadUsers() {

    try {

        const response = await fetch("/api/users");

        const users = await response.json();

        let rows = "";

        users.forEach(user => {

            rows += `
                <tr>

                    <td>${user.id}</td>

                    <td>${user.name}</td>

                    <td>${user.email}</td>

                    <td>${user.role}</td>

                    <td>

                        <button
                            onclick="editUser(${user.id})">
                            Edit
                        </button>

                        <button
                            onclick="deleteUser(${user.id})"
                            style="background:red;margin-left:5px;">
                            Delete
                        </button>

                    </td>

                </tr>
            `;

        });

        document.getElementById("userTable").innerHTML = rows;

    } catch (error) {

        console.error("Error loading users:", error);

    }

}


// ================================
// ADD / UPDATE USER
// ================================

document
    .getElementById("userForm")
    .addEventListener("submit", async function(e) {

        e.preventDefault();

        const id =
            document.getElementById("userId").value;

        const user = {

            name:
                document.getElementById("name").value,

            email:
                document.getElementById("email").value,

            password:
                document.getElementById("password").value,

            role:
                document.getElementById("role").value

        };


        const url = id
            ? `/api/users/${id}`
            : "/api/users";


        const method = id
            ? "PUT"
            : "POST";


        try {

            const response = await fetch(url, {

                method: method,

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(user)

            });


            const data = await response.json();

            alert(data.message);


            // Reset form

            document
                .getElementById("userForm")
                .reset();

            document
                .getElementById("userId")
                .value = "";


            document
                .querySelector("#userForm button")
                .innerText = "Add User";


            // Reload users

            loadUsers();


        } catch (error) {

            console.error("Error:", error);

            alert("Something went wrong.");

        }

    });


// ================================
// EDIT USER
// ================================

async function editUser(id) {

    try {

        const response =
            await fetch("/api/users");

        const users =
            await response.json();


        const user =
            users.find(u => u.id == id);


        if (!user) {

            alert("User not found.");

            return;

        }


        document
            .getElementById("userId")
            .value = user.id;


        document
            .getElementById("name")
            .value = user.name;


        document
            .getElementById("email")
            .value = user.email;


        document
            .getElementById("role")
            .value = user.role;


        // Password is not changed during normal edit

        document
            .getElementById("password")
            .value = "";


        document
            .getElementById("password")
            .required = false;


        document
            .querySelector("#userForm button")
            .innerText = "Update User";


        // Scroll to form

        document
            .getElementById("userForm")
            .scrollIntoView({
                behavior: "smooth"
            });


    } catch (error) {

        console.error("Error:", error);

    }

}


// ================================
// DELETE USER
// ================================

async function deleteUser(id) {

    if (!confirm("Delete this user?")) {

        return;

    }


    try {

        const response =
            await fetch(`/api/users/${id}`, {

                method: "DELETE"

            });


        const data =
            await response.json();


        alert(data.message);


        loadUsers();


    } catch (error) {

        console.error("Error:", error);

        alert("Failed to delete user.");

    }

}


// ================================
// SEARCH USERS
// ================================

function searchUsers() {

    const input =
        document
            .getElementById("search")
            .value
            .toLowerCase();


    const rows =
        document.querySelectorAll(
            "#userTable tr"
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

loadUsers();