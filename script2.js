function sendMessage() {
    let userInput = document.getElementById("user-input").value;
    let chatBox = document.getElementById("chat-box");

    if (userInput.trim() === "") return;

    // Display user message
    chatBox.innerHTML += `<div><strong>You:</strong> ${userInput}</div>`;

    // Generate bot response
    let botResponse = getBotResponse(userInput);
    setTimeout(() => {
        chatBox.innerHTML += `<div><strong>Bot:</strong> ${botResponse}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 500);

    // Clear input field
    document.getElementById("user-input").value = "";
}

function getBotResponse(input) {
    input = input.toLowerCase();
    
    if (input.includes("hello")) {
        return "Hi there! How can I help you?";
    } else if (input.includes("how are you")) {
        return "I'm just a bot, but I'm doing great! Thanks for asking.";
    } else if (input.includes("bye")) {
        return "Goodbye! Have a great day!";
    } else {
        return "I'm not sure how to respond to that.";
    }
}
