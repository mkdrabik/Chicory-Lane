const messagesDiv = document.getElementById("messages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const loadingDiv = document.getElementById("loading");

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);

  if (sender === "bot") {
    msg.innerHTML = marked.parse(text);
  } else {
    msg.textContent = text;
  }

  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  const format = document.getElementById("formatSelect").value;

  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";

  loadingDiv.textContent = "Thinking";
  loadingDiv.classList.add("loading");

  const response = await getBotResponse(text, format);

  addMessage(response, "bot");

  loadingDiv.textContent = "";
  loadingDiv.classList.remove("loading");
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function getBotResponse(userText, format) {
  try {
    const response = await fetch("https://chicory-lane.onrender.com/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: userText, format }),
    });

    let data = await response.json();
    let answer = data.answer;

    //  Only remove bullet-style formatting when paragraph mode
    if (format === "paragraph") {
      answer = answer
        .replace(/^\s*[-*]\s+/gm, "") // remove bullets
        .replace(/(\n\s*\n)/g, "\n\n"); // preserve paragraphs
    }

    return answer;
  } catch {
    return "Sorry, I could not get a response from the server.";
  }
}


