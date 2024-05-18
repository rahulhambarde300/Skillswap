// components/TopTabBar.js
import { useState } from "react";
import NotificationsDropdown from "@/components/NotificationsDropdown";

const TopTabBar = (props, { sendState }) => {
  const [tab, setTab] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  function setPost() {
    setTab(1);
    props.sendState(1);
  }

  function setProfile() {
    setTab(0);
    props.sendState(0);
  }

  function toggleDropdown() {
    setIsDropdownOpen(!isDropdownOpen); // Toggle the visibility of the dropdown
  }

  return (
    <>
      <nav className="bg-white  text-gray-700 flex justify-between items-center px-6 py-3 z-10  border-b-2  border-gray-200">
        <div
          className={`text-center rounded-xl p-3 cursor-pointer flex-grow ${
            tab === 1 ? "bg-teal-300  duration-500" : "bg-white duration-300"
          }`}
          onClick={setPost}
        >
          <p className="font-extrabold text-xl">Posts</p>
        </div>
        <div
          className={`text-center rounded-xl p-3 cursor-pointer flex-grow ${
            tab === 0 ? "bg-teal-300 duration-500" : "bg-white duration-300"
          }`}
          onClick={setProfile}
        >
          <p className="font-extrabold text-xl">Profiles</p>
        </div>
        <div>
          <button
            id="dropdownNotificationButton"
            data-dropdown-toggle="dropdownNotification"
            class="relative inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400"
            type="button"
            onClick={toggleDropdown}
          >
            <svg
              class="w-8 h-8"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 14 20"
            >
              <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z" />
            </svg>
            {hasUnreadNotifications && (
              <div className="absolute block w-3 h-3 bg-red-500 border-2 border-white rounded-full -top-1 right-0 dark:border-gray-900"></div>
            )}
          </button>
          {isDropdownOpen && (
            <NotificationsDropdown
              isOpen={isDropdownOpen}
              userId={props.userId}
              setHasUnreadNotifications={setHasUnreadNotifications}
            />
          )}
        </div>
      </nav>
      {props.children}
    </>
  );
};

export default TopTabBar;
