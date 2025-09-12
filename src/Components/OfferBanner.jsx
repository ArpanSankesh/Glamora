import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../config/firebaseConfig.js';

const OfferBanner = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    fetchAllActiveOffers();
  }, []);

  // Trigger re-animation when offers change
  useEffect(() => {
    if (offers.length > 0) {
      setAnimationKey(prev => prev + 1);
    }
  }, [offers]);

  const fetchAllActiveOffers = async () => {
    try {
      setLoading(true);
      
      // Get current date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Query to get ALL active offers (where validUntil is greater than or equal to today)
      const q = query(
        collection(db, 'offers'),
        where('validUntil', '>=', today),
        orderBy('validUntil', 'asc')
      );

      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const offersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setOffers(offersData);
      } else {
        // If no active offers, get the latest created offers as fallback
        const fallbackQuery = query(
          collection(db, 'offers'),
          orderBy('createdAt', 'desc')
        );
        
        const fallbackSnapshot = await getDocs(fallbackQuery);
        if (!fallbackSnapshot.empty) {
          const offersData = fallbackSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setOffers(offersData);
        }
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const closeBanner = () => {
    setIsVisible(false);
  };

  const createOfferText = (offer) => {
    let text = `${offer.name} | ${offer.discount}% OFF`;
    
    if (offer.minOrderValue) {
      text += ` on Orders Above ₹${offer.minOrderValue}`;
    }
    
    if (offer.couponCode) {
      text += ` with code ${offer.couponCode}`;
    }
    
    return text;
  };

  if (!isVisible) return null;

  if (loading) {
    return (
      <div className="w-full py-3 font-medium text-sm text-white text-center bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center animate-[slideRightToLeft_8s_linear_infinite]">
          <div className="whitespace-nowrap px-8 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Loading latest offers...
          </div>
        </div>
        
        <button
          onClick={closeBanner}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-all duration-200 hover:scale-110 focus:outline-none z-20"
          aria-label="Close banner"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <style jsx>{`
          @keyframes slideRightToLeft {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-3 font-medium text-sm text-white text-center bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center animate-[slideRightToLeft_8s_linear_infinite]">
          <div className="whitespace-nowrap px-8 flex items-center gap-2">
            <span className="animate-[sparkle_1.5s_infinite]">✨</span>
            Special Deal: Free Service on Orders Above ₹999! | 20% OFF on First Purchase
            <span className="animate-[sparkle_1.5s_infinite_0.5s]">✨</span>
          </div>
        </div>
        
        <button
          onClick={closeBanner}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-all duration-200 hover:scale-110 focus:outline-none z-20"
          aria-label="Close banner"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <style jsx>{`
          @keyframes slideRightToLeft {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          @keyframes sparkle {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.2); }
          }
        `}</style>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="w-full py-3 font-medium text-sm text-white text-center bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center animate-[slideRightToLeft_8s_linear_infinite]">
          <div className="whitespace-nowrap px-8 flex items-center gap-2">
            <span className="animate-bounce">🎉</span>
            Special Deal: Free Service on Orders Above ₹999
            <span className="animate-bounce animation-delay-300">🎉</span>
          </div>
        </div>
        
        <button
          onClick={closeBanner}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-all duration-200 hover:scale-110 focus:outline-none z-20"
          aria-label="Close banner"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <style jsx>{`
          @keyframes slideRightToLeft {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animation-delay-300 {
            animation-delay: 0.3s;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="w-full py-5 font-medium text-sm text-white text-center bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] relative overflow-hidden group">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[sweep_3s_infinite]"></div>
      
      {/* Sliding container with ALL offers */}
      <div key={animationKey} className="absolute inset-0 flex items-center animate-[slideRightToLeft_12s_linear_infinite] md:animate-[slideRightToLeft_25s_linear_infinite]">
        <div className="whitespace-nowrap flex items-center gap-16">
          {/* Display all offers */}
          {offers.map((offer, index) => (
            <span key={`${offer.id}-${index}`} className="inline-flex items-center gap-2">
              <span className="text-yellow-300">🏷️</span>
              <span>{createOfferText(offer)}</span>
              {offer.couponCode && (
                <span className="px-2 py-1 bg-white/20 rounded border border-white/30 text-xs font-bold animate-[highlight_2s_infinite]">
                  {offer.couponCode}
                </span>
              )}
              <span className="animate-[sparkle_1.5s_infinite] text-yellow-300">✨</span>
            </span>
          ))}
          
          {/* Duplicate the offers for seamless loop */}
          {offers.map((offer, index) => (
            
            <span key={`${offer.id}-duplicate-${index}`} className="inline-flex items-center gap-2">
              
              <span className="text-yellow-300">🏷️ </span>
              <span>{createOfferText(offer)}</span>
              {offer.couponCode && (
                <span className="px-2 py-1 bg-white/20 rounded border border-white/30 text-xs font-bold animate-[highlight_2s_infinite]">
                  {offer.couponCode}
                </span>
              )}
              <span className="animate-[sparkle_1.5s_infinite] text-yellow-300">✨</span>
            
            </span>
          ))}
        </div>
      </div>

      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-[particle1_6s_infinite] top-1 left-[10%]"></div>
        <div className="absolute w-1 h-1 bg-white/30 rounded-full animate-[particle2_5s_infinite] top-2 left-[30%]"></div>
        <div className="absolute w-1.5 h-1.5 bg-white/25 rounded-full animate-[particle3_7s_infinite] top-1 right-[20%]"></div>
        <div className="absolute w-1 h-1 bg-white/40 rounded-full animate-[particle4_4s_infinite] bottom-1 left-[60%]"></div>
        <div className="absolute w-2 h-2 bg-white/15 rounded-full animate-[particle5_8s_infinite] bottom-2 right-[40%]"></div>
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideRightToLeft {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes highlight {
          0%, 100% { background-color: rgba(255, 255, 255, 0.2); transform: scale(1); }
          50% { background-color: rgba(255, 255, 255, 0.3); transform: scale(1.05); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
          25% { opacity: 0.7; transform: scale(1.2) rotate(90deg); }
          50% { opacity: 0.5; transform: scale(0.8) rotate(180deg); }
          75% { opacity: 0.7; transform: scale(1.1) rotate(270deg); }
        }
        
        @keyframes particle1 {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.2; }
          25% { transform: translateY(-15px) translateX(10px) rotate(90deg); opacity: 0.8; }
          50% { transform: translateY(-5px) translateX(-5px) rotate(180deg); opacity: 0.4; }
          75% { transform: translateY(-20px) translateX(15px) rotate(270deg); opacity: 0.6; }
        }
        
        @keyframes particle2 {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.3; }
          33% { transform: translateY(-10px) translateX(-10px) scale(1.5); opacity: 0.9; }
          66% { transform: translateY(5px) translateX(10px) scale(0.8); opacity: 0.5; }
        }
        
        @keyframes particle3 {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.25; }
          50% { transform: translateY(-25px) rotate(180deg); opacity: 0.7; }
        }
        
        @keyframes particle4 {
          0%, 100% { transform: translateX(0) scale(1); opacity: 0.4; }
          50% { transform: translateX(20px) scale(1.3); opacity: 0.8; }
        }
        
        @keyframes particle5 {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg) scale(1); opacity: 0.15; }
          25% { transform: translateY(-8px) translateX(-15px) rotate(45deg) scale(1.2); opacity: 0.6; }
          50% { transform: translateY(-15px) translateX(0px) rotate(90deg) scale(0.9); opacity: 0.3; }
          75% { transform: translateY(-5px) translateX(10px) rotate(135deg) scale(1.1); opacity: 0.5; }
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default OfferBanner;