import Chat from "@/components/chat";
import { useRedis } from "@/util/db";
import { fetchRedis } from "@/util/fetchredis";
import { getFriendsByEmail } from "@/util/helpers/getFriendsByEmail";
import { chatHrefConstructor } from "@/util/utils";
import { ChevronRight } from 'lucide-react'
import Link from "next/link";
// import { useEffect, useState } from "react";

export default async function ChatPage() {
  let friends = [];
  let friendsWithLastMessage = [];
  
  const user = async function checkSession() {
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
        //setUser(json);
        friends = await getFriendsByEmail(user?.email);
        friendsWithLastMessage = await Promise.all(
          friends.map(async (friend) => {
            const [lastMessageRaw] = await fetchRedis('zrange',`chat:${chatHrefConstructor(user.email, friend.email)}:messages`, -1, -1);
    
            const lastMessage = JSON.parse(lastMessageRaw)
    
            return {
              ...friend,
              lastMessage
            }
          })
        )
        return json;
      }
      } else {
        console.error("Unauthorized access");
      }
    }

  

    return (
      
      <div className='container py-12'>
        
      <h1 className='font-bold text-5xl mb-8'>Recent chats</h1>
      {friendsWithLastMessage.length === 0 ? (
        <p className='text-sm text-zinc-500'>Click a chat to see your messages...</p>
      ) : (
        friendsWithLastMessage.map((friend) => (
          <div
            key={friend.email}
            className='relative bg-zinc-50 border border-zinc-200 p-3 rounded-md'>
            <div className='absolute right-4 inset-y-0 flex items-center'>
              <ChevronRight className='h-7 w-7 text-zinc-400' />
            </div>

            <Link
              href={`/chat/chatpage/${chatHrefConstructor(
                user.email,
                friend.email
              )}`}
              className='relative sm:flex'>
              <div className='mb-4 flex-shrink-0 sm:mb-0 sm:mr-4'>
                <div className='relative h-6 w-6'>
                  Image
                </div>
              </div>

              <div>
                <h4 className='text-lg font-semibold'>{friend.firstName}</h4>
                <p className='mt-1 max-w-md'>
                  <span className='text-zinc-400'>
                    {friend.lastMessage.senderEmail === user.email
                      ? 'You: '
                      : ''}
                  </span>
                  {friend.lastMessage.text}
                </p>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
    )
};