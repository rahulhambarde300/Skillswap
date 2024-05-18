"use client";
import Sidebar from "@/components/layout/sidebar";
import Image from "next/image";
import { useEffect, useState } from "react";
export default function NotificationSetting({ token, data, update }) {
  const [imageSrc, setImageSrc] = useState();
  const [editState, setEditState] = useState(false);

  const [isChecked1, setIsChecked1] = useState(data?.enableNotification); // Set initial state to checked
  const [isChecked2, setIsChecked2] = useState(data?.enableNotificationSounds); // Set initial state to checked

  const handleCheckboxChange1 = () => {
    setIsChecked1(!isChecked1); // Toggle checkbox state
  };

  const handleCheckboxChange2 = () => {
    setIsChecked2(!isChecked2); // Toggle checkbox state
  };

  function editClicked() {
    setEditState(true);
  }
  function cancelClicked() {
    setIsChecked1(data.enableNotification);
    setIsChecked2(data.enableNotificationSounds);
    setEditState(false);
  }


  useEffect(() => {
    async function fetchImage(image, token) {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
            `/user/profilePicture/${image}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.ok) {
          const imageBlob = await response.blob();
          const imageUrl = URL.createObjectURL(imageBlob);
          setImageSrc(imageUrl);
          // return image;
        } else {
          console.error("Failed to fetch image:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    }
    
    const image = data.profilePictureName;
    console.log(image);
    fetchImage(image, token);
  },[]);


   



  

  function handleSaveChanges() {
    data.enableNotification = isChecked1;
    data.enableNotificationSounds = isChecked2;
    const updatedData = data;
    update(updatedData,token);
    setEditState(false);

  }
  return (
    <>
      <Sidebar image={imageSrc} username={data.firstName} useremail={data?.email} enableNotification={data?.enableNotification} enableNotificationSounds={data?.enableNotificationSounds}>
        <div className="flex justify-center items-center h-screen ">
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8 bg-gray-50">
            <div className=" sm:w-full sm:max-w-3xl">
              <h2 className="m-6 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Notification Setting
              </h2>
            </div>
            <div className="flex flex-row grow ">
              <div className="grow">
                <div className="flex flex-row max-h-fit">
                  <div className="my-6 flex flex-col w-full border bg-white p-4 rounded-md">
                    {!editState && (
                      <>
                        <div className="mb-4">
                          <div className="inline-flex items-center">
                            <input
                              type="checkbox"
                              className="h-5 w-5 text-indigo-600"
                              checked={isChecked1}
                              disabled // This attribute makes the checkbox non-interactive
                            />
                            <p className="ml-2">Enable message notification</p>
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="inline-flex items-center">
                            <input
                              type="checkbox"
                              className="h-5 w-5 text-indigo-600"
                              checked={isChecked2}
                              disabled // This attribute makes the checkbox non-interactive
                            />
                            <p className="ml-2">Enable notification sounds</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={editClicked}
                          className="flex w-fit justify-center rounded-md bg-green-600  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Edit
                        </button>
                      </>
                    )}

                    {editState && (
                      <>
                        {" "}
                        <div className="mb-4">
                          <div className="inline-flex items-center">
                            <input
                              type="checkbox"
                              className="h-5 w-5 text-indigo-600"
                              checked={isChecked1}
                              onChange={handleCheckboxChange1}
                            />
                            <div className="ml-2">
                              Enable message notification
                            </div>
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="inline-flex items-center">
                            <input
                              type="checkbox"
                              className="h-5 w-5 text-indigo-600"
                              checked={isChecked2}
                              onChange={handleCheckboxChange2}
                            />
                            <div className="ml-2">
                              Enable notification sounds
                            </div>
                          </div>
                        </div>
                        <div className="flex ">
                          <button
                            onClick={handleSaveChanges}
                            type="button"
                            className="flex   w-fit justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={cancelClicked}
                            type="button"
                            className="flex w-fit mx-2 justify-center rounded-md bg-red-500  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Sidebar>
    </>
  );
}
