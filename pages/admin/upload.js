const form = document.getElementById("upload-form");
const fileInput = document.getElementById("file-input");
const fileNameInput = document.getElementById("file-name");
const statusDiv = document.getElementById("status");
const textInput = document.getElementById("text-input");
const textNameInput = document.getElementById("text-name");
const submitTextBtn = document.getElementById("submit-text-btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = fileInput.files[0];
  const docName = fileNameInput.value.trim();

  if (!file) {
    statusDiv.textContent = "Please select a file.";
    return;
  }

  if (file.type !== "text/plain") {
    statusDiv.textContent = "Please select a plain text file (.txt).";
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  if (docName) formData.append("document_name", docName);

  statusDiv.textContent = "Uploading...";

  try {
    const response = await fetch("https://chicory-lane.onrender.com/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      statusDiv.textContent = result.message;
      fileInput.value = "";
      fileNameInput.value = "";
    } else {
      statusDiv.textContent = "Upload failed.";
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    statusDiv.textContent = "An error occurred.";
  }
});

submitTextBtn.addEventListener("click", async () => {
  const text = textInput.value.trim();
  const docName = textNameInput.value.trim();

  if (!text) {
    statusDiv.textContent = "Please enter some text.";
    return;
  }

  const textBlob = new Blob([text], { type: "text/plain" });

  const formData = new FormData();
  formData.append("file", textBlob, "pasted-text.txt");
  if (docName) formData.append("document_name", docName);

  statusDiv.textContent = "Submitting text...";

  try {
    const response = await fetch("https://chicory-lane.onrender.com/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      statusDiv.textContent = result.message;
      textInput.value = "";
      textNameInput.value = "";
    } else {
      statusDiv.textContent = "Text submission failed.";
    }
  } catch (error) {
    console.error("Error submitting text:", error);
    statusDiv.textContent = "An error occurred.";
  }
});

const refreshBtn = document.getElementById("refresh-btn");
const documentList = document.getElementById("document-list");

async function fetchDocuments() {
  documentList.innerHTML = "<li>Loading...</li>";
  try {
    const response = await fetch("https://chicory-lane.onrender.com/documents");
    if (response.ok) {
      const data = await response.json();
      const documents = data.documents || [];

      if (documents.length === 0) {
        documentList.innerHTML = "<li>No documents uploaded yet.</li>";
        return;
      }

      // Populate list
      documentList.innerHTML = "";
      documents.forEach((doc) => {
        const li = document.createElement("li");
        li.textContent = doc;
        documentList.appendChild(li);
      });
    } else {
      documentList.innerHTML = "<li>Failed to load documents.</li>";
    }
  } catch (err) {
    console.error("Error fetching documents:", err);
    documentList.innerHTML = "<li>Error fetching documents.</li>";
  }
}

window.addEventListener("load", fetchDocuments);
refreshBtn.addEventListener("click", fetchDocuments);
