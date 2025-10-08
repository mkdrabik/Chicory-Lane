const messagesDiv = document.getElementById("messages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const loadingDiv = document.getElementById("loading"); // 👈 grab the new element

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
  loadingDiv.textContent = " Thinking...";
  addMessage(text, "user");
  userInput.value = "";
  const response = await getBotResponse(text);
  addMessage(response, "bot");
  loadingDiv.textContent = "";
}

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

async function getBotResponse(userText) {
  try {
    loading = true;
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
