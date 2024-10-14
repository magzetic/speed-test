const { jsPDF } = window.jspdf;

document.getElementById('convertButton').addEventListener('click', () => {
  const input = document.getElementById('fileInput');
  const files = input.files;

  if (files.length === 0) {
    alert('Please select one or more JPG files to convert.');
    return;
  }

  const pdf = new jsPDF();

  Array.from(files).forEach((file, index) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const imgData = event.target.result;

      const img = new Image();
      img.src = imgData;
      img.onload = function () {
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (img.height / img.width) * imgWidth; // Maintain aspect ratio

        // Adding image to PDF
        if (index > 0) {
          pdf.addPage(); // Add a new page for each image after the first
        }

        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

        // If it's the last image, save the PDF
        if (index === files.length - 1) {
          pdf.save('converted.pdf'); // Save the PDF
        }
      };
    };
    reader.readAsDataURL(file); // Read the file as data URL
  });
});
