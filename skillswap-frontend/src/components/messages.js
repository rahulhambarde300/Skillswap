import { useEffect, useRef, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import {cn, toPusherKey} from '@/util/utils';
import { format } from 'date-fns';
import { pusherClient } from '@/util/pusher';

export default function Messages({initialMessages, user, chatId, chatPartner,}) {
    const scrollDownRef = useRef(null);
    const [messages, setMessages] = useState(initialMessages);

    useEffect(() => {
      setMessages(initialMessages);
    }, [initialMessages])
    useEffect(() => {
        pusherClient.subscribe(
          toPusherKey(`chat:${chatId}`)
        )
    
        const messageHandler = (message) => {
          setMessages((prev) => {
            prev = prev.length > 0 ? prev : initialMessages;
            return [message, ...prev]
          })
        }
    
        pusherClient.bind('incoming-message', messageHandler)
    
        return () => {
          pusherClient.unsubscribe(
            toPusherKey(`chat:${chatId}`)
          )
          pusherClient.unbind('incoming-message', messageHandler)
        }
      }, [chatId])

    const formatTimestamp = (timestamp) => {
        return format(timestamp, 'HH:mm')
    }

    return (
        <div 
            id='messages'
            className='flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
        <div ref={scrollDownRef} />

        {(messages.length > 0 ? messages: initialMessages).map((message, index) => {
            const isCurrentUser = message.senderEmail === user?.email;
            const hasNextMessageFromSameUser = (messages.length > 0 ? messages: initialMessages)[index - 1]?.senderEmail === (messages.length > 0 ? messages: initialMessages)[index].senderEmail;

            return (
                <div
                  className='chat-message'
                  key={`${message.id}-${message.timestamp}`}>
                  <div
                    className={cn('flex items-end', {
                      'justify-end': isCurrentUser,
                    })}>
                    <div
                      className={cn(
                        'flex flex-col space-y-2 text-base max-w-xs mx-2',
                        {
                          'order-1 items-end': isCurrentUser,
                          'order-2 items-start': !isCurrentUser,
                        }
                      )}>
                      <span
                        className={cn('px-4 py-2 rounded-lg inline-block', {
                          'bg-indigo-600 text-white': isCurrentUser,
                          'bg-gray-200 text-gray-900': !isCurrentUser,
                          'rounded-br-none':
                            !hasNextMessageFromSameUser && isCurrentUser,
                          'rounded-bl-none':
                            !hasNextMessageFromSameUser && !isCurrentUser,
                        })}>
                        {message.text}{' '}
                        <span className='ml-2 text-xs text-gray-400'>
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </span>
                    </div>
      
                    <div
                      className={cn('relative w-10 h-10', {
                        'order-2': isCurrentUser,
                        'order-1': !isCurrentUser,
                        invisible: hasNextMessageFromSameUser,
                      })}>
                        <Avatar sx={{ bgcolor: "#42c5f5" }} aria-label="post">
                            {
                                isCurrentUser ? 
                                    user?.firstName.toUpperCase().charAt(0):
                                    chatPartner?.firstName.toUpperCase().charAt(0)
                            }
                        </Avatar>
                    </div>
                  </div>
                </div>
              )
        })}
        </div>
    );
}
