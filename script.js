document.addEventListener("DOMContentLoaded", function () {
  // Add event listeners for search button and select element
  document.getElementById("select-el").addEventListener("change", handleSelectChange);
  // document.getElementById("select-el2").addEventListener("change", handleSearch);
  let searchBtn = document.getElementById("search-button");
  searchBtn.addEventListener("click", handleSearch);
});

// Function to handle changes in the select element
function handleSelectChange(event) {
  let selectedValue = event.target.value;
  if (selectedValue === "1") {
    openCamera();
  } else if (selectedValue === "2") {
    clearImagePreview();
    createImageInput();
  } else {
    clearImagePreview();
  }
}

// Function to handle search action
async function handleSearch() {
  const selectedVal = document.getElementById("select-el2").value;
  if (selectedVal === "1") {
    search();
  } else if (selectedVal === "2") {
    search2();
  } else {
    console.log("Select option First");
  }
}

// Function to clear image preview
function clearImagePreview() {
  const capturedImgPreview = document.getElementById("capturedImg-preview");
  capturedImgPreview.innerHTML = '';
}

// Function to create image input
function createImageInput() {
  const existingDiv = document.getElementById("upload-image-div");
  if (!existingDiv) {
    const div = document.createElement("div");
    div.innerHTML = `
      <input type="file" id="file-input" accept="image/*" onchange="previewFile()" style="margin-top: 10px;">
      <label for="file-input" class="file-label">Choose File</label>`;
    div.id = "upload-image-div";
    div.classList.add("input-option");
    const capturedImgPreview = document.getElementById("capturedImg-preview");
    capturedImgPreview.appendChild(div);
  }
}

// Function to preview selected image file
function previewFile() {
  const fileInput = document.getElementById('file-input');
  const capturedImgPreview = document.getElementById("capturedImg-preview");

  if (!fileInput.files || !fileInput.files[0]) {
    return;
  }

  const imagePrev = document.getElementById("image-preview");
  if (!imagePrev) {
    const createdDiv2 = document.createElement("div");
    createdDiv2.innerHTML = '<img id="image-preview" src="#" alt="Preview">';
    createdDiv2.classList.add("preview-container");
    capturedImgPreview.appendChild(createdDiv2);
  }

  const imagePreview = document.getElementById('image-preview');
  const reader = new FileReader();

  reader.onload = function (e) {
    imagePreview.src = e.target.result;
  };

  reader.readAsDataURL(fileInput.files[0]);
}

// Function to open camera and capture image
async function openCamera() {
  const capturedImgPreview = document.getElementById("capturedImg-preview");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement('video');
    const captureButton = document.createElement('button');
    const retakeButton = document.createElement('button');

    video.srcObject = stream;
    video.autoplay = true;
    capturedImgPreview.innerHTML = '';
    capturedImgPreview.appendChild(video);
    capturedImgPreview.appendChild(captureButton);

    captureButton.textContent = 'Capture Now';
    captureButton.onclick = async () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const capturedImage = document.createElement('img');
      capturedImage.src = canvas.toDataURL('image/jpeg');
      capturedImgPreview.innerHTML = '';
      capturedImgPreview.appendChild(capturedImage);
      capturedImgPreview.appendChild(retakeButton);
      stream.getTracks().forEach(track => track.stop());
    };

    retakeButton.textContent = 'Retake';
    retakeButton.onclick = () => {
      capturedImgPreview.innerHTML = '';
      openCamera();
    };
  } catch (error) {
    console.error('Error accessing the camera:', error);
    alert('Error accessing the camera. Please make sure your camera is connected and accessible.');
  }
}



