// Base URL for all API calls — same origin, no hardcoded port needed
const API_URL = "/api";

function getUser() {
    return localStorage.getItem("username");
}

function isLoggedIn() {
    return localStorage.getItem("loggedIn") === "true";
}

function requireLogin() {
    if (!isLoggedIn()) {
        alert("You have to login first");
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    window.location.href = "index.html";
}
