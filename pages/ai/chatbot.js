const messagesDiv = document.getElementById("messages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // Show user message
  addMessage(text, "user");
  userInput.value = "";

  // Dummy API call (replace later)
  const response = await getBotResponse(text);

  // Show bot response
  addMessage(response, "bot");
}

// Replace with your real API call later
async function getBotResponse(userText) {
  return `Hello, you said: "${userText}"`;
}

// Event listeners
sendBtn.addEventListener("click", sendMessage);

// Allow pressing Enter to send
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
