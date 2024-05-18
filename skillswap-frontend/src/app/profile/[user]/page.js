"use client"; // This is a client component 👈🏽
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import profilePhoto from "../../../../public/profilePhoto.svg";
import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/joy/CircularProgress";
import Grid from "@mui/material/Grid";
import Post from "@/components/post";
import FeedbackComponent from "@/components/feedback";

export default function UserProfile() {
  const [imageSrc, setImageSrc] = useState();
  const [dataFetched, setDataFetched] = useState(null);
  const [penClicked, setPenClicked] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(" ");
  const [aboutMe, setAboutMe] = useState("");
  const [mobile, setMobile] = useState("");
  const [pincode, setPincode] = useState("");
  const [age, setAge] = useState("");
  const [revieweeId, setRevieweeId] = useState("");
  const [linkedInLink, setLinkedInLink] = useState(null);
  const [instagramLink, setInstagramLink] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState(null);
  const [skillList, setSkillList] = useState([]);
  const [iseditClicked, setIsEditCliked] = useState(true);
  const [postArray, setPostArray] = useState([]);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/user/test",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (res.ok) {
      let username = params.user;
      username = username.replace("%40", "@");

      const resGet = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
          `/user/details?email=${username}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (resGet.ok) {
        const json = await resGet.json();
        setDataFetched(json);
        setFirstName(json.firstName);
        setLastName(json.lastName);
        setAboutMe(json.description);
        setMobile(json.mobile);
        setPincode(json.pincode);
        setAge(json.age);
        setRevieweeId(json.id);
        setLinkedInLink(json.linkedInLink);
        setInstagramLink(json.instagramLink);
        setYoutubeLink(json.youtubeLink);
        await fetchImage(json.profilePictureName);
        const tempSkillList = [];
        for (const index in json.userSkills) {
          tempSkillList.push(json.userSkills[index].skill.skillName);
        }
        setSkillList(tempSkillList);

        fetchPosts(json.id);
      }
    } else {
      router.push("/");
    }
  }

  const fetchImage = async (props) => {
    try {
      // Fetch image from backend (replace 'YOUR_IMAGE_ENDPOINT' with your actual image endpoint)
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
          `/user/profilePicture/${props}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (response.ok) {
        // Convert response to blob
        const imageBlob = await response.blob();
        // Create object URL for the blob
        const imageUrl = URL.createObjectURL(imageBlob);
        setImageSrc(imageUrl);
      } else {
        console.error("Failed to fetch image:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  async function fetchPosts(userId) {
    const queryParam = "?userId=" + userId;
    const resGet = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
        `/user/post/getPosts` +
        queryParam,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (resGet.ok) {
      const json = await resGet.json();
      const newArray = [];

      json.forEach((element) => {
        const name = element.user.firstName + " " + element.user.lastName;
        const content = element.content;
        const email = element.user.email;
        const skillId = element.skill.skillId;
        const createDate = element.createdAt;

        const newPost = {
          name: name,
          content: content,
          email: email,
          skillId: skillId,
          createDate: createDate,
        };
        newArray.push(newPost);
      });
      // Sort newArray based on createDate in descending order
      newArray.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
      setPostArray(newArray);
    }
  }

  function ToggleEditButton() {
    setIsEditCliked(!iseditClicked);
  }

  function handleImageCancel() {
    setPenClicked(false);
    setSelectedImage(null);
  }

  function handleImageSave() {
    setPenClicked(false);
    handleUploadImage();
  }
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8 bg-gray-50">
        <div className=" sm:w-full sm:max-w-3xl">
          <h2 className="m-6 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            User Profile
          </h2>
        </div>
        <div className="flex flex-row ">
          <div className="my-6 flex flex-col mx-10 min-w-3xl w-1/3 border bg-white p-4 rounded-md">
            {dataFetched ? (
              <>
                <div>
                  {selectedImage ? (
                    <>
                      <Image
                        className="m-auto my-4"
                        alt={`Profile photo of ${dataFetched.firstName}`}
                        src={URL.createObjectURL(selectedImage)}
                        width={200}
                        height={200}
                      />
                    </>
                  ) : (
                    <>
                      {imageSrc ? (
                        <>
                          <Image
                            className="m-auto my-4"
                            alt={`Profile photo of ${dataFetched.firstName}`}
                            src={imageSrc}
                            width={200}
                            height={200}
                          />
                        </>
                      ) : (
                        <Image
                          className="m-auto my-4"
                          src={profilePhoto}
                          width={75}
                          height={75}
                          alt={`Profile photo of ${dataFetched.firstName}`}
                        />
                      )}
                    </>
                  )}
                </div>

                <div className="space-y-2 my-4">
                  <div>
                    <div className="grid grid-cols-2">
                      <div>
                        <label
                          htmlFor="first name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          First Name
                        </label>
                        <p className="block mt-2 w-3/4 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6">
                          {firstName}
                        </p>
                      </div>
                      <div>
                        <label
                          htmlFor="last name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Last Name
                        </label>
                        <p className="block mt-2 w-3/4 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6">
                          {lastName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <label
                    htmlFor="phone number"
                    className="block text-sm font-medium leading-6  text-gray-900"
                  >
                    About me
                  </label>
                  <p
                    className="block mt-2 w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                    rows="5"
                  >
                    {aboutMe}
                  </p>
                  <label
                    htmlFor="phone number"
                    className="block text-sm font-medium leading-6  text-gray-900"
                  >
                    Phone no.
                  </label>
                  <p className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6">
                    {mobile}
                  </p>
                  <label
                    htmlFor="pincode"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Pincode
                  </label>
                  <p className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6">
                    {pincode}
                  </p>
                  <label
                    htmlFor="Age"
                    className="block text-sm font-medium leading-6  text-gray-900"
                  >
                    Age
                  </label>

                  <p className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6">
                    {age}
                  </p>
                  {dataFetched.linkedInLink ? (
                    <>
                      <label
                        htmlFor="linkedInLink"
                        className="block text-sm font-medium leading-6  text-gray-900"
                      >
                        LinkedIn
                      </label>

                      <p className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6">
                        {linkedInLink}
                      </p>
                    </>
                  ) : (
                    <></>
                  )}

                  {dataFetched.instagramLink ? (
                    <>
                      <label
                        htmlFor="instagramLink"
                        className="block text-sm font-medium leading-6  text-gray-900"
                      >
                        Instagram
                      </label>

                      <p className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6">
                        {instagramLink}
                      </p>
                    </>
                  ) : (
                    <></>
                  )}

                  {dataFetched.youtubeLink ? (
                    <>
                      <label
                        htmlFor="youtubeLink"
                        className="block text-sm font-medium leading-6  text-gray-900"
                      >
                        Youtube
                      </label>

                      <p className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6">
                        {youtubeLink}
                      </p>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                {skillList.length > 0 ? (
                  <>
                    <label
                      htmlFor="Skills"
                      className="block text-sm font-medium leading-6  text-gray-900"
                    >
                      My Skills
                    </label>
                    <div className="bg-white border-gray-300 border p-4 rounded-md mb-4 max-w-96">
                      <ol className="flex flex-wrap">
                        {skillList.map((data) => (
                          <li
                            key={`${data}`}
                            className="border w-fit p-1 text-center items-center text-gray-700 text-sm m-2 rounded-md bg-gray-200 border-gray-500"
                          >
                            {data}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <CircularProgress
                variant="solid"
                sx={{ mx: "122px" }}
                size="lg"
              />
            )}
          </div>
          <div className="grow flex flex-col m-6 p-4 border bg-white rounded-md w-full">
            <div className=" font-semibold text-gray-700 bg-gray-100 border p-1 m-2 text-center">
              <p>Posts</p>
            </div>
            <Grid
              container
              spacing={{ xs: 0, sm: 1, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
              paddingX={{ xs: 6, sm: 5, md: 6 }}
            >
              {Array.from(postArray).map((_, index) => (
                <Grid item xs={4} sm={4} md={4} key={index}>
                  <Post params={postArray[index]}
                                        showDeleteOption={true}></Post>
                </Grid>
              ))}
            </Grid>
          </div>
        </div>
        <div className="mx-10 mr-5">
          {revieweeId.length !== 0 ? (
            <>
              <FeedbackComponent revieweeId={revieweeId} addFeedback={true}/>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}
