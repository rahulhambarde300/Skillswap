"use client"; // This is a client component 👈🏽
import Link from "next/link";
import PopUp from "@/components/poppup";

import Sidebar from "./layout/sidebar";

import { useParams, useRouter } from "next/navigation";
import editPen from "../../public/edit-pen.svg";
import Image from "next/image";
import profilePhoto from "../../public/profilePhoto.svg";
import React, { useState, useEffect } from "react";
import { data } from "autoprefixer";
import CircularProgress from "@mui/joy/CircularProgress";
import Grid from "@mui/material/Grid";
import Post from "./post";
import EditSkills from "./editskills";
import FeedbackComponent from "./feedback";
import ReviewsComponent from "./receivedfeedback";
import { Feedback } from "@mui/icons-material";

export function ProfilePageComponent({ sendDataToParent }) {
  const [imageSrc, setImageSrc] = useState();
  const [dataFetched, setDataFetched] = useState(null);
  const [penClicked, setPenClicked] = useState(false);
  const [userSkills, setUserSkills] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setSelectedImage(imageFile);
  };

  function AddSkills() {
    sendDataToParent(true);
  }

  const HandleDeleteSkills = async (deletefield) => {
    console.log(userSkills);
    const updatedSKills = userSkills.filter(
      (data) => data.skill.skillName != deletefield
    );
    setUserSkills(updatedSKills);
    try {
      const deleteUrl =
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/user/deleteUserSkill";

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const data = [deletefield];
      const responsedelete = await fetch(deleteUrl, {
        method: "DELETE",
        headers: headers,
        body: JSON.stringify(data),
      });

      if (responsedelete.ok) {
        console.log("User skills Deleted successfully");
      } else {
        console.error("Failed to Delete user skills");
      }
    } catch (error) {
      console.error("Error sending user skills:", error);
    }
  };

  const reviews = [
    { username: "User1", rating: 4, comment: "Great product!" },
    { username: "User2", rating: 5, comment: "Excellent service!" },
    { username: "User3", rating: 3, comment: "Could be better." },
  ];

  const handleUploadImage = async () => {
    if (!selectedImage) {
      console.error("No image selected.");
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/user/profilePicture/save",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: formData,
        }
      );

      // Handle response from backend
      if (response.ok) {
        console.log("Image uploaded successfully.");
        // You can handle further actions such as displaying success message, updating state, etc.
      } else {
        console.error("Failed to upload image.");
        // You can handle error cases here
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(" ");
  const [userEmail, setUserEmail] = useState(null);
  const [aboutMe, setAboutMe] = useState("");
  const [mobile, setMobile] = useState("");
  const [pincode, setPincode] = useState("");
  const [age, setAge] = useState("");
  const [linkedInLink, setLinkedInLink] = useState(null);
  const [instagramLink, setInstagramLink] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState(null);
  const [skillList, setSkillList] = useState([]);
  const [iseditClicked, setIsEditCliked] = useState(true);
  const [postArray, setPostArray] = useState([]);
  const [content, setContent] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationSounds, setNotificationSounds] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    fetchContent();
  }, [iseditClicked, penClicked]);

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
      const resGet = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/user/details",
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
        setUserEmail(json.email);
        setAboutMe(json.description);
        setMobile(json.mobile);
        setPincode(json.pincode);
        setAge(json.age);
        setLinkedInLink(json.linkedInLink);
        setInstagramLink(json.instagramLink);
        setYoutubeLink(json.youtubeLink);
        setShowNotification(json.enableNotification);
        setNotificationSounds(json.enableNotificationSounds);
        fetchImage(json.profilePictureName);

        const tempSkillList = [];
        for (const index in json.userSkills) {
          tempSkillList.push(json.userSkills[index].skill.skillName);
        }
        setSkillList(tempSkillList);

        fetchPosts(json.id);
      }
    } else {
      router.push(`/`);
    }

    const resGetSKills = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/user/getUserSkills",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    if (resGetSKills.ok) {
      const skills = await resGetSKills.json();
      setUserSkills(skills);
    } else {
      router.push(`/`);
    }
  }

  async function updateContent() {
    const resPost = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/user/details/update",
      {
        method: "POST",
        body: JSON.stringify({
          id: dataFetched.id,
          firstName: firstName,
          lastName: lastName,
          description: aboutMe,
          mobile: mobile,
          email: dataFetched.email,
          role: "USER",
          isVerified: dataFetched.isVerified,
          pincode: pincode,
          profilePictureName: "null",
          age: age,
          linkedInLink: linkedInLink,
          instagramLink: instagramLink,
          youtubeLink: youtubeLink,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (resPost.ok) {
      const json = await resPost.json();
      setIsEditCliked(!iseditClicked);
    }
  }

  const fetchImage = async (props) => {
    try {
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
        console.log(imageUrl);
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
      setContent(true);

      json.forEach((element) => {
        const name = element.user.firstName + " " + element.user.lastName;
        const content = element.content;
        const email = element.user.email;
        const skillId = element.skill.skillId;
        const createDate = element.createdAt;
        const postId = element.postId;
        const newPost = {
          name: name,
          email: email,
          content: content,
          skillId: skillId,
          createDate: createDate,
          postId: postId,
        };
        newArray.push(newPost);
      });
      // Sort newArray based on createDate in descending order
      newArray.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));

      setPostArray(newArray);
    }
  }

  const handleDeletePost = async (postId) => {
    try {
      const deleteUrl =
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/user/post/deletePost";

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const data = postId;

      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: headers,
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Post deleted successfully");
        const updatedPosts = postArray.filter((post) => post.postId !== postId);
        setPostArray(updatedPosts);
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

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
      {content && (
        <div className="flex justify-center items-center h-full ">
          <Sidebar
            username={firstName}
            useremail={userEmail}
            image={imageSrc}
            enableNotification={showNotification} enableNotificationSounds={notificationSounds}
          ></Sidebar>
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8 bg-gray-50">
            <div className=" sm:w-full sm:max-w-3xl">
              <h2 className="m-6 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                User Profile
              </h2>
            </div>
            <div className="flex flex-row grow ">
              <div className="grow">
                <div className="flex flex-row   max-h-fit ">
                  <div className="my-6 flex flex-col w-1/3   border bg-white p-4 rounded-md">
                    {iseditClicked ? (
                      <>
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
                            {!penClicked && (
                              <div
                                onClick={() => setPenClicked(true)}
                                className="cursor-pointer flex justify-center"
                              >
                                <Image
                                  src={editPen}
                                  alt="Edit Pen Icon"
                                  width={24}
                                  height={24}
                                />
                              </div>
                            )}
                            {penClicked && (
                              <form encType="multipart/form-data">
                                <div className="appearance-none border flex-col flex justify-center border-gray-200 bg-gray-200 py-2 px-4 rounded w-full text-gray-700 leading-tight focus:outline-none focus:border-blue-500">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                  />

                                  <div className="flex text-xs p-2">
                                    <button
                                      onClick={handleImageSave}
                                      type="button"
                                      className="flex h-fit mx-2 w-fit justify-center rounded-md bg-green-600  p-1 font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={handleImageCancel}
                                      type="button"
                                      className="flex w-fit mx-2 h-fit justify-center rounded-md bg-red-500  p-1 font-semibold leading-6 text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </form>
                            )}

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

                            <label
                              htmlFor="Skills"
                              className="block text-sm font-medium leading-6  text-gray-900"
                            >
                              My Skills
                            </label>
                            <div className="bg-white border-gray-300 border p-4 rounded-md mb-4 max-w-96">
                              <ol className="flex flex-wrap">
                                {userSkills.map((data) => (
                                  <>
                                    <li className="border w-fit p-1 text-center items-center text-gray-700 text-sm m-2 rounded-md bg-gray-200 border-gray-500">
                                      {data.skill.skillName}
                                    </li>
                                  </>
                                ))}
                              </ol>
                            </div>

                            <button
                              type="button"
                              onClick={ToggleEditButton}
                              className="flex w-fit justify-center rounded-md bg-green-600  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                              Edit
                            </button>
                          </>
                        ) : (
                          <CircularProgress
                            variant="solid"
                            sx={{ mx: "122px" }}
                            size="lg"
                          />
                        )}
                      </>
                    ) : (
                      <>
                        <Image
                          className="m-auto my-4"
                          src={profilePhoto}
                          width={75}
                          height={75}
                          alt={`Profile photo of ${dataFetched.firstName}`}
                        />
                        <form className="space-y-2 my-4">
                          <div>
                            <div className="grid grid-cols-2">
                              <div>
                                <label
                                  htmlFor="first name"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  First Name
                                </label>
                                <input
                                  className="block mt-2 w-3/4 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6"
                                  type="text"
                                  placeholder="First Name"
                                  value={firstName}
                                  onChange={(e) => {
                                    setFirstName(e.currentTarget.value);
                                  }}
                                  required
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="last name"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Last Name
                                </label>
                                <input
                                  className="block mt-2 w-3/4 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6"
                                  type="text"
                                  placeholder="Last Name"
                                  value={lastName}
                                  onChange={(e) => {
                                    setLastName(e.currentTarget.value);
                                  }}
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <label
                            htmlFor="phone number"
                            className="block text-sm font-medium leading-6  text-gray-900"
                          >
                            About me
                          </label>
                          <textarea
                            className="block mt-2 w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                            rows="5"
                            placeholder="About me"
                            value={aboutMe}
                            onChange={(e) => {
                              setAboutMe(e.currentTarget.value);
                            }}
                            required
                          ></textarea>
                          <label
                            htmlFor="phone number"
                            className="block text-sm font-medium leading-6  text-gray-900"
                          >
                            Phone no.
                          </label>
                          <input
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6"
                            type="mobile"
                            placeholder="Phone. no"
                            value={mobile}
                            onChange={(e) => {
                              setMobile(e.currentTarget.value);
                            }}
                            required
                          />
                          <label
                            htmlFor="pincode"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Pincode
                          </label>
                          <input
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6"
                            type="text"
                            placeholder="Pincode"
                            value={pincode}
                            onChange={(e) => {
                              setPincode(e.currentTarget.value);
                            }}
                            required
                          />
                          <label
                            htmlFor="Age"
                            className="block text-sm font-medium leading-6  text-gray-900"
                          >
                            Age
                          </label>

                          <input
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6"
                            type="text"
                            placeholder="Age"
                            value={age}
                            onChange={(e) => {
                              setAge(e.currentTarget.value);
                            }}
                            required
                          />
                          <label
                            htmlFor="linkedInLink"
                            className="block text-sm font-medium leading-6  text-gray-900"
                          >
                            LinkedIn
                          </label>

                          <input
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6"
                            type="text"
                            placeholder="LinkedIn URL"
                            value={linkedInLink}
                            onChange={(e) => {
                              setLinkedInLink(e.currentTarget.value);
                            }}
                            required
                          />
                          <label
                            htmlFor="instagramLink"
                            className="block text-sm font-medium leading-6  text-gray-900"
                          >
                            Instagram
                          </label>

                          <input
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6"
                            type="text"
                            placeholder="Instagram URL"
                            value={instagramLink}
                            onChange={(e) => {
                              setInstagramLink(e.currentTarget.value);
                            }}
                            required
                          />
                          <label
                            htmlFor="youtubeLink"
                            className="block text-sm font-medium leading-6  text-gray-900"
                          >
                            Youtube
                          </label>

                          <input
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6"
                            type="text"
                            placeholder="Youtube URL"
                            value={youtubeLink}
                            onChange={(e) => {
                              setYoutubeLink(e.currentTarget.value);
                            }}
                          />
                        </form>
                        <label
                          htmlFor="Skills"
                          className="block text-sm font-medium leading-6  text-gray-900"
                        >
                          My Skills
                        </label>
                        <div className="bg-white border-gray-300 border p-4 rounded-md mb-4 max-w-96">
                          <ol className="flex flex-wrap">
                            {userSkills.map((data) => (
                              <>
                                <li
                                  onClick={(e) =>
                                    HandleDeleteSkills(data.skill.skillName)
                                  }
                                  className="border w-fit p-1 text-center items-center text-white font-semibold text-sm m-2 rounded-md bg-red-600 hover:cursor-pointer border-gray-500"
                                >
                                  {data.skill.skillName}
                                </li>
                              </>
                            ))}
                          </ol>
                          <button
                            className="border rounded-lg p-2 bg-indigo-600 text-white text-xs font-semibold"
                            onClick={() => AddSkills()}
                          >
                            Add Skills
                          </button>
                        </div>
                        <div className="flex ">
                          <button
                            onClick={updateContent}
                            type="button"
                            className="flex  m-2 w-fit justify-center rounded-md bg-green-600  p-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={ToggleEditButton}
                            type="button"
                            className="flex w-fit m-2 justify-center rounded-md bg-red-500  p-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  {
                    //This is the next child in flex which is " Posts"
                  }
                  <div className="flex  flex-col ml-6 my-6 p-4 border bg-white rounded-md w-full">
                    <div className="font-semibold text-gray-700 bg-gray-100 border p-1 m-2 text-center">
                      <p>Posts</p>
                    </div>
                    <div className="overflow-y-auto flex">
                      {" "}
                      {/* Set max height and enable vertical scrolling */}
                      <Grid className="grid-container grid grid-cols-2 gap-4 md:gap-6 max-w-7xl ml-2">
                        {Array.from(postArray).map((_, index) => (
                          <Grid
                            item
                            md={4}
                            key={index}
                            className="grid-item group cursor-pointer"
                          >
                            <Post
                              params={postArray[index]}
                              showDeleteOption={true}
                              onDelete={handleDeletePost}
                              signedUserEmail={userEmail}
                            ></Post>
                          </Grid>
                        ))}
                      </Grid>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {dataFetched.id.length !== 0 ? (
                <>
                  <FeedbackComponent
                    revieweeId={dataFetched.id}
                    addFeedback={false}
                  />
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      )}
      {!content && (
        <div className="flex h-screen ">
          <h1 className="m-auto text-3xl">
            <CircularProgress />
          </h1>
        </div>
      )}
    </>
  );
}

export default function UserProfilePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [skills, setSkills] = useState([]);

  const receiveDataFromPopup = (Open) => {
    setIsOpen(Open);
  };

  function getSkills(skillArray) {
    setSkills(skillArray);
  }

  return (
    <>
      <ProfilePageComponent sendDataToParent={receiveDataFromPopup} />

      {/* BlurPopup component */}
      {isOpen && (
        <PopUp Open={isOpen} sendDataToParent={receiveDataFromPopup}>
          <EditSkills
            sendSkills={getSkills}
            sendDataToParent={receiveDataFromPopup}
          />
        </PopUp>
      )}
      {!isOpen && (
        <PopUp Open={false} sendDataToParent={receiveDataFromPopup} />
      )}
    </>
  );
}
