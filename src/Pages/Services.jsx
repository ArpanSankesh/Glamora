import React, { useState } from 'react';
import ProductCard from '../Components/ProductCard';
import AboutSection from '../Components/AboutSection';
import services from '../data/servicesData.js';
import ContactSection from '../Components/ContactSection';
import packages from '../data/packageData.js';

// Extract categories dynamically
const getCategories = (services) => {
  const allCategories = services.map((service) => service.category);
  return [...new Set(allCategories)];
};

const Services = () => {
  const [viewType, setViewType] = useState('services'); // "services" or "packages"
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Pick correct dataset depending on view
  const activeData = viewType === 'services' ? services : packages;
  const categories = ['All', ...getCategories(activeData)];

  const filteredData =
    selectedCategory === 'All'
      ? activeData
      : activeData.filter((item) => item.category === selectedCategory);

  return (
    <div className="w-full pt-25">

      {/* View Toggle */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => {
            setViewType('services');
            setSelectedCategory('All');
          }}
          className={`px-5 py-2 rounded-full border ${viewType === 'services'
              ? 'bg-[var(--color-accent)] text-white'
              : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
            }`}
        >
          Services
        </button>
        <button
          onClick={() => {
            setViewType('packages');
            setSelectedCategory('All');
          }}
          className={`px-5 py-2 rounded-full border ${viewType === 'packages'
              ? 'bg-[var(--color-accent)] text-white'
              : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
            }`}
        >
          Packages
        </button>
      </div>

      {/* Category Section */}
      <h2 className="text-2xl font-semibold text-center mb-6">
        Browse {viewType === 'services' ? 'Services' : 'Packages'} by Category
      </h2>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full border transition-colors ${selectedCategory === cat
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Data Grid */}
      <div className="flex flex-wrap items-center justify-center gap-6">
        {filteredData.map((item) => (
          <ProductCard
            key={item.id}
            id={item.id}
            name={item.name}
            description={item.description}
            category={item.category}
            time={item.time}
            price={item.price}
            offerPrice={item.offerPrice}
            image={item.image}
            viewType={viewType} 
          />

        ))}

        {filteredData.length === 0 && (
          <p className="text-gray-500">No {viewType} found for this category.</p>
        )}
      </div>

      {/* About & Contact */}
      <div className="lg:mt-40 mt-10">
        <AboutSection />
        <ContactSection />
      </div>
    </div>
  );
};

export default Services;
