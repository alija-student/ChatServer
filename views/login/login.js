
document.getElementById('loginBtn').addEventListener('click', function () {
  // hier könntest du Username/Passwort prüfen
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  if (user === "admin" && pass === "1234") {
    // Nachricht an die Index-Seite schicken
    window.parent.postMessage({ action: "loginSuccess" }, "*");
  } else {
    alert("Login fehlgeschlagen!");
  }
});