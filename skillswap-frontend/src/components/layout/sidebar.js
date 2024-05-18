"use client";
import Image from "next/image";
import Link from "next/link";
import profilePhoto from "../../../public/profilePhoto.svg";
import logo from "../../../public/skill_swap_logo.png";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/util/pusher";
import { chatHrefConstructor, toPusherKey } from "@/util/utils";
import { toast } from 'react-hot-toast'
import UnseenChatToast from "@/components/unseenChatToast";

import { useRef } from "react";
import { useEffect, useState } from "react";

const Sidebar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessages, setUnseenMessages] = useState([]);
  const audioPlayer = useRef();

  const openBar = () => {
    setIsOpen(true);
  };

  const closeBar = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    closeBar();
  }, []);

  useEffect(() => {
    if(!props.useremail) return;
    pusherClient.subscribe(toPusherKey(`user:${props.useremail}:chats`));

    const chatHandler = (message) => {
        
        const shouldNotify = pathname !== message.url;

        if(!shouldNotify) return;

        const enableNotification = props.enableNotification;
        const enableNotificationSounds = props.enableNotificationSounds;

        if(enableNotification){
          toast.custom((t) => (
            <UnseenChatToast
                t={t}
                url={message.url}
                senderMessage={message.text}
                senderName={message.senderName}
            />
          ))
        }
        if(enableNotificationSounds){
          audioPlayer.current.play();
        }
        setUnseenMessages((prev) => [...prev, message]);
    }
    pusherClient.bind('new_message', chatHandler);
    return () => {
        pusherClient.unsubscribe(toPusherKey(`user:${props.useremail}:chats`));

        pusherClient.unbind('new_message', chatHandler);
    }
}, [pathname, props.useremail, router])

  return (
    <div className="flex bg-gray-50">
      <audio ref={audioPlayer} src="/notification.mp3" type="audio/mp3" />
      <div
        onMouseEnter={openBar}
        onMouseLeave={closeBar}
        className={`w-48 bg-gray-50 text-gray-700 font-extrabold border-r-2 border-gray-200  `}
        style={{ position: "fixed", top: 0, bottom: 0 }}
      >
        {/* <Link href={"/"}>
          <Image src={logo} alt="Skill Swap" width={200} height={100} />
        </Link> */}
        <div className="flex justify-center flex-col items-center p-4">
          <div className="sm:max-w-screen-xl">
            <Link
              className="flex justify-center"
              href={`/userpage/${props.username}/profilepage`}
            >
              <div className="justify-center text-center flex flex-col">
                <Image
                  className="my-4 border border-black rounded-lg"
                  src={props.image}
                  width={120}
                  height={120}
                  alt={`Profile photo of ${props.username}`}
                />
                {props.username}
              </div>
            </Link>
          </div>
        </div>
        <nav className="p-4 flex flex-col grow h-full">
          <ul>
            <li className="mb-2">
              <Link
                href={`/userpage/${props.username}`}
                className="block p-2 hover:bg-teal-300 hover:duration-300 rounded"
              >
                Explore
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href={`/userpage/${props.username}/profilepage`}
                className="block p-2 hover:bg-teal-300 hover:duration-300 rounded"
              >
                Profile
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href={`/chat`}
                className="block p-2 hover:bg-teal-300 hover:duration-300 rounded"
              >
                Chat
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href={`/setting`}
                className="block p-2 hover:bg-teal-300 hover:duration-300 rounded"
              >
                Settings
              </Link>
            </li>
            <li className="mb-2 ">
              <a href="/" className="block p-2 hover:bg-teal-300 hover:duration-300 rounded">
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="ml-48 flex-grow">{props.children}</div>
    </div>
  );
};

export default Sidebar;
