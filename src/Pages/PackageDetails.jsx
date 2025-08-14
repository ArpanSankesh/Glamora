import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import packages from "../data/packageData";
import { useCart } from "../context/CartContext";

const PackageDetails = () => {
    
  const { id } = useParams();
  const { addToCart, removeFromCart, isInCart, cartItems } = useCart();

  const packageData = packages.find((pkg) => pkg.id === parseInt(id));
  const [selectedServices, setSelectedServices] = useState([]);

  if (!packageData) {
    return <p className="text-center mt-10 text-red-500">Package not found.</p>;
  }

  const maxServices = 4;

  // Initialize selected services from cart if package already in cart
  useEffect(() => {
    const existing = cartItems.find((item) => item.id === packageData.id);
    if (existing) {
      const serviceIds = existing.services.map(s => s.id);
      setSelectedServices(serviceIds);
    }
  }, [cartItems, packageData.id]);

  const toggleService = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId));
    } else {
      if (selectedServices.length >= maxServices) {
        alert(`You can select only ${maxServices} services.`);
        return;
      }
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const handleCart = () => {
  if (selectedServices.length !== maxServices) {
    alert(`Please select exactly ${maxServices} services.`);
    return;
  }

  const product = {
    id: packageData.id,
    name: packageData.name,
    price: packageData.price,
    image: packageData.image,
    services: packageData.services.filter(s => selectedServices.includes(s.id)), // save selected services
  };

  if (isInCart(packageData.id)) {
    removeFromCart(packageData.id);
  } else {
    addToCart(product);
  }
};


  return (
    <div className="p-6 max-w-4xl mx-auto py-30">
      {/* Package image */}
      <div className="w-full mb-6">
        <img
          src={packageData.image}
          alt={packageData.name}
          className="w-full h-90 object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Package info */}
      <h1 className="text-3xl font-bold mb-2">{packageData.name}</h1>
      <p className="mb-2">{packageData.description}</p>
      <p className="font-semibold text-lg mb-6">
        Price: <span className="text-[var(--color-accent)]">₹{packageData.price}</span>
      </p>

      {/* Services selection */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">
          Select up to {maxServices} services:
        </h2>
        <span className="text-gray-600 font-medium">
          {selectedServices.length} / {maxServices} selected
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {packageData.services.map((service) => (
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
              src={service.image || `/assets/services/${service.name.replace(/\s+/g, '').toLowerCase()}.jpg`}
              alt={service.name}
              className="w-16 h-16 object-cover rounded-md"
            />
            <div>
              <p className="font-semibold">{service.name}</p>
              <p className="text-gray-600">₹{service.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Remove Cart button */}
      <button
        onClick={handleCart}
        className={`mt-6 px-6 py-2 rounded-lg ${
          selectedServices.length !== maxServices
            ? "bg-gray-400 cursor-not-allowed"
            : isInCart(packageData.id)
            ? "bg-[var(--color-text)] text-[var(--color-accent)] border border-[var(--color-accent)] hover:[var(--color-accent)]"
            : "text-[var(--color-text)] bg-[var(--color-accent)] hover:bg-[var(--color-text)] hover:text-[var(--color-accent)]"
        }`}
      >
        {isInCart(packageData.id)
          ? "Remove from Cart"
          : `Add ${selectedServices.length} Services to Cart`}
      </button>
    </div>
  );
};

export default PackageDetails;
