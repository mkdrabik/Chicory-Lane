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
      await fetchDocuments(true);
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
      await fetchDocuments(true);
    } else {
      statusDiv.textContent = "Text submission failed.";
    }
  } catch (error) {
    console.error("Error submitting text:", error);
    statusDiv.textContent = "An error occurred.";
  }
});

const refreshBtn = document.getElementById("refresh-btn");
const loadMoreBtn = document.getElementById("load-more-btn");
const documentList = document.getElementById("document-list");

let offset = 0;
const limit = 10;
let totalDocs = 0;

async function fetchDocuments(reset = false) {
  if (reset) {
    offset = 0;
    documentList.innerHTML = "<li>Loading...</li>";
  }

  try {
    const response = await fetch(
      `https://chicory-lane.onrender.com/documents?limit=${limit}&offset=${offset}`
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const { documents, total } = data;
    totalDocs = total;

    if (reset) documentList.innerHTML = "";

    if (!documents || documents.length === 0) {
      if (reset) documentList.innerHTML = "<li>No documents uploaded yet.</li>";
      loadMoreBtn.style.display = "none";
      return;
    }

    documents.forEach((doc) => {
      const li = document.createElement("li");
      li.textContent = doc;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = () => deleteDocument(doc, li);

      li.appendChild(deleteBtn);
      documentList.appendChild(li);
    });

    offset += limit;
    loadMoreBtn.style.display = offset < totalDocs ? "block" : "none";
  } catch (err) {
    console.error("Error fetching documents:", err);
    documentList.innerHTML = "<li>Error fetching documents.</li>";
  }
}

async function deleteDocument(filename, liElement) {
  if (!confirm(`Delete document "${filename}"?`)) return;

  try {
    const response = await fetch(
      `https://chicory-lane.onrender.com/documents/${encodeURIComponent(
        filename
      )}`,
      { method: "DELETE" }
    );

    if (response.ok) {
      liElement.remove();
    } else {
      alert("Failed to delete document.");
    }
  } catch (err) {
    console.error("Error deleting document:", err);
    alert("Error deleting document.");
  }
}

refreshBtn.addEventListener("click", () => fetchDocuments(true));
loadMoreBtn.addEventListener("click", () => fetchDocuments(false));
window.addEventListener("load", () => fetchDocuments(true));
