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
// LOAD FEES
// ================================

async function loadFees() {

    try {

        const response = await fetch("/api/fees", {
            headers: getAuthHeaders()
        });


        if (response.status === 401 || response.status === 403) {

            localStorage.removeItem("token");
            window.location.href = "index.html";
            return;

        }


        if (!response.ok) {
            throw new Error("Failed to load fees");
        }


        const fees = await response.json();

        let html = "";


        fees.forEach(f => {

            const date =
                String(f.payment_date).split("T")[0];


            html += `
                <tr>

                    <td>${f.id}</td>

                    <td>${f.name}</td>

                    <td>₹${Number(f.total_fee).toFixed(2)}</td>

                    <td>₹${Number(f.paid_fee).toFixed(2)}</td>

                    <td>₹${Number(f.balance_fee).toFixed(2)}</td>

                    <td>${date}</td>

                    <td>

                        <button
                            onclick="editFee(${f.id})">
                            Edit
                        </button>

                        <button
                            onclick="deleteFee(${f.id})"
                            style="background:red;margin-left:5px;">
                            Delete
                        </button>

                    </td>

                </tr>
            `;

        });


        document.getElementById("feesTable").innerHTML = html;

    } catch (error) {

        console.error("Error loading fees:", error);

    }

}


// ================================
// ADD / UPDATE FEE
// ================================

document
    .getElementById("feesForm")
    .addEventListener("submit", async function(e) {

        e.preventDefault();


        const id =
            document.getElementById("feesId").value;


        const totalFee =
            Number(document.getElementById("total_fee").value);


        const paidFee =
            Number(document.getElementById("paid_fee").value);


        const studentId =
            document.getElementById("student").value;


        const paymentDate =
            document.getElementById("payment_date").value;


        if (totalFee < 0 || paidFee < 0) {

            alert("Fee amount cannot be negative.");

            return;

        }


        if (paidFee > totalFee) {

            alert("Paid fee cannot be greater than total fee.");

            return;

        }


        if (!studentId) {

            alert("Please select a student.");

            return;

        }


        const data = {

            student_id: studentId,

            total_fee: totalFee,

            paid_fee: paidFee,

            payment_date: paymentDate

        };


        const url = id
            ? `/api/fees/${id}`
            : "/api/fees";


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

                alert(
                    result.message ||
                    "Operation failed."
                );

                return;

            }


            alert(result.message);


            resetFeeForm();

            loadFees();


        } catch (error) {

            console.error("Error saving fee:", error);

            alert("Failed to save fee.");

        }

    });


// ================================
// EDIT FEE
// ================================

async function editFee(id) {

    try {

        const response =
            await fetch("/api/fees", {
                headers: getAuthHeaders()
            });


        if (response.status === 401 || response.status === 403) {

            localStorage.removeItem("token");
            window.location.href = "index.html";
            return;

        }


        if (!response.ok) {

            throw new Error("Failed to load fees");

        }


        const fees =
            await response.json();


        const fee =
            fees.find(f => f.id == id);


        if (!fee) {

            alert("Fee record not found.");

            return;

        }


        document
            .getElementById("feesId")
            .value = fee.id;


        document
            .getElementById("student")
            .value = fee.student_id;


        document
            .getElementById("total_fee")
            .value = fee.total_fee;


        document
            .getElementById("paid_fee")
            .value = fee.paid_fee;


        document
            .getElementById("payment_date")
            .value =
                String(fee.payment_date).split("T")[0];


        document
            .getElementById("formTitle")
            .innerText = "Update Fee";


        document
            .querySelector("#feesForm button")
            .innerText = "Update Fee";


        document
            .getElementById("feesForm")
            .scrollIntoView({
                behavior: "smooth"
            });


    } catch (error) {

        console.error("Error editing fee:", error);

        alert("Failed to load fee record.");

    }

}


// ================================
// DELETE FEE
// ================================

async function deleteFee(id) {

    if (!confirm("Delete this fee record?")) {
        return;
    }


    try {

        const response =
            await fetch(`/api/fees/${id}`, {

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

            alert(
                result.message ||
                "Failed to delete fee."
            );

            return;

        }


        alert(result.message);


        loadFees();


    } catch (error) {

        console.error("Error deleting fee:", error);

        alert("Failed to delete fee.");

    }

}


// ================================
// RESET FORM
// ================================

function resetFeeForm() {

    document
        .getElementById("feesForm")
        .reset();


    document
        .getElementById("feesId")
        .value = "";


    document
        .getElementById("formTitle")
        .innerText = "Record Fee Payment";


    document
        .querySelector("#feesForm button")
        .innerText = "Save Fee";

}


// ================================
// SEARCH FEES
// ================================

function searchFees() {

    const input =
        document
            .getElementById("search")
            .value
            .toLowerCase();


    const rows =
        document.querySelectorAll("#feesTable tr");


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

loadFees();