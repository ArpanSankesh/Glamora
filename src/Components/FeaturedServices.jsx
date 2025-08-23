import React, { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import { collection, getDocs, limit, query } from 'firebase/firestore'
import { db } from '../config/firebaseConfig.js'
import { useNavigate } from 'react-router-dom'

const FeaturedServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        
        // Fetch first 6 services from Firebase
        const servicesQuery = query(
          collection(db, 'services'), 
          limit(6)
        );
        
        const servicesSnap = await getDocs(servicesQuery);
        const servicesData = servicesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Map Firebase fields to component props
          image: doc.data().imageUrl, // Map imageUrl to image for ProductCard
          category: doc.data().categoryName, // Map categoryName to category
          time: doc.data().time ? `${doc.data().time} min` : null, // Format time display
          price: parseInt(doc.data().price) || 0, // Ensure price is number
        }));

        console.log('🔥 Fetched services from Firebase:', servicesData);
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className='my-20 mx-10 flex flex-col items-center justify-center'>
        <h1 className="text-3xl md:text-5xl font-medium text-[var(--color-accent)] text-center">Featured Services</h1>
        <p className="text-[var(--color-secondary)] text-center md:text-xl mt-2">Explore our top beauty treatments.</p>
        
        {/* Loading skeleton */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="w-64 h-80 bg-gray-200 animate-pulse rounded-md">
              <div className="h-48 bg-gray-300 rounded-t-md"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                <div className="h-3 bg-gray-300 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='my-20 mx-10 flex flex-col items-center justify-center'>
        <h1 className="text-3xl md:text-5xl font-medium text-[var(--color-accent)] text-center">Featured Services</h1>
        <p className="text-red-500 text-center md:text-xl mt-2">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-6 py-2 bg-[var(--color-accent)] text-white rounded hover:bg-[var(--color-secondary)] transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  // No services found
  if (services.length === 0) {
    return (
      <div className='my-20 mx-10 flex flex-col items-center justify-center'>
        <h1 className="text-3xl md:text-5xl font-medium text-[var(--color-accent)] text-center">Featured Services</h1>
        <p className="text-[var(--color-secondary)] text-center md:text-xl mt-2">No services available at the moment.</p>
      </div>
    );
  }

  return (
    <div className='my-20 mx-10 flex flex-col items-center justify-center'>
      <h1 className="text-3xl md:text-5xl font-medium text-[var(--color-accent)] text-center">Featured Services</h1>
      <p className="text-[var(--color-secondary)] text-center md:text-xl mt-2">Explore our top beauty treatments.</p>
      
      <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
        {services.map(service => (
          <ProductCard
            key={service.id}
            id={service.id}
            name={service.name}
            description={service.description}
            category={service.category}
            time={service.time}
            price={service.price}
            offerPrice={service.offerPrice}
            image={service.image} // Now mapped from imageUrl
            viewType="service"
          />
        ))}
      </div>

      <button 
        onClick={() => navigate('/services')} 
        className='cursor-pointer px-10 py-3 border-2 border-[var(--color-accent)] text-[var(--color-accent)] mt-20 rounded-full hover:bg-[var(--color-accent)] hover:text-[var(--color-text)] transition-all'
      >
        More
      </button>
    </div>
  )
}

export default FeaturedServices