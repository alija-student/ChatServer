const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.send('Hello, World!');
});
app.listen(3000, () => {
  console.log('Server is running on port 3000');
  
//Merge conflict both kept lower part is from Akhtl
  
document.addEventListener("DOMContentLoaded", function () {

    const messageInput = document.getElementById("message_input");
    const sendButton = document.getElementById("send_button");
    const messageList = document.getElementById("message_list");
    const userList = document.getElementById("user_list");

    // 👉 aktueller User (später erweiterbar)
    let currentUser = "User 1";

    // 👉 User im Panel anzeigen
    function initUsers() {
        const u1 = document.createElement("div");
        u1.textContent = "User 1";

        const u2 = document.createElement("div");
        u2.textContent = "User 2";

        userList.appendChild(u1);
        userList.appendChild(u2);
    }

    function sendMessage() {
    const text = messageInput.value.trim();

    if (text !== "") {

        const li = document.createElement("li");

        // USER SPAN (fett + wird über CSS gefärbt)
        const userSpan = document.createElement("span");
        userSpan.textContent = currentUser + ": ";
        userSpan.style.fontWeight = "bold";
        userSpan.classList.add("chat-user");

        // MESSAGE SPAN
        const textSpan = document.createElement("span");
        textSpan.textContent = text;

        li.appendChild(userSpan);
        li.appendChild(textSpan);

        li.style.marginBottom = "0.5rem";

        messageList.appendChild(li);

        messageInput.value = "";

        messageList.scrollTop = messageList.scrollHeight;
    }
}

    // Init Users
    initUsers();

    // Button klick
    sendButton.addEventListener("click", sendMessage);

    // Enter
    messageInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

});