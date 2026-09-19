async function getFeedback() {
  try {
    const response = await fetch("http://localhost:5000/feedback");
    const feedbacks = await response.json();
    console.log(feedbacks)
    const feedbackList = document.getElementById("feedbackList");
    feedbackList.innerHTML = "";
    feedbacks.forEach((feedback) => {
      const feedbackCard = document.createElement("div");
      feedbackCard.innerHTML = `
        <h3>${feedback.name}</h3>
        <p>${feedback.rating}/5</p>
        <p>${feedback.comments || feedback.comment}</p>
        <div class="feedback-actions">

  <button onclick="deleteFeedback('${feedback._id}')">
    Delete
  </button>

  <button onclick="editFeedback(
    '${feedback._id}',
    '${feedback.name}',
    '${feedback.rating}',
    '${feedback.comments}'
  )">
    Edit
  </button>

</div>
      `;
      feedbackList.appendChild(feedbackCard);
    });
  } catch (error) {
    console.log("Error:", error);
  }
}
async function deleteFeedback(id) {
  try {
    const response = await fetch(
      `http://localhost:5000/feedback/${id}`,
      {
        method: "DELETE"
      }
    );
    const data = await response.json();
    alert(data.message);
    getFeedback();
  } catch (err) {
    console.log("ERROR:", err);
  }
}
async function editFeedback(id, oldName, oldRating, oldComments) {
  const name = prompt("Enter new name:", oldName);
  const rating = prompt("Enter new rating:", oldRating);
  const comments = prompt("Enter new comment:", oldComments);
  try {
    const response = await fetch(
      `http://localhost:5000/feedback/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          rating: Number(rating),
          comments: comments
        })
      }
    );
    const data = await response.json();
    alert(data.message);
    getFeedback();
  } catch (error) {
    console.log("Error:", error);
  }
}
getFeedback();