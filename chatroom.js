document.addEventListener("DOMContentLoaded", function() {
    const input = document.getElementById("message_input");
    const button = document.getElementById("send_button");
    const messageList = document.getElementById("message_list");

    function sendMessage() {
        const text = input.value.trim();
        if (text === "") return;

        const li = document.createElement("li");
        li.textContent = text;

        messageList.appendChild(li);
        input.value = "";
        // Optional: Scrollt automatisch nach unten
        messageList.scrollTop = messageList.scrollHeight;
    }

    // Send-Button klicken
    button.addEventListener("click", sendMessage);

    // Enter-Taste drücken
    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});
