async function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    let data = await response.json();
    document.getElementById("message").innerText = data.message;

    if (response.ok) {
        alert("Bienvenido, " + username);
    } else {
        alert("Error: " + data.message);
    }
}

function Desplegar() {
    let desplegar = document.getElementById("loginForm");
    desplegar.style.display = (desplegar.style.display === "block") ? "none" : "block";
}
