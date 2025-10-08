const messagesDiv = document.getElementById("messages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const loadingDiv = document.getElementById("loading");

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

  // Add the user's message once
  addMessage(text, "user");
  userInput.value = "";

  // Show loading text
  loadingDiv.textContent = " Thinking...";

  // Get bot response
  const response = await getBotResponse(text);

  // Add bot message
  addMessage(response, "bot");

  // Clear loading text
  loadingDiv.textContent = "";
}

// ✅ Only add ONE click listener
sendBtn.addEventListener("click", sendMessage);

// ✅ Keep Enter key listener for convenience
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Dummy bot response (kept for testing)
async function getBotResponse(userText) {
  try {
    const response = await fetch("https://chicory-lane.onrender.com/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: userText }),
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