// Function to handle search action
async function search() {
  const imagePreview = document.getElementById('image-preview');

  if (!imagePreview || imagePreview.src === '#' || !imagePreview.src.startsWith('data:image')) {
    alert('Please select a valid image first.');
    return;
  }

  try {
    // Validate if the image contains features consistent with a leaf
    const isLeafPhoto = await validateLeafPhoto(imagePreview.src);

    if (!isLeafPhoto) {
      alert('Please upload a photo of a leaf.');
      return;
    }

    // Proceed with searching for plant details
    const imageData = imagePreview.src.split(',')[1]; // Extract base64-encoded image data
    const requestOptions = {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ image: imageData }), // Send image data as JSON
      redirect: "follow"
    };

    const response = await fetch("https://api-inference.huggingface.co/models/Ayush7871/medicinal_plants_image_detection", requestOptions);
    if (response.ok) {
      const result = await response.json();
      if (result && result.length > 0) {
        displayResult(result);
      } else {
        displayNoResultMessage();
      }
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while processing the image. Please try again later.');
  }
}

 // Function to handle search2 action
 async function search2() {
  const imagePreview = document.getElementById('image-preview');

  if (!imagePreview || imagePreview.src === '#' || !imagePreview.src.startsWith('data:image')) {
    alert('Please select a valid image first.');
    return;
  }

  try {
    // Validate if the image contains features consistent with a leaf
    const isLeafPhoto = await validateLeafPhoto(imagePreview.src);

    if (!isLeafPhoto) {
      alert('Please upload a photo of a leaf.');
      return;
    }

    // Proceed with searching for plant details
    const imageData = imagePreview.src.split(',')[1]; // Extract base64-encoded image data
    const requestOptions = {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ image: imageData }), // Send image data as JSON
      redirect: "follow"
    };

    const response = await fetch("https://api-inference.huggingface.co/models/Harsh994/PlantDiseaseRecoginition", requestOptions);
    if (response.ok) {
      const result = await response.json();
      if (result && result.length > 0) {
        displayResult(result);
      } else {
        displayNoResultMessage();
      }
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while processing the image. Please try again later.');
  }
}


// Function to validate if the image contains features consistent with a leaf
async function validateLeafPhoto(imageSrc) {
  // Placeholder function - You can implement the logic for leaf photo validation here
  return true; // For simplicity, always return true
}

// Function to display search result
function displayResult(result) {
  const resultContainer = document.querySelector('.result');
  resultContainer.innerHTML = ''; // Clear previous result

  const resultTitle = document.createElement('h2');
  resultTitle.textContent = 'Search Result';
  resultContainer.appendChild(resultTitle);
  
  if (result && result.length > 0) {
    const plantDetails = result[0]; // Assuming the first result contains details of the plant

    if (Object.keys(plantDetails).length > 0) {
      const detailsList = document.createElement('ul');
      detailsList.classList.add('plant-details');

      for (const [key, value] of Object.entries(plantDetails)) {
        if (key !== 'score') { // Exclude 'score' property
          const listItem = document.createElement('li');
          listItem.innerHTML = `<strong>${key}:</strong> ${value}`;
          detailsList.appendChild(listItem);
        }
      }

      resultContainer.appendChild(detailsList);
    } else {
      const noResultMsg = document.createElement('p');
      noResultMsg.textContent = 'No plant details found for the provided image.';
      resultContainer.appendChild(noResultMsg);
    }
  } else {
    displayNoResultMessage();
  }
}

// Function to display no result message
function displayNoResultMessage() {
  const resultContainer = document.querySelector('.result');
  resultContainer.innerHTML = ''; // Clear previous result

  const noResultMsg = document.createElement('p');
  noResultMsg.textContent = 'No matching plant found for the provided image.';
  resultContainer.appendChild(noResultMsg);
}
// Function to make a POST request to the Flask API
async function predictImage(imageFile) {
  // Create FormData object to send the file
  const formData = new FormData();
  formData.append('file', imageFile);

  try {
      const response = await fetch('http://localhost:5000/predict', {
          method: 'POST',
          body: formData
      });

      if (!response.ok) {
          throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error:', error);
      return { error: 'An error occurred while processing the image' };
  }
}

// Example usage:
const inputFile = document.getElementById('fileInput').files[0]; // Assuming file input element has id="fileInput"
if (inputFile) {
  predictImage(inputFile)
      .then(data => {
          console.log('Prediction result:', data);
          // Handle the prediction result here
      })
      .catch(error => {
          console.error('Error:', error);
          // Handle the error here
      });
} else {
  console.error('No file selected');
  // Handle case where no file is selected
}