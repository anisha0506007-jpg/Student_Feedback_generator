
const API_URL = "https://student-feedback-generator-1.onrender.com/feedback";

const feedbackForm = document.getElementById("feedbackForm");
const message = document.getElementById("message");
const submitButton = document.getElementById("submitButton");
const commentsInput = document.getElementById("comments");
const charCount = document.getElementById("charCount");

document.getElementById("currentYear").textContent =
  new Date().getFullYear();

// Live comment character counter
commentsInput.addEventListener("input", () => {
  charCount.textContent = commentsInput.value.length;
});

feedbackForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const rating = document.getElementById("rating").value;
  const comments = commentsInput.value.trim();

  if (!name || !rating || !comments) {
    showMessage("Please fill in all the fields.", "error");
    return;
  }

  if (Number(rating) < 1 || Number(rating) > 5) {
    showMessage("Please select a rating between 1 and 5.", "error");
    return;
  }

  const feedbackData = {
    name,
    rating: Number(rating),
    comments
  };

  submitButton.disabled = true;
  submitButton.querySelector("span:first-child").textContent =
    "Submitting...";
  message.textContent = "";
  message.className = "form-message";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(feedbackData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to submit feedback.");
    }

    showMessage(
      data.message || "Thank you! Your feedback was submitted successfully.",
      "success"
    );

    feedbackForm.reset();
    charCount.textContent = "0";

  } catch (error) {
    console.error("Error submitting feedback:", error);

    showMessage(
      error.message || "Something went wrong. Please try again.",
      "error"
    );
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector("span:first-child").textContent =
      "Submit Feedback";
  }
});

function showMessage(text, type) {
  message.textContent = text;
  message.className = `form-message ${type}`;
}

