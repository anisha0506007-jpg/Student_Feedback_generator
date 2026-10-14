
const API_URL = "https://student-feedback-generator-1.onrender.com/feedback";

const feedbackList = document.getElementById("feedbackList");

document.getElementById("currentYear").textContent =
  new Date().getFullYear();

async function getFeedback() {
  feedbackList.replaceChildren();

  const loading = document.createElement("div");
  loading.className = "loading-card";

  const spinner = document.createElement("span");
  spinner.className = "loading-spinner";

  const loadingText = document.createElement("p");
  loadingText.textContent = "Loading student feedback...";

  loading.append(spinner, loadingText);
  feedbackList.appendChild(loading);

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Unable to load feedback.");
    }

    const feedbacks = await response.json();

    if (!Array.isArray(feedbacks)) {
      throw new Error("Unexpected feedback data received.");
    }

    feedbackList.replaceChildren();

    if (feedbacks.length === 0) {
      showEmptyState();
      return;
    }

    feedbacks.forEach((feedback) => {
      feedbackList.appendChild(createFeedbackCard(feedback));
    });

  } catch (error) {
    console.error("Error fetching feedback:", error);
    showErrorState();
  }
}

function createFeedbackCard(feedback) {
  const card = document.createElement("article");
  card.className = "feedback-card";

  const name = String(feedback.name || "Anonymous");
  const rating = Math.min(5, Math.max(0, Number(feedback.rating) || 0));
  const comments = String(feedback.comments ?? feedback.comment ?? "");
  const id = String(feedback._id || "");

  // Card header
  const header = document.createElement("div");
  header.className = "feedback-card-header";

  const user = document.createElement("div");
  user.className = "feedback-user";

  const avatar = document.createElement("div");
  avatar.className = "feedback-avatar";
  avatar.textContent = name.trim().charAt(0).toUpperCase() || "?";
  avatar.setAttribute("aria-hidden", "true");

  const userDetails = document.createElement("div");

  const userName = document.createElement("h3");
  userName.textContent = name;

  const userLabel = document.createElement("p");
  userLabel.textContent = "Student feedback";

  userDetails.append(userName, userLabel);
  user.append(avatar, userDetails);

  const ratingPill = document.createElement("span");
  ratingPill.className = "rating-pill";

  const ratingStar = document.createElement("span");
  ratingStar.className = "rating-star";
  ratingStar.textContent = "★";

  const ratingText = document.createElement("span");
  ratingText.textContent = `${rating}/5`;

  ratingPill.append(ratingStar, ratingText);
  header.append(user, ratingPill);

  // Star rating
  const stars = document.createElement("div");
  stars.className = "feedback-stars";
  stars.setAttribute("aria-label", `Rating: ${rating} out of 5`);

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.textContent = "★";

    if (i > rating) {
      star.className = "empty-star";
    }

    stars.appendChild(star);
  }

  // Student comment
  const comment = document.createElement("p");
  comment.className = "feedback-comment";
  comment.textContent = comments || "No comment provided.";

  // Divider
  const divider = document.createElement("div");
  divider.className = "feedback-card-divider";

  // Actions
  const actions = document.createElement("div");
  actions.className = "feedback-actions";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "edit-button";
  editButton.textContent = "✎ Edit";
  editButton.disabled = !id;

  editButton.addEventListener("click", () => {
    editFeedback(id, name, rating, comments);
  });

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-button";
  deleteButton.textContent = "♲ Delete";
  deleteButton.disabled = !id;

  deleteButton.addEventListener("click", () => {
    deleteFeedback(id);
  });

  actions.append(editButton, deleteButton);
  card.append(header, stars, comment, divider, actions);

  return card;
}

function showEmptyState() {
  const state = document.createElement("div");
  state.className = "empty-state";

  const icon = document.createElement("div");
  icon.className = "empty-state-icon";
  icon.textContent = "✦";

  const heading = document.createElement("h3");
  heading.textContent = "No feedback yet";

  const description = document.createElement("p");
  description.textContent =
    "Be the first to share your experience and help make learning better.";

  const link = document.createElement("a");
  link.href = "index.html";
  link.className = "primary-button";
  link.textContent = "+ Share your feedback";

  state.append(icon, heading, description, link);
  feedbackList.appendChild(state);
}

function showErrorState() {
  const state = document.createElement("div");
  state.className = "error-state";

  const icon = document.createElement("div");
  icon.className = "error-state-icon";
  icon.textContent = "!";

  const heading = document.createElement("h3");
  heading.textContent = "Couldn't load feedback";

  const description = document.createElement("p");
  description.textContent =
    "Please check your connection and try loading the feedback again.";

  const retryButton = document.createElement("button");
  retryButton.type = "button";
  retryButton.className = "primary-button";
  retryButton.textContent = "Try again ↻";
  retryButton.addEventListener("click", getFeedback);

  state.append(icon, heading, description, retryButton);
  feedbackList.replaceChildren(state);
}

async function deleteFeedback(id) {
  if (!id) return;

  const confirmed = window.confirm(
    "Are you sure you want to delete this feedback? This action cannot be undone."
  );

  if (!confirmed) return;

  try {
    const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to delete feedback.");
    }

    alert(data.message || "Feedback deleted successfully.");
    await getFeedback();

  } catch (error) {
    console.error("Error deleting feedback:", error);
    alert(error.message || "Something went wrong while deleting feedback.");
  }
}

async function editFeedback(id, oldName, oldRating, oldComments) {
  if (!id) return;

  const nameInput = prompt("Enter new name:", oldName);
  if (nameInput === null) return;

  const name = nameInput.trim();

  if (!name) {
    alert("Name cannot be empty.");
    return;
  }

  const ratingInput = prompt(
    "Enter new rating (1-5):",
    String(oldRating)
  );

  if (ratingInput === null) return;

  const rating = Number(ratingInput);

  if (
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    alert("Please enter a whole number between 1 and 5.");
    return;
  }

  const commentsInput = prompt("Enter new comment:", oldComments);
  if (commentsInput === null) return;

  const comments = commentsInput.trim();

  if (!comments) {
    alert("Comment cannot be empty.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        rating,
        comments
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to update feedback.");
    }

    alert(data.message || "Feedback updated successfully.");
    await getFeedback();

  } catch (error) {
    console.error("Error editing feedback:", error);
    alert(error.message || "Something went wrong while editing feedback.");
  }
}

getFeedback();
