import React, { useEffect, useState } from 'react';

const PopUpBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('visited');

    // Always show on refresh
    setShow(true);

    // First visit logic
    if (!hasVisited) {
      localStorage.setItem('visited', 'true');
    }
  }, []);

  if (!show) return null;

  return (
    <div className="w-full h-screen z-50 text-white fixed top-0 left-0 backdrop-blur-sm bg-black/30 transition-all">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <img
          className="w-[300px] md:w-[500px] lg:w-[600px] h-auto rounded-xl shadow-lg"
          src="./src/assets/PopupBanner.jpg"
          alt="Popup Banner"
        />
        <button
          onClick={() => setShow(false)}
          className="mt-4 px-4 py-2 bg-white text-black rounded hover:bg-gray-100 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PopUpBanner;
