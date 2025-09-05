import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig.js";
import ProductCard from "../Components/ProductCard";
import AboutSection from "../Components/AboutSection";
import ContactSection from "../Components/ContactSection";
import PackageCard from "../Components/PackageCard.jsx";

const Services = () => {
  const [selectedServiceCategory, setSelectedServiceCategory] = useState("all");
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch services
        const servicesSnap = await getDocs(collection(db, "services"));
        const servicesData = servicesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch packages
        const packagesSnap = await getDocs(collection(db, "packages"));
        const packagesData = packagesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch categories
        const categoriesSnap = await getDocs(collection(db, "categories"));
        const categoriesData = categoriesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setServices(servicesData);
        setPackages(packagesData);

        // add "All" option with a default icon
        setCategories([
          { 
            id: "all", 
            name: "All", 
            imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 7V5a2 2 0 0 1 2-2h2'%3E%3C/path%3E%3Cpath d='M17 3h2a2 2 0 0 1 2 2v2'%3E%3C/path%3E%3Cpath d='M21 17v2a2 2 0 0 1-2 2h-2'%3E%3C/path%3E%3Cpath d='M7 21H5a2 2 0 0 1-2-2v-2'%3E%3C/path%3E%3Crect x='7' y='7' width='10' height='10' rx='1'%3E%3C/rect%3E%3C/svg%3E"
          }, 
          ...categoriesData
        ]);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter services by categoryId
  const filteredServices =
    selectedServiceCategory === "all"
      ? services
      : services.filter((item) => item.categoryId === selectedServiceCategory);

  const handleCategorySelect = (categoryId) => {
    setSelectedServiceCategory(categoryId);
  };

  // Carousel scroll functions
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-500">Loading services and packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-25 px-2 sm:px-6 lg:px-8">
      {/* Packages Section */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Packages</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated packages designed to give you the best value and experience.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {packages.map((item) => (
            <PackageCard key={item.id} {...item} viewType="packages" />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Services</h2>
        </div>

        {/* Compact Category Carousel with Navigation */}
        <div className="mb-8">
          <div className="relative flex items-center justify-center">
            {/* Left Arrow Button */}
            <button
              onClick={scrollLeft}
              className="absolute left-2 z-10 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 hover:border-pink-300"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4 text-gray-600 hover:text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Category Carousel */}
            <div 
              ref={carouselRef}
              className="flex items-center gap-3 overflow-x-auto scrollbar-hide px-12 py-2 max-w-4xl"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`flex-shrink-0 cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
                    category.id === selectedServiceCategory
                      ? "ring-2 ring-pink-500 shadow-lg scale-105"
                      : "hover:shadow-md hover:scale-102"
                  }`}
                >
                  <div className="w-36 h-20 flex items-center justify-center bg-gray-50">
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-20 h-full object-cover rounded"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23ec4899' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21,15 16,10 5,21'%3E%3C/polyline%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div className="bg-white px-2 py-1 text-center w-full">
                    <p className={`text-xs font-medium  ${
                      category.id === selectedServiceCategory
                        ? "text-pink-600"
                        : "text-gray-700"
                    }`}>
                      {category.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow Button */}
            <button
              onClick={scrollRight}
              className="absolute right-2 z-10 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 hover:border-pink-300"
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4 text-gray-600 hover:text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scale-102 {
            transform: scale(1.02);
          }
        `}</style>

        {/* Services Grid */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {filteredServices.map((item) => (
            <ProductCard key={item.id} {...item} viewType="services" />
          ))}
          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.477.94-6.02 2.462" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No services found for this category.</p>
              <p className="text-gray-400 text-sm mt-2">Try selecting a different category above.</p>
            </div>
          )}
        </div>
      </section>

      {/* About & Contact */}
      <div className="lg:mt-40 mt-10">
        <AboutSection />
        <ContactSection />
      </div>
    </div>
  );
};

export default Services;