import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig.js';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        console.log('Fetching packages from Firebase...');

        const querySnapshot = await getDocs(collection(db, 'packages'));
        const packagesData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log(`Package ${doc.id}:`, data);

          if (!data.imageUrl) {
            console.warn(`Package ${doc.id} has no imageUrl`);
          }

          packagesData.push({
            id: doc.id,
            ...data
          });
        });

        console.log('Total packages fetched:', packagesData.length);
        setPackages(packagesData);

        if (packagesData.length === 0) {
          setError('No packages found in database');
        }
      } catch (err) {
        console.error('Error fetching packages:', err);
        setError(`Failed to load packages: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Auto-slide functionality - reduced time from 4000ms to 2500ms
  useEffect(() => {
    if (packages.length > 1) {
      const interval = setInterval(() => {
        handleSlideChange('next');
      }, 2200); // Change this number to adjust slide timing (in milliseconds)

      return () => clearInterval(interval);
    }
  }, [packages.length]);

  const handleSlideChange = (direction) => {
    if (isTransitioning || packages.length <= 1) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (direction === 'next') {
        setCurrentIndex((prevIndex) =>
          prevIndex === packages.length - 1 ? 0 : prevIndex + 1
        );
      } else {
        setCurrentIndex((prevIndex) =>
          prevIndex === 0 ? packages.length - 1 : prevIndex - 1
        );
      }
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50); // Small delay to ensure smooth transition
    }, 200); // Half of the CSS transition duration
  };

  const handlePackageClick = (packageId) => {
    if (isTransitioning) return;
    console.log('Navigating to package:', packageId);
    navigate(`/package/${packageId}`);
  };

  const handleImageError = (packageId, imageUrl) => {
    console.error(`Image failed to load for package ${packageId}:`, imageUrl);
    setImageErrors(prev => ({ ...prev, [packageId]: true }));
  };

  const handleImageLoad = (packageId, imageUrl) => {
    console.log(`Image loaded successfully for package ${packageId}:`, imageUrl);
    setImageErrors(prev => ({ ...prev, [packageId]: false }));
  };

  const handleDotClick = (index) => {
    if (isTransitioning || index === currentIndex) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 700);
  };

  if (loading) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 bg-red-50 border-2 border-red-200 rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-red-500 text-lg font-semibold mb-2">Error Loading Banner</p>
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="w-full h-96 bg-yellow-50 border-2 border-yellow-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-yellow-600 text-lg">No packages available</p>
          <p className="text-yellow-500 text-sm mt-2">Add some packages to see them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 px-10 md:px-20 relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg group">
      {/* Main Banner Container with sliding effect */}
      <div 
        className="relative w-full h-full rounded-2xl overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        {/* Slides Container */}
        <div 
          className="flex w-full h-full transition-transform duration-500 ease-in-out"
          style={{ 
            transform: `translateX(-${currentIndex * 100}%)`,
            willChange: 'transform'
          }}
        >
          {packages.map((pkg, index) => (
            <div
              key={pkg.id}
              className="w-full h-full flex-shrink-0 cursor-pointer relative"
              onClick={() => handlePackageClick(pkg.id)}
            >
              {pkg.imageUrl && !imageErrors[pkg.id] ? (
                <img
                  src={pkg.imageUrl}
                  alt={pkg.name || 'Package'}
                  className={`w-full h-full object-contain transition-transform duration-700 ease-out ${
                    index === currentIndex ? 'hover:scale-105' : 'scale-100'
                  }`}
                  onError={() => handleImageError(pkg.id, pkg.imageUrl)}
                  onLoad={() => handleImageLoad(pkg.id, pkg.imageUrl)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-500 rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium">No Image Available</p>
                    <p className="text-sm">{pkg.name || 'Package'}</p>
                  </div>
                </div>
              )}

              {/* Overlay gradient for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation controls */}
      {packages.length > 1 && (
        <>
          <button
            onClick={() => handleSlideChange('prev')}
            disabled={isTransitioning}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 z-10 ${
              isTransitioning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
            }`}
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => handleSlideChange('next')}
            disabled={isTransitioning}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 z-10 ${
              isTransitioning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
            }`}
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Enhanced dot indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
            {packages.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                disabled={isTransitioning}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white scale-125 shadow-lg'
                    : 'bg-white/50 hover:bg-white/75 hover:scale-110'
                } ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Loading overlay during transitions */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-black/5 z-5 pointer-events-none"></div>
      )}
    </div>
  );
};

export default Banner;