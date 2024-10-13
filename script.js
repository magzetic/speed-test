// Download Test
document.getElementById('start-test').addEventListener('click', () => {
  const meter = document.getElementById('meter');
  const currentSpeedDisplay = document.getElementById('current-speed');
  const resultsDisplay = document.getElementById('results');
  const fileSizeSelect = document.getElementById('file-size');

  // Get the selected file URL
  const testFileUrl = fileSizeSelect.value;

  // Reset meter and speed display
  meter.style.width = '0%'; // Start with 0% width
  currentSpeedDisplay.innerText = 'Speed: 0 MB/s'; // Reset speed display
  resultsDisplay.innerText = ''; // Clear previous results
  resultsDisplay.style.opacity = '0'; // Hide results display

  const startTime = performance.now();
  let lastTime = startTime;
  let loaded = 0;

  const uniqueUrl = `${testFileUrl}?t=${new Date().getTime()}`; // Avoid caching

  fetch(uniqueUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const contentLength = response.headers.get('Content-Length');
      if (!contentLength) {
        throw new Error('Content-Length header is missing');
      }

      const totalSize = parseInt(contentLength, 10); // Get total file size

      const reader = response.body.getReader();
      return new ReadableStream({
        start(controller) {
          function read() {
            reader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }

              const currentTime = performance.now();
              loaded += value.length; // Update loaded bytes

              // Calculate progress percentage
              const percent = (loaded / totalSize) * 100;
              meter.style.width = `${percent}%`; // Update the meter's width

              // Calculate dynamic speed in MB/s
              const timeElapsed = (currentTime - lastTime) / 1000; // Time since last update in seconds
              const speed = value.length / (1024 * 1024) / timeElapsed; // Speed in MB/s

              // Update the speed display below the meter
              currentSpeedDisplay.innerText = `Speed: ${speed.toFixed(2)} MB/s`;

              lastTime = currentTime; // Update last time for next chunk

              controller.enqueue(value);
              read();
            });
          }

          read();
        },
      });
    })
    .then((stream) => new Response(stream).blob())
    .then((blob) => {
      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000; // Time taken in seconds

      // Calculate final speed in MB/s
      const fileSize = blob.size / (1024 * 1024); // size in MB
      const finalSpeed = fileSize / duration; // speed in MB/s

      // Display results and reset meter
      resultsDisplay.innerHTML = `Download completed.<br>File size: ${fileSize.toFixed(
        2
      )} MB<br>Time taken: ${duration.toFixed(
        2
      )} seconds<br>Average speed: ${finalSpeed.toFixed(2)} MB/s`;
      resultsDisplay.style.opacity = '1'; // Fade-in results
      meter.style.width = '100%'; // Fill the meter
      currentSpeedDisplay.innerText = `Speed: ${finalSpeed.toFixed(2)} MB/s`; // Final speed display
    })
    .catch((error) => {
      console.error('Error fetching the test file:', error);
      resultsDisplay.innerText = 'Error fetching the test file.';
      resultsDisplay.style.opacity = '1'; // Show error message
      meter.style.width = '0%'; // Reset meter on error
    });
});
