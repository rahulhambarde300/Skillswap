"use client";

import { useState, useEffect } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { fetchRedis } from "@/util/fetchredis";
import { messageArrayValidator } from "@/util/validations/message";
import Messages from "@/components/messages";
import ChatInput from "@/components/chatinput";
import Avatar from '@mui/material/Avatar';

export default function ChatPage({params}) {
    const chatId = params.chatId.replaceAll('%40','@');
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [userEmail, setUserEmail] = useState("");
    const [userEmail1, userEmail2] = chatId.split('--');
    const [initialMessages, setInitialMessages] = useState([]);
    //Create all details variables you need
    const [chatPartner, setChatPartner] = useState(null);

    useEffect(() => {
      checkSession();
    }, []);
    useEffect(() => {
      getChatPartner();
    }, [userEmail]);

    async function checkSession() {
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
          setUserEmail(json.email);
        }
      } else {
        router.push(`/`);
      }
  }

  async function getChatMessages(chatId) {
    try{
        const result = await fetchRedis(
           'zrange',
           `chat:${chatId}:messages`,
           0, -1 
        );

        const dbMessages = result.map((message) => JSON.parse(message));

        const reversedDBMessages = dbMessages.reverse();

        return reversedDBMessages;
    }
    catch(error){
      console.log("Error: ", error);
        notFound();
    }
  }
  

  async function getChatPartner(){
    if(userEmail != "" && userEmail != userEmail1 && userEmail != userEmail2){
      notFound();
    }
    const chatPartnerEmail = userEmail === userEmail1 ? userEmail2 : userEmail1;
    const resGet = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/user/details?email="+chatPartnerEmail,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
    );

    if (resGet.ok) {
      const json = await resGet.json();
      setChatPartner(json);
      getChats();
    }
  }

  async function getChats(){
      const resp = await getChatMessages(chatId);
      if(resp.length > 0){
          setInitialMessages(resp);
      }
  }
  

    return (
        <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh)]'>
        <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
          <div className='relative flex items-center space-x-4'>
            <div className='relative'>
              <div className='relative content-center w-8 px-3 sm:w-12 h-8 sm:h-12'>
                <Avatar sx={{ bgcolor: "#42c5f5" }} aria-label="post">
                  {chatPartner?.firstName.toUpperCase().charAt(0)}
                </Avatar>
              </div>
            </div>

            <div className='flex flex-col leading-tight'>
              <div className='text-xl flex items-center'>
                <span className='text-gray-700 mr-3 font-semibold'>
                  {chatPartner?.firstName}
                </span>
              </div>

              <span className='text-sm text-gray-600'>{chatPartner?.email}</span>
            </div>
          </div>
        </div>

        <Messages
          initialMessages={initialMessages}
          user={user}
          chatId={chatId}
          chatPartner={chatPartner}
        />
        <ChatInput chatId={chatId} user={user} chatPartner={chatPartner}/>
      </div>
    )
};