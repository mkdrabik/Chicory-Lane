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

// lazy buttons (will be created after documents load)
let deleteSelectedBtn = null;
let selectAllBtn = null;
let unselectAllBtn = null;

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
      if (deleteSelectedBtn) deleteSelectedBtn.style.display = "none";
      if (selectAllBtn) selectAllBtn.style.display = "none";
      if (unselectAllBtn) unselectAllBtn.style.display = "none";
      return;
    }

    documents.forEach((doc) => {
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "doc-checkbox";
      checkbox.value = doc;
      checkbox.id = `doc-${encodeURIComponent(doc)}`;
      checkbox.addEventListener("change", () => {
        const anyChecked = document.querySelectorAll(".doc-checkbox:checked").length > 0;
        if (deleteSelectedBtn) deleteSelectedBtn.style.display = anyChecked ? "inline-block" : "none";
      });

      const label = document.createElement("label");
      label.htmlFor = checkbox.id;
      label.textContent = doc;
      label.style.marginLeft = "8px";

      li.appendChild(checkbox);
      li.appendChild(label);

      documentList.appendChild(li);
    });

    // controls container fallback
    const docControls = document.getElementById("document-controls") || document.querySelector(".doc-controls") || (refreshBtn ? refreshBtn.parentNode : null);

    // lazily create Select All / Unselect All / Delete Selected buttons once
    if (!selectAllBtn && documents.length > 0) {
      selectAllBtn = document.createElement("button");
      selectAllBtn.id = "select-all-btn";
      selectAllBtn.type = "button";
      selectAllBtn.textContent = "Select All";
      selectAllBtn.className = "btn";
      selectAllBtn.style.display = "inline-block";
      selectAllBtn.addEventListener("click", () => {
        document.querySelectorAll(".doc-checkbox").forEach(cb => cb.checked = true);
        if (deleteSelectedBtn) deleteSelectedBtn.style.display = "inline-block";
      });

      unselectAllBtn = document.createElement("button");
      unselectAllBtn.id = "unselect-all-btn";
      unselectAllBtn.type = "button";
      unselectAllBtn.textContent = "Unselect All";
      unselectAllBtn.className = "btn";
      unselectAllBtn.style.display = "inline-block";
      unselectAllBtn.addEventListener("click", () => {
        document.querySelectorAll(".doc-checkbox").forEach(cb => cb.checked = false);
        if (deleteSelectedBtn) deleteSelectedBtn.style.display = "none";
      });

      // ensure deleteSelected exists (create it if not)
      if (!deleteSelectedBtn) {
        deleteSelectedBtn = document.createElement("button");
        deleteSelectedBtn.id = "delete-selected-btn";
        deleteSelectedBtn.type = "button";
        deleteSelectedBtn.textContent = "Delete Selected";
        deleteSelectedBtn.className = "delete-selected-btn delete-btn";
        deleteSelectedBtn.style.display = "none";
        deleteSelectedBtn.addEventListener("click", deleteSelectedDocuments);
      }

      if (docControls) {
        // place select/unselect on the left of the secondary controls, delete on the right
        docControls.prepend(unselectAllBtn);
        docControls.prepend(selectAllBtn);
        docControls.appendChild(deleteSelectedBtn);
      } else if (refreshBtn && refreshBtn.parentNode) {
        refreshBtn.parentNode.insertBefore(selectAllBtn, refreshBtn);
        refreshBtn.parentNode.insertBefore(unselectAllBtn, refreshBtn);
        refreshBtn.parentNode.insertBefore(deleteSelectedBtn, refreshBtn.nextSibling);
      } else {
        document.body.appendChild(selectAllBtn);
        document.body.appendChild(unselectAllBtn);
        document.body.appendChild(deleteSelectedBtn);
      }
    }

    offset += limit;
    loadMoreBtn.style.display = offset < totalDocs ? "block" : "none";

    // ensure delete button visibility reflects current selections
    if (deleteSelectedBtn) {
      deleteSelectedBtn.style.display = document.querySelectorAll(".doc-checkbox:checked").length > 0 ? "inline-block" : "none";
    }
  } catch (err) {
    console.error("Error fetching documents:", err);
    documentList.innerHTML = "<li>Error fetching documents.</li>";
  }
}

// async function deleteDocument(filename, liElement) {
//   if (!confirm(`Delete document "${filename}"?`)) return;

//   try {
//     const response = await fetch(
//       `https://chicory-lane.onrender.com/documents/${encodeURIComponent(
//         filename
//       )}`,
//       { method: "DELETE" }
//     );

//     if (response.ok) {
//       liElement.remove();
//     } else {
//       alert("Failed to delete document.");
//     }
//   } catch (err) {
//     console.error("Error deleting document:", err);
//     alert("Error deleting document.");
//   }
// }

async function deleteSelectedDocuments() {
  const checked = Array.from(document.querySelectorAll(".doc-checkbox:checked")).map(cb => cb.value);
  if (checked.length === 0) return;
  if (!confirm(`Delete ${checked.length} selected document(s)?`)) return;

  if (deleteSelectedBtn) deleteSelectedBtn.disabled = true;
  statusDiv.textContent = "Deleting selected documents...";

  try {
    // delete each in sequence or in parallel; use Promise.all for parallel deletes
    const deletePromises = checked.map((filename) =>
      fetch(`https://chicory-lane.onrender.com/documents/${encodeURIComponent(filename)}`, { method: "DELETE" })
        .then((res) => ({ filename, ok: res.ok, status: res.status }))
        .catch((err) => ({ filename, ok: false, error: err }))
    );

    const results = await Promise.all(deletePromises);
    const failed = results.filter(r => !r.ok);

    if (failed.length > 0) {
      console.error("Some deletes failed:", failed);
      statusDiv.textContent = `Failed to delete ${failed.length} document(s).`;
    } else {
      statusDiv.textContent = "Selected documents deleted.";
    }

    // refresh the list to keep state simple
    await fetchDocuments(true);
  } catch (err) {
    console.error("Error deleting selected documents:", err);
    statusDiv.textContent = "Error deleting documents.";
  } finally {
    if (deleteSelectedBtn) deleteSelectedBtn.disabled = false;
    if (deleteSelectedBtn) deleteSelectedBtn.style.display = "none";
  }
}

refreshBtn.addEventListener("click", () => fetchDocuments(true));
loadMoreBtn.addEventListener("click", () => fetchDocuments(false));
window.addEventListener("load", () => fetchDocuments(true));
