/* eslint-disable no-irregular-whitespace */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig.js";
import { useCart } from "../context/CartContext.jsx";

const PackageDetails = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, isInCart, cartItems } = useCart();

  const [pkgData, setPkgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    const fetchPackage = async () => {
      if (!id) {
        setError("Invalid package ID");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const docRef = doc(db, "packages", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPkgData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Package not found");
        }
      } catch (err) {
        console.error("Error fetching package:", err);
        setError("Failed to load package");
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  useEffect(() => {
    if (pkgData) {
      const existing = cartItems.find((item) => item.id === pkgData.id);
      if (existing && existing.services) {
        const indexes = existing.services.map((s) =>
          pkgData.items.findIndex((i) => i.name === s.name)
        );
        setSelectedServices(indexes.filter((i) => i !== -1));
      }
    }
  }, [cartItems, pkgData]);

  const toggleService = (index) => {
    if (selectedServices.includes(index)) {
      setSelectedServices(selectedServices.filter((i) => i !== index));
    } else {
      if (selectedServices.length >= pkgData.maxServices) {
        alert(`You can select only ${pkgData.maxServices} services.`);
        return;
      }
      setSelectedServices([...selectedServices, index]);
    }
  };

  const calculateTotalDuration = () => {
    return selectedServices.reduce((total, index) => {
      return total + (pkgData.items[index]?.duration || 0);
    }, 0);
  };

  const handleCart = () => {
    if (selectedServices.length !== pkgData.maxServices) {
      alert(`Please select exactly ${pkgData.maxServices} services.`);
      return;
    }
    const selectedItems = selectedServices.map((i) => pkgData.items[i]);
    const totalDuration = calculateTotalDuration();
    
    const product = {
      id: pkgData.id,
      name: pkgData.name,
      price: pkgData.price,
      image: pkgData.imageUrl,
      services: selectedItems,
      duration: totalDuration,
    };
    if (isInCart(pkgData.id)) {
      removeFromCart(pkgData.id);
    } else {
      addToCart(product);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 px-6 py-2 bg-[var(--color-accent)] text-white rounded hover:opacity-90 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!pkgData) {
    return <p className="text-center mt-10 text-red-500">Package not found.</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto py-15">
      <div className="w-full mb-6">
        {pkgData.imageUrl ? (
          <img
            src={pkgData.imageUrl}
            alt={pkgData.name}
            className="w-full h-90 object-cover rounded-lg shadow-lg"
          />
        ) : (
          <div className="w-full h-90 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">No Image Available</span>
          </div>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-2">{pkgData.name}</h1>
      <p className="mb-2">{pkgData.description}</p>
      <p className="font-semibold text-lg mb-6">
        Price:{" "}
        <span className="text-[var(--color-accent)]">₹{pkgData.price}</span>
        {selectedServices.length > 0 && (
          <span className="text-sm text-gray-600 ml-2">({calculateTotalDuration()} min approx.)</span>
        )}
      </p>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Select up to {pkgData.maxServices} services:</h2>
        <span className="text-gray-600 font-medium">
          {selectedServices.length} / {pkgData.maxServices} selected
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {pkgData.items?.length > 0 ? (
          pkgData.items.map((service, index) => (
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
                <p className="text-gray-500 text-xs mt-1">
                  {service.duration || 0} min
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-red-500">No services found for this package.</p>
        )}
      </div>

      <button
        onClick={handleCart}
        disabled={selectedServices.length !== pkgData.maxServices}
        className={`mt-6 px-6 py-2 rounded-lg ${
          selectedServices.length !== pkgData.maxServices
            ? "bg-gray-400 cursor-not-allowed"
            : isInCart(pkgData.id)
            ? "bg-red-500 text-white"
            : "bg-[var(--color-accent)] text-white hover:opacity-90"
        }`}
      >
        {isInCart(pkgData.id)
          ? "Remove from Cart"
          : `Add ${selectedServices.length} Services to Cart`}
      </button>
    </div>
  );
};

export default PackageDetails;