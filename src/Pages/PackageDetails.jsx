/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig.js";
import { useCart } from '../context/CartContext.jsx';

const PackageDetails = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, isInCart, cartItems } = useCart();

  const [pkgData, setPkgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  // Fetch package data from Firebase
  useEffect(() => {
    const fetchPackage = async () => {
      if (!id) {
        setError("Invalid package ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log(`Fetching package with ID: ${id}`);

        // Fetch document from Firebase
        const docRef = doc(db, "packages", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const packageData = {
            id: docSnap.id,
            ...docSnap.data()
          };
          console.log("Package found:", packageData);
          setPkgData(packageData);
        } else {
          console.log("No package found!");
          setError("Package not found");
        }

      } catch (err) {
        console.error("Error fetching package:", err);
        setError(err.message || "Failed to load package");
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  const maxServices = pkgData?.servicesDetails ? pkgData.servicesDetails.length : 0;

  useEffect(() => {
    if (pkgData) {
      const existing = cartItems.find((item) => item.id === pkgData.id);
      if (existing && existing.services) {
        const serviceIndexes = existing.services.map((s) => s.id);
        setSelectedServices(serviceIndexes);
      }
    }
  }, [cartItems, pkgData]);

  // Fixed: Use array index instead of service.id
  const toggleService = (serviceIndex) => {
    if (selectedServices.includes(serviceIndex)) {
      setSelectedServices(selectedServices.filter((index) => index !== serviceIndex));
    } else {
      if (selectedServices.length >= 4) {
        alert(`You can select only 4 services.`);
        return;
      }
      setSelectedServices([...selectedServices, serviceIndex]);
    }
  };

  const handleCart = () => {
    if (selectedServices.length !== 4) {
      alert(`Please select exactly 4 services.`);
      return;
    }

    // Use servicesDetails array which contains the proper object structure
    const selectedServiceDetails = selectedServices.map(index => {
      const service = pkgData.servicesDetails[index];
      return {
        id: index, // Using index as ID
        name: service.name,
        price: service.price,
        image: service.imageUrl, // Changed from service.image to service.imageUrl
        duration: service.duration
      };
    });

    const product = {
      id: pkgData.id,
      name: pkgData.name,
      price: pkgData.price,
      image: pkgData.packageImageUrl,
      services: selectedServiceDetails, 
    };

    if (isInCart(pkgData.id)) {
      removeFromCart(pkgData.id);
    } else {
      addToCart(product);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto py-30">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)]"></div>
            <p className="text-gray-500">Loading package details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto py-30">
        <div className="text-center py-20">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-[var(--color-accent)] text-white rounded hover:opacity-90 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Package not found
  if (!pkgData) {
    return <p className="text-center mt-10 text-red-500">Package not found.</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto py-30">
      {/* Package image */}
      <div className="w-full mb-6">
        {pkgData.packageImageUrl ? (
          <img
            src={pkgData.packageImageUrl}
            alt={pkgData.name}
            className="w-full h-90 object-cover rounded-lg shadow-lg"
          />
        ) : (
          <div className="w-full h-90 bg-gray-200 rounded-lg shadow-lg flex items-center justify-center">
            <span className="text-gray-400 text-lg">No Image Available</span>
          </div>
        )}
      </div>

      {/* Package info */}
      <h1 className="text-3xl font-bold mb-2">{pkgData.name}</h1>
      <p className="mb-2">{pkgData.description}</p>
      <p className="font-semibold text-lg mb-6">
        Price:{" "}
        <span className="text-[var(--color-accent)]">₹{pkgData.price}</span> 
      </p>

      {/* Services selection */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">
          Select up to 4 services:
        </h2>
        <span className="text-gray-600 font-medium">
          {selectedServices.length} / 4 selected
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {pkgData.servicesDetails && Array.isArray(pkgData.servicesDetails) ? (
          pkgData.servicesDetails.map((service, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition ${
                selectedServices.includes(index)
                  ? "bg-[var(--color-opaque)] border-[var(--color-accent)]"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => toggleService(index)}
            >
              {service.imageUrl ? (
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No Image</span>
                </div>
              )}
              <div>
                <p className="font-semibold">{service.name}</p>
                <p className="text-gray-600">₹{service.price}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-red-500">No services found for this package.</p>
        )}
      </div>

      {/* Add/Remove Cart button */}
      <button
        onClick={handleCart}
        className={`mt-6 px-6 py-2 rounded-lg ${
          selectedServices.length !== 4
            ? "bg-gray-400 cursor-not-allowed"
            : isInCart(pkgData.id)
            ? "bg-[var(--color-text)] text-[var(--color-accent)] border border-[var(--color-accent)] hover:[var(--color-accent)]"
            : "text-[var(--color-text)] bg-[var(--color-accent)] hover:bg-[var(--color-text)] hover:text-[var(--color-accent)]"
        }`}
        disabled={selectedServices.length !== 4}
      >
        {isInCart(pkgData.id)
          ? "Remove from Cart"
          : `Add ${selectedServices.length} Services to Cart`}
      </button>
    </div>
  );
};

export default PackageDetails;