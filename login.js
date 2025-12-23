const API = "http://localhost:3000";

async function sendCode() {
    const phone = document.getElementById("phone").value;

    await fetch(`${API}/auth/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
    });

    alert("Código enviado no WhatsApp");
}

async function verifyCode() {
    const phone = document.getElementById("phone").value;
    const code = document.getElementById("code").value;

    const res = await fetch(`${API}/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code })
    });

    const data = await res.json();
    localStorage.setItem("token", data.token);
    window.location.href = "index.html";
}
