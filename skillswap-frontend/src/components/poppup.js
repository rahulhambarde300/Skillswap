import { useState } from 'react';

export default function PopUp  ({ Open, children, sendDataToParent }) {

    const [isOpen, setIsOpen] = useState(Open);
    const togglePopup = () => {
      setIsOpen(!isOpen);
      sendDataToParent(!isOpen);
    };
  
    return (
      <div>
        {/* Blur background */}
        <div
          className={`fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm transition-opacity ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={togglePopup}
        ></div>
  
        {/* Popup */}
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center overflow-auto transition-opacity ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-full">
            {/* Close button */}
            <button className="absolute top-4 right-4 text-white border-black border-b-black bg-black rounded-lg p-1 hover:bg-gray-500" onClick={togglePopup}>
              Close
            </button>
            {/* Content */}
            {children}
          </div>
        </div>
      </div>
    );
  };