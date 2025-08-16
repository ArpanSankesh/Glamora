import React from 'react';
import { useNavigate } from 'react-router-dom';

const PackageCard = ({ id, name, description, category, time, offerPrice, image }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/package/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="border border-[var(--color-secondary)] rounded-md bg-white 
                 w-full max-w-90
                 flex flex-row items-center justify-between md:flex-col   /* row on mobile, col on md+ */
                 hover:scale-105 transition-all cursor-pointer"
    >
      {/* IMAGE */}
      <div
        className="flex-shrink-0 
                   w-32 h-32 md:w-full md:h-60 ml-3 lg:ml-0
                   bg-cover bg-center md:rounded-t-md"
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* CONTENT */}
      <div className="p-4 flex flex-col justify-between text-gray-500/60 text-sm flex-1">
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-[var(--color-secondary)] font-semibold text-md md:text-xl">{name}</p>
            <p className="text-[var(--color-secondary)] text-xs md:text-base">{time}</p>
          </div>
          {category && (
            <p className="text-[var(--color-accent)] font-medium text-xs md:text-sm mb-1">
              {category}
            </p>
          )}
          <p className="text-gray-700 line-clamp-3 text-sm">{description}</p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <p className="text-base md:text-xl font-medium text-[var(--color-secondary)]">
            ₹{offerPrice}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
