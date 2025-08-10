import React, { useState } from 'react'
import services from '../data/packageData'; 
const MAX_SELECTION = 4;
const PACKAGE_PRICE = 999;
const Packages = () => {
    const [selectedServices, setSelectedServices] = useState([]);
    

  const toggleSelect = (service) => {
    const alreadySelected = selectedServices.find(item => item.id === service.id);

    if (alreadySelected) {
      setSelectedServices(prev => prev.filter(item => item.id !== service.id));
    } else {
      if (selectedServices.length >= MAX_SELECTION) {
        alert(`You can only select ${MAX_SELECTION} services.`);
        return;
      }
      setSelectedServices(prev => [...prev, service]);
    }
  };

  const handleConfirm = () => {
    if (selectedServices.length < MAX_SELECTION) {
      alert(`Please select ${MAX_SELECTION} services.`);
      return;
    }

    // Send selectedServices to cart or WhatsApp (depending on your setup)
    console.log("Package booked:", selectedServices);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-4 text-[var(--color-accent)]">Festival Special: Choose 4 Services for ₹999</h2>
      <p className="text-center text-gray-600 mb-6">Select any 4 from the options below:</p>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {services.map(service => {
          const isSelected = selectedServices.find(item => item.id === service.id);
          return (
            <div
              key={service.id}
              className={`border p-4 rounded-md cursor-pointer transition-all duration-200 ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
              onClick={() => toggleSelect(service)}
            >
              <img src={service.image} alt={service.name} className="h-40 w-full object-cover rounded mb-2" />
              <h3 className="font-semibold text-lg">{service.name}</h3>
              <p className="text-sm text-gray-500">{service.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <p className="mb-2">Selected: {selectedServices.length} / {MAX_SELECTION}</p>
        <p className="mb-4 font-medium text-lg">Total: ₹{selectedServices.length === MAX_SELECTION ? PACKAGE_PRICE : 0}</p>
        <button
          disabled={selectedServices.length !== MAX_SELECTION}
          className={`px-6 py-3 rounded-md font-semibold transition-all ${
            selectedServices.length === MAX_SELECTION
              ? 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-secondary)]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={handleConfirm}
        >
          Confirm Package
        </button>
      </div>
    </div>
  );
}

export default Packages