// ==============================
// PROTEGER TODOS AS PÁGINAS
// ==============================

if (!token) window.location.href = "login.html";

const API = "http://localhost:3000";

async function login() {
    const phone = document.getElementById("phone").value;

    const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
    });

    const data = await res.json();
    localStorage.setItem("token", data.token);
    window.location.href = "index.html";
}