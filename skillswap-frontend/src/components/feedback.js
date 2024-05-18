import React, { useState, useEffect } from "react";
import {
  Typography,
  Rating,
  Button,
  TextField,
  Box,
  Snackbar,
} from "@mui/material";
import ReviewsComponent from "./receivedfeedback";

const FeedbackComponent = (props) => {
  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding leading zero if necessary
    const day = String(currentDate.getDate()).padStart(2, "0"); // Adding leading zero if necessary
    return `${year}-${month}-${day}`;
  };

  const [reviewsList, setReviewsList] = useState([]);

  const [starRating, setStarRating] = useState(0);
  const [feedback, setFeedbackComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [reviewerId, setReviewerId] = useState("");
  const [revieweeId, setRevieweeId] = useState(" ");
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    setRevieweeId(props.revieweeId);
    async function getReviewerId() {
      const resGet = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + `/user/details`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const json = await resGet.json();
      // console.log(json);
      setReviewerId(json.id);
    }

    getReviewerId();
    getReviews(props.revieweeId);
  }, [feedbackSubmitted, setReviewsList]);

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setSelectedImage(imageFile);
  };

  async function PostReviews(review) {
    const formData = new FormData();
    // console.log(JSON.stringify(review));
    const reviewContentType = "application/json"; // Define content type for reviews

    // Convert the JSON string to a Blob with the specified content type
    const reviewBlob = new Blob([JSON.stringify(review)], {
      type: reviewContentType,
    });

    // console.log(reviewBlob);

    // Append the review Blob to the FormData
    formData.append("reviewRequest", reviewBlob);
    console.log(selectedImage);

    if(selectedImage !=null)
    {
      formData.append("reviewImage", selectedImage);
    }
    const requestOptions = {
      method: "POST",
      headers: {
        // "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: formData,
    };

    try {
      const resGet = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + `/review/create`,
        requestOptions
      );

      if (resGet.ok) {
        const json = await resGet.json();
        setFeedbackSubmitted(true);
      } else {
        console.log("Error:", resGet.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
    }
  }

  async function getReviews(revieweeId) {
    // setRevieweeId(revieweeId);
    try {
      const resGet = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + `/review/${revieweeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const json = await resGet.json();
      setReviewsList(json);
      console.log("DATA FETCHED");
    } catch (error) {
      // getReviews(revieweeId);
      console.log(error);
    }
  }



  const handleSubmit = () => {
    const createdAt = getCurrentDate(); // Get current date in 'yyyy-mm-dd' format
    const review = { reviewerId, revieweeId, starRating, feedback, createdAt };
    setReviews([...reviews, review]);
    setStarRating(0);
    setFeedbackComment("");
    PostReviews(review);
    setSelectedImage(null);
    setFeedbackSubmitted(true);
  };

  const handleSnackbarClose = () => {
    setFeedbackSubmitted(false);
  };

  return (
    <>
      <ReviewsComponent reviews={reviewsList} reviewerId={reviewerId} />
      {props.addFeedback && (
        <>
          <div className="bg-white rounded-md p-4 border my-4">
            <Typography variant="h6" gutterBottom>
              Rate Your Experience
            </Typography>
            <Box mb={2}>
              <Rating
                name="rating"
                value={starRating}
                onChange={(event, newValue) => {
                  setStarRating(newValue);
                }}
              />
            </Box>
            <TextField
              label="Leave a Comment"
              multiline
              rows={4}
              value={feedback}
              onChange={(e) => setFeedbackComment(e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
            />

            <form encType="multipart/form-data">
              <div className="appearance-none flex-col flex justify-center  py-5   rounded w-full text-gray-700 leading-tight focus:outline-none focus:border-blue-500">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </form>
            <Button
              variant="contained"
              className="bg-indigo-600 hover:bg-indigo-500"
              onClick={handleSubmit}
            >
              Submit Feedback
            </Button>

            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              open={feedbackSubmitted}
              autoHideDuration={6000}
              onClose={handleSnackbarClose}
              message="Feedback submitted successfully!"
            />
          </div>
        </>
      )}
    </>
  );
};

export default FeedbackComponent;
