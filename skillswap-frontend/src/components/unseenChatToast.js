import { chatHrefConstructor, cn } from "@/util/utils";
import toast from "react-hot-toast";
import Avatar from '@mui/material/Avatar';

//import NotificationSound from "../../public/notification.mp3";

export default function UnseenChatToast({t, url, senderName, senderMessage}){
    return (
        <div className={cn('max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5',{
            'animate-enter': t.visible,
            'animate-leave': !t.visible
        })}>
            
            <a onClick={()=> toast.dismiss(t.id)} 
            href={url}
            className="flex-1 w-0 p-4">
                <div className="flex items-center ">
                    <div className="flex-shrink-0 pt-0.5">
                        <div className="relative h-10 w-10">
                            <Avatar sx={{ bgcolor: "#42c5f5" }} aria-label="post">
                                {
                                    senderName.toUpperCase().charAt(0)
                                }
                            </Avatar>
                        </div>
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">{senderName}</p>
                        <p className="mt-1 text-sm text-gray-500">{senderMessage}</p>
                    </div>
                </div>
            </a>

            <div className="flex border-1 border-gray-200">
                <button onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    Close
                </button>
            </div>
        </div>
    );
}