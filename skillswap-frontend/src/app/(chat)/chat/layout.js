"use client";
import { SidebarChatList } from '@/components/sidebarchatlist';
import { getFriendsByEmail } from '@/util/helpers/getFriendsByEmail';
import Link from 'next/link';
import React, { useState, useEffect } from "react";
import MessageIcon from '@mui/icons-material/Message';
import Sidebar from "@/components/layout/sidebar";

 function Layout ({children}) {
    const [user, setUser] = useState(null);
    const [userFriends, setUserFriends] = useState(null);
    const [imageSrc, setImageSrc] = useState();

    useEffect(
      () =>{
        fetchContent();
      },[]);

    //Fetch user details to check DB
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
            setUser(json);
            getFriends(json.email);
            fetchImage(json.profilePictureName);
          }
        } else {
          router.push(`/`);
        }
      }

    async function getFriends(email){
      const friendsRes = await getFriendsByEmail(email);
      setUserFriends(friendsRes);
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
    
    
      
      return (
      <Sidebar username={user?.firstName} useremail={user?.email} image={imageSrc} enableNotification={user?.enableNotification} enableNotificationSounds={user?.enableNotificationSounds}>
        <div className='w-full flex h-screen'>
            <div className='hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>
                <Link href='/chat' className='flex h-12 pt-4 font-bold text-4xl shrink-0 items-center text-gray-600'>
                    Messages <MessageIcon sx={{ml:'12px'}}/>
                </Link>
                <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700"></hr>
                <nav className='flex flex-1 flex-col'>
                    <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                        <li><SidebarChatList friends={userFriends} user={user} /></li>
                    </ul>
                </nav>
            </div>
            <aside className='max-h-screen container pb-16 md:pb-10 w-full'>
              {children}
            </aside>
        </div>
        </Sidebar>
      );
}

export default Layout;