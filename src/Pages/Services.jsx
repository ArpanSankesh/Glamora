import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig.js';
import ProductCard from '../Components/ProductCard';
import AboutSection from '../Components/AboutSection';
import ContactSection from '../Components/ContactSection';
import PackageCard from '../Components/PackageCard.jsx';

const Services = () => {
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('all');
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch services
        const servicesSnap = await getDocs(collection(db, 'services'));
        const servicesData = servicesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch packages
        const packagesSnap = await getDocs(collection(db, 'packages'));
        const packagesData = packagesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch categories
        const categoriesSnap = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnap.docs.map((doc) => ({
          id: doc.id, // categoryId
          ...doc.data(),
        }));

        setServices(servicesData);
        setPackages(packagesData);

        // add "All" option
        setCategories([{ id: 'all', name: 'All' }, ...categoriesData]);
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter services by categoryId
  const filteredServices =
    selectedServiceCategory === 'all'
      ? services
      : services.filter(
          (item) => item.categoryId === selectedServiceCategory
        );

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading services and packages...</p>
      </div>
    );
  }

  return (
    <div className="w-full pt-25">
      {/* Packages Section */}
      <h2 className="text-2xl font-semibold text-center mb-6">Our Packages</h2>
      <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
        {packages.map((item) => (
          <PackageCard key={item.id} {...item} viewType="packages" />
        ))}
      </div>

      {/* Services Section */}
      <h2 className="text-2xl font-semibold text-center mb-6">Our Services</h2>
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedServiceCategory(cat.id)}
            className={`px-4 py-2 rounded-full border transition-colors ${
              selectedServiceCategory === cat.id
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6">
        {filteredServices.map((item) => (
          <ProductCard key={item.id} {...item} viewType="services" />
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
