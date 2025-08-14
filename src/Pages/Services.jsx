import React, { useState } from 'react';
import ProductCard from '../Components/ProductCard';
import AboutSection from '../Components/AboutSection';
import services from '../data/servicesData.js';
import ContactSection from '../Components/ContactSection';
import packages from '../data/packageData.js';
import PackageCard from '../Components/PackageCard.jsx';

// Extract categories dynamically
const getCategories = (data) => {
  const allCategories = data.map((item) => item.category);
  return ['All', ...new Set(allCategories)];
};

const Services = () => {
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('All');

  const serviceCategories = getCategories(services);

  const filteredServices =
    selectedServiceCategory === 'All'
      ? services
      : services.filter((item) => item.category === selectedServiceCategory);

  return (
    <div className="w-full pt-25">
      {/* Packages Section */}
      <h2 className="text-2xl font-semibold text-center mb-6">Our Packages</h2>
      <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
        {packages.map((item) => (
          <PackageCard
            key={item.id}
            id={item.id}
            name={item.name}
            description={item.description}
            category={item.category}
            time={item.time}
            price={item.price}
            offerPrice={item.offerPrice}
            image={item.image}
            viewType="packages"
          />
        ))}
      </div>

      {/* Services Section */}
      <h2 className="text-2xl font-semibold text-center mb-6">Our Services</h2>
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {serviceCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedServiceCategory(cat)}
            className={`px-4 py-2 rounded-full border transition-colors ${
              selectedServiceCategory === cat
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6">
        {filteredServices.map((item) => (
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
            viewType="services"
          />
        ))}
        {filteredServices.length === 0 && (
          <p className="text-gray-500">No services found for this category.</p>
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
