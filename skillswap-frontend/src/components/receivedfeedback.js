import React, { useState, useEffect } from "react";
import { Typography, Box, Rating } from "@mui/material";
import Image from "next/image";

const ReviewsComponent = ({ reviews, reviewerId }) => {
  // Calculate average rating
  const calculateAverageRating = (feedbackList) => {
    if (feedbackList.length === 0) return 0;
    const totalRating = feedbackList.reduce((acc, curr) => acc + curr.starRating, 0);
    return totalRating / feedbackList.length;
  };

  // console.log(props.revieweeId);

  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    async function updateList(reviews) {
      const reviewList = await fetchFeedbackPictures(reviews);
      setFeedbackList(reviewList);
    }
    updateList(reviews);
  }, [reviews]);

  async function deleteReview(id) {
    try {
      const resGet = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + `/review/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  async function imageURL(file) {
    if (file == null) {
      return null;
    }
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
          `/review/reviewImage/${file}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (response.ok) {
        console.log("Image fetched for file: ", file);
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        return imageUrl;
      }
      if (!response.ok) {
        // If image is not found, return a placeholder image URL
        console.log("Error fetching image:");

        // return "https://www.svgrepo.com/show/209349/user-avatar.svg/";
      }
    } catch (error) {
      console.log("Error fetching image:", error);
      // If there's an error, return a placeholder image URL
      // return "https://www.svgrepo.com/show/209349/user-avatar.svg/";
    }
  }

  async function fetchFeedbackPictures(reviews) {
    const feedbacksWithPictures = await Promise.all(
      reviews.map(async (review) => {
        const imageUrl = await imageURL(review.reviewImageName);
        // console.log(imageUrl);
        console.log({ ...review, imageUrl });
        return { ...review, imageUrl };
      })
    );
    return feedbacksWithPictures;
  }
  console.log(feedbackList);


  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <div className=" sm:w-full sm:max-w-3xl">
        <h2 className=" text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Reviews
        </h2>
      </div>
      <Box mb={2} className="flex items-center">
        <Rating value={calculateAverageRating(feedbackList)} readOnly />
        <Typography>({reviews.length} reviews)</Typography>
      </Box>
      {reviews.length === 0 ? (
        <Typography>No reviews yet.</Typography>
      ) : (
        <div>
          {feedbackList?.map((review, index) => (
            <div key={index} className="mt-4 flex flex-row justify-between">
              <div className="">
                <Typography variant="body1">
                  <strong>{review.reviewerName}:</strong> {review.feedback}
                </Typography>
                <Rating value={review.starRating} readOnly />
                <div className="text-sm font-extralight">{review.createdAt.split("T", 1)}</div>
                {review.reviewImageName && (
                  <>
                    <Image
                      className=" my-4"
                      alt={`Reviwed as ${review.feedback}`}
                      src={review.imageUrl}
                      width={150}
                      height={150}
                    />
                  </>
                )}
              </div>
              <div className="flex flex-row">
                {reviewerId === review.reviewerId ? (
                  <div className="">
                    <button
                      onClick={(e) => deleteReview(review.id)}
                      type="button"
                      className="flex w-fit mx-2 justify-center rounded-md bg-red-500  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsComponent;
