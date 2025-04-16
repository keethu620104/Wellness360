const fileInput = document.getElementById('pdf-upload');
const fileNameBox = document.getElementById('file-name-box');

// ✅ Update file name preview when user selects a file
fileInput.addEventListener('change', function () {
  fileNameBox.textContent = this.files.length > 0 ? this.files[0].name : "";
});

// ✅ Handle file upload
document.getElementById("uploadForm").addEventListener("submit", async function(e) {
  e.preventDefault(); // Prevent form submission

  const formData = new FormData(this);

  try {
    const response = await fetch("http://127.0.0.1:3000/upload-report", {
      method: "POST",
      body: formData
    });

    const resultText = await response.text();

    if (response.ok) {
      alert("✅ " + resultText);
      fetchAndDisplayFiles(); // Refresh list after upload
    } else {
      alert("❌ Upload failed: " + resultText);
    }
  } catch (err) {
    alert("⚠️ Error occurred: " + err.message);
  }
});

// ✅ Reusable function to fetch and display file list
function fetchAndDisplayFiles() {
  fetch('/reports')
    .then(response => response.json())
    .then(files => {
      const fileList = document.getElementById('fileList');
      fileList.innerHTML = ''; // Clear list

      files.forEach(file => {
        const listItem = document.createElement('li');

        const fileLink = document.createElement('a');
        fileLink.href = `/reports/${file._id}`;
        fileLink.textContent = file.name;
        fileLink.target = '_blank';

        const downloadIcon = document.createElement('i');
        downloadIcon.className = 'fa fa-download download-icon';
        downloadIcon.onclick = function () {
          const downloadLink = document.createElement('a');
          downloadLink.href = `/reports/${file._id}?download=true`;
          downloadLink.download = file.name;
          downloadLink.click();
        };

        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fas fa-trash-alt delete-icon';
        deleteIcon.onclick = function () {
          if (confirm(`Delete "${file.name}"?`)) {
            fetch(`/reports/${file._id}`, { method: 'DELETE' })
              .then(res => {
                if (res.ok) {
                  alert(`✅ "${file.name}" has been deleted.`);
                  fetchAndDisplayFiles(); // Refresh list after delete
                } else {
                  alert(`❌ Failed to delete "${file.name}".`);
                }
              })
              .catch(err => {
                console.error('Delete error:', err);
                alert('⚠️ An error occurred while deleting.');
              });
          }
        };

        listItem.appendChild(fileLink);
        listItem.appendChild(downloadIcon);
        listItem.appendChild(deleteIcon);
        fileList.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error('Error fetching file list:', error);
    });
}

// 🔁 Auto-refresh every 5 seconds
setInterval(fetchAndDisplayFiles, 2000);

// 🔃 Initial fetch on page load
fetchAndDisplayFiles();
