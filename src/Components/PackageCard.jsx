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
                 lg:min-w-60 lg:max-w-90 md:max-w-80 max-w-90 w-full
                 flex flex-col justify-between h-[420px] hover:scale-105 transition-all cursor-pointer"
    >
      {/* Image */}
      <div
        className="group flex items-center justify-center h-60 w-full bg-cover bg-center rounded-t-md"
        style={{ backgroundImage: `url(${image})` }}
      ></div>

      {/* Package Info */}
      <div className="p-5 text-gray-500/60 text-sm flex flex-col justify-between h-[180px]">
        <div>
          <div className='flex justify-between items-center mb-2'>
            <p className="text-[var(--color-secondary)] font-semibold text-xl">{name}</p>
            <p className='text-[var(--color-secondary)] text-sm'>{time}</p>
          </div>
          {category && (
            <p className="text-[var(--color-accent)] font-medium text-sm mb-1">{category}</p>
          )}
          <p className="text-gray-700 line-clamp-3 text-sm">{description}</p>
        </div>

        <div className="flex items-end justify-between mt-4">
          <p className="md:text-xl text-base font-medium text-[var(--color-secondary)]">
            ₹{offerPrice}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
