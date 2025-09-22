// Create HTML structure using JavaScript
document.documentElement.lang = "en";

// Head section
document.title = "Hello";

// Body content
const heading = document.createElement("h1");
heading.textContent = "Hello";

const button = document.createElement("button");
button.textContent = "Ce";

// Add click event
button.addEventListener("click", () => {
  console.log("hello");
});

// Append to body
document.body.appendChild(heading);
document.body.appendChild(button);
