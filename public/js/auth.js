function getAuthHeaders() {

    const token = localStorage.getItem("token");

    if (!token) {

        window.location.href = "index.html";

        return {};

    }

    return {

        "Content-Type": "application/json",

        "Authorization": `Bearer ${token}`

    };

}