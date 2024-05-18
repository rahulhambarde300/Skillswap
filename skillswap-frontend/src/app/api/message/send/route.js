import { fetchRedis } from '@/util/fetchredis';
import { useRedis } from '@/util/db';
import { nanoid } from 'nanoid';
import { pusherServer } from '@/util/pusher';
import { toPusherKey} from '@/util/utils';
import {chatHrefConstructor} from '@/util/utils';
import axios from 'axios';

export async function POST(req){
    const db = useRedis();
    try{
        const {text, chatId, user, chatPartner, token} = await req.json();
        const [userEmail1, userEmail2] = chatId.split("--");

        const chatPartnerEmail = user.email === userEmail1 ? userEmail2 : userEmail1;

        const friendList = await fetchRedis(
            'smembers',
            `user:${user.email}:friends`
        );
        const isFriend = friendList.includes(chatPartnerEmail);

        if(!isFriend){
            return new Response('Unauthorized', {status: 401});
        }

        const timestamp = Date.now()
        const messageData = {
            id: nanoid(),
            senderEmail: user.email,
            text,
            timestamp,
        }

        //notify all connected chat room clients
        await pusherServer.trigger(toPusherKey(`chat:${chatId}`), 'incoming-message', messageData)

        await pusherServer.trigger(toPusherKey(`user:${chatPartnerEmail}:chats`), 'new_message', {
        ...messageData,
            senderName: user.firstName,
            url: `/chat/chatpage/${chatHrefConstructor(user.email, chatPartnerEmail)}`
        })

        //Create notification in SQL server
        try {
  
            if (!token) {
              console.error("No token found");
              return;
            }
  
            const request = {
                senderId : user.id,
                content : "New message from "+user.firstName,
                isRead : false,
                receiverId : chatPartner.id,
                createdAt : null
            }
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }

            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_BASE_URL+`/api/notifications/createNotification`, 
            {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(request),
            })
            if(response.ok){
                console.log("Notification sent");
            }
          } catch (error) {
            console.error("Error sending notifications:", error);
          }

        // all valid, send the message
        await db.zadd(`chat:${chatId}:messages`, {
            score: timestamp,
            member: JSON.stringify(messageData),
        })

        return new Response('OK');
    } catch(error){
        return new Response(error.message, { status: 500 })
    }
    return new Response(error.message, { status: 500 })
}