const form = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');
const statusDiv = document.getElementById('status');

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