const form = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');
const statusDiv = document.getElementById('status');
const textInput = document.getElementById('text-input');
const submitTextBtn = document.getElementById('submit-text-btn');

// Handle the original file upload form
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const file = fileInput.files[0];
  if (!file) {
    statusDiv.textContent = 'Please select a file.';
    return;
  }

  if (file.type !== 'text/plain') {
    statusDiv.textContent = 'Please select a plain text file (.txt).';
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  statusDiv.textContent = 'Uploading...';

  try {
    const response = await fetch('https://chicory-lane.onrender.com/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      statusDiv.textContent = result.message;
    } else {
      statusDiv.textContent = 'Upload failed.';
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    statusDiv.textContent = 'An error occurred.';
  }
});

// Handle the new text submission button
submitTextBtn.addEventListener('click', async () => {
  const text = textInput.value;
  if (!text.trim()) {
    statusDiv.textContent = 'Please enter some text.';
    return;
  }

  // Create a Blob from the text
  const textBlob = new Blob([text], { type: 'text/plain' });

  // Create a FormData object and append the Blob as a file
  const formData = new FormData();
  formData.append('file', textBlob, 'pasted-text.txt');

  statusDiv.textContent = 'Submitting text...';

  try {
    const response = await fetch('https://chicory-lane.onrender.com/upload', {
      method: 'POST',
      body: formData, // Send the FormData object
    });

    if (response.ok) {
      const result = await response.json();
      statusDiv.textContent = result.message;
      textInput.value = ''; // Clear the textarea on success
    } else {
      statusDiv.textContent = 'Text submission failed.';
    }
  } catch (error) {
    console.error('Error submitting text:', error);
    statusDiv.textContent = 'An error occurred.';
  }
});
