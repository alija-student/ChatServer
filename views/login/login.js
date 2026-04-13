/*
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
*/
async function login()
{
  const username = document.getElementById("user").value;
  const password = document.getElementById("pass").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username: username, password: password})
  });

  const data = await res.json();

  if (data.success)
  {
    // mark logged in and navigate to the main app
    localStorage.setItem('loggedin', 'true');
    // optional: store name
    localStorage.setItem('name', data.name || '');
    // redirect to index.html which contains the view container
    window.location.href = '/index.html';
  }
  else
  {
    // show error in the result element if present
    const resultEl = document.getElementById('result');
    if (resultEl) resultEl.innerText = 'Login fehlgeschlagen';
    else alert('Login fehlgeschlagen');
  }
}

// Ensure the function is available for inline onclick handlers
window.login = login;