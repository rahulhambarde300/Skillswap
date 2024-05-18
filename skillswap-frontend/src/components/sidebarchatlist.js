'use client';

import { pusherClient } from "@/util/pusher";
import { chatHrefConstructor, toPusherKey } from "@/util/utils";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast'
import UnseenChatToast from "./unseenChatToast";


export const SidebarChatList = ({friends, user}) => {
    const router = useRouter();
    const pathname = usePathname();
    const [unseenMessages, setUnseenMessages] = useState([]);

    useEffect(() => {
        if(!user) return;
        pusherClient.subscribe(toPusherKey(`user:${user.email}:chats`));
    
        const chatHandler = (message) => {
            
            const shouldNotify = pathname !== message.url;
    
            if(!shouldNotify) return;
    
            setUnseenMessages((prev) => [...prev, message]);
        }
        pusherClient.bind('new_message', chatHandler);
        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${user.email}:chats`));
    
            pusherClient.unbind('new_message', chatHandler);
        }
    }, [pathname, user, router])

    useEffect(() => {
        if(pathname?.includes('chat')){
            setUnseenMessages((prev) => {
                return prev.filter((msg) => {
                    !pathname.includes(msg.senderEmail);
                })
            })
        }
    }, [pathname]);
    return (
        <ul role='list' className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
            {friends?.sort().map((friend) => {
                const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
                    return unseenMsg.senderEmail === friend.email;
                }).length;

                return <li key={friend.email}>
                    <a href={`/chat/chatpage/${chatHrefConstructor(
                        friend.email,
                        user.email
                    )}`}
                    className='text-gray-700 hover:text-teal-400 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
                        {friend.firstName + " " + friend.lastName}
                        {unseenMessagesCount > 0 ? (
                    <div className='bg-teal-400 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                    {unseenMessagesCount}
                    </div>
                    ) : null}
                    </a>
                </li>
            })}
        </ul>
    );
}