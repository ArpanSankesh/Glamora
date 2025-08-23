import React from 'react';
import { useNavigate } from 'react-router-dom';

const PackageCard = ({ id, name, description, category, time, price, image, packageImageUrl }) => {
  const navigate = useNavigate();

  // Use packageImageUrl if image is not provided (for flexibility)
  const displayImage = image || packageImageUrl;

  // Debug logging
  console.log('PackageCard props:', { id, name, image, packageImageUrl, displayImage });

  const handleClick = () => {
    navigate(`/package/${id}`);
  };

  // Check if image URL is valid
  const hasValidImage = displayImage && displayImage.trim() !== '' && displayImage !== 'undefined' && displayImage !== 'null';

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
                   md:rounded-t-md overflow-hidden
                   flex items-center justify-center"
      >
        {hasValidImage ? (
          <div
            className="w-full h-full bg-cover bg-center bg-gray-200"
            style={{ backgroundImage: `url(${displayImage})` }}
            onError={(e) => {
              console.error('Failed to load background image:', displayImage);
              e.target.style.backgroundImage = 'none';
            }}
          />
        ) : (
          // Fallback when no image is available
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <p className="text-xs">No Image</p>
            </div>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col justify-between text-gray-500/60 text-sm flex-1">
        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-[var(--color-secondary)] font-semibold text-md md:text-xl">{name || 'Unnamed Package'}</p>
            <p className="text-[var(--color-secondary)] text-xs md:text-base">{time || 'N/A'}</p>
          </div>
          {category && (
            <p className="text-[var(--color-accent)] font-medium text-xs md:text-sm mb-1">
              {category}
            </p>
          )}
          <p className="text-gray-700 line-clamp-3 text-sm">{description || 'No description available'}</p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <p className="text-base md:text-xl font-medium text-[var(--color-secondary)]">
            ₹{price || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;