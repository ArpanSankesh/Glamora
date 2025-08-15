/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import packageData from "../data/packageData.js";
import { useCart } from '../context/CartContext.jsx';

const PackageDetails = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, isInCart, cartItems } = useCart();

  const pkgData = packageData.find((pkg) => pkg.id === parseInt(id));
  const [selectedServices, setSelectedServices] = useState([]);

  if (!pkgData) {
    return <p className="text-center mt-10 text-red-500">Package not found.</p>;
  }

  const maxServices = pkgData.services ? pkgData.services.length : 0;

  useEffect(() => {
    const existing = cartItems.find((item) => item.id === pkgData.id);
    if (existing && existing.services) {
      const serviceIds = existing.services.map((s) => s.id);
      setSelectedServices(serviceIds);
    }
  }, [cartItems, pkgData.id]);

  const toggleService = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId));
    } else {
      if (selectedServices.length >= 4) {
        alert(`You can select only 4 services.`);
        return;
      }
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const handleCart = () => {
    if (selectedServices.length !== 4) {
      alert(`Please select exactly 4 services.`);
      return;
    }

    const product = {
      id: pkgData.id,
      name: pkgData.name,
      price: pkgData.price,
      image: pkgData.image,
      services: pkgData.services.filter((s) => selectedServices.includes(s.id)), 
    };

    if (isInCart(pkgData.id)) {
      removeFromCart(pkgData.id);
    } else {
      addToCart(product);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto py-30">
      {/* Package image */}
      <div className="w-full mb-6">
        <img
          src={pkgData.image}
          alt={pkgData.name}
          className="w-full h-90 object-cover rounded-lg shadow-lg"
        />
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
        {pkgData.services && Array.isArray(pkgData.services) ? (
          pkgData.services.map((service) => (
            <div
              key={service.id}
              className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition ${
                selectedServices.includes(service.id)
                  ? "bg-[var(--color-opaque)] border-[var(--color-accent)]"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => toggleService(service.id)}
            >
              <img
                src={service.image}
                alt={service.name}
                className="w-16 h-16 object-cover rounded-md"
              />
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
