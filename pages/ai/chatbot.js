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

// Call your backend FastAPI endpoint
async function getBotResponse(userText) {
  try {
    const response = await fetch("https://your-backend-url.onrender.com/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: userText }), // must match AskRequest
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error("Error calling backend:", error);
    return "Sorry, I could not get a response from the server.";
  }
}
