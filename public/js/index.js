document
    .getElementById("registerForm")
    .addEventListener("submit", async function(e) {

        e.preventDefault();


        const data = {

            name:
                document.getElementById("name").value,

            email:
                document.getElementById("email").value,

            password:
                document.getElementById("password").value

        };


        try {

            const response = await fetch("/api/register", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)

            });


            const result = await response.json();


            alert(result.message);


            if (result.success) {

                window.location.href = "index.html";

            }


        } catch (error) {

            console.error("Registration error:", error);

            alert("Registration failed.");

        }

    });