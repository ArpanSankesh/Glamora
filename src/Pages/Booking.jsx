import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import emailjs from '@emailjs/browser';

const Booking = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    houseNo: "",
    street: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    instruction: "",
    date: "",
    timeSlot: ""
  });
  const [loading, setLoading] = useState(false);

  // EmailJS configuration
  const EMAILJS_SERVICE_ID = 'service_74hljrr'; // Your service ID
  const EMAILJS_TEMPLATE_ID = 'template_8hcq34l'; // Your template ID
  const EMAILJS_PUBLIC_KEY = '4Oes1RsRwt5IACLMK'; // Replace with your EmailJS public key
  const SELLER_EMAIL = 'jazzbeautysecrets@gmail.com'; // Replace with actual seller email

  // Initialize EmailJS
  React.useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  // Send email notification to seller
  const sendSellerNotification = async (orderDetails) => {
    try {
      const emailParams = {
        name: orderDetails.customerName,
        time: new Date().toLocaleString(),
        message: `New Order Received!
        
Order Details:
- Customer: ${orderDetails.customerName}
- Phone: ${orderDetails.phone}
- Address: ${orderDetails.address}
- Date: ${orderDetails.date}
        - Time: ${orderDetails.time}
- Items: ${orderDetails.items.map(item => `${item.name} (Qty: ${item.quantity})`).join(', ')}
- Total Amount: ₹${orderDetails.total}

${orderDetails.instruction ? `Special Instructions: ${orderDetails.instruction}` : ''}

Please check your admin dashboard for complete order details.`,
        to_email: SELLER_EMAIL,
        to_name: 'Seller'
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        emailParams
      );
      
      console.log('Email notification sent to seller successfully');
    } catch (error) {
      console.error('Failed to send email notification:', error);
      // Don't show error to user as this is a background process
    }
  };

  // Generate time slots from 8 AM to 9 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 8; i <= 20; i++) {
      const startHour = i;
      const endHour = i + 1;
      const startTime = startHour <= 12 ? 
        `${startHour}:00 AM` : 
        startHour === 12 ? "12:00 PM" : 
        `${startHour - 12}:00 PM`;
      const endTime = endHour <= 12 ? 
        `${endHour}:00 AM` : 
        endHour === 12 ? "12:00 PM" : 
        `${endHour - 12}:00 PM`;
      
      slots.push({
        value: `${startHour}:00-${endHour}:00`,
        label: `${startTime} - ${endTime}`
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.offerPrice ?? item.price ?? 0;
    const quantity = item.quantity ?? 1;
    return sum + price * quantity;
  }, 0);

  // Calculate service charge
  const serviceCharge = subtotal >= 999 ? 0 : 150;
  const total = subtotal + serviceCharge;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("You must be logged in to place an order.");
      return;
    }

    const { name, phone, houseNo, street, area, city, state, pincode, date, timeSlot } = formData;
    const fullAddress = `${houseNo}, ${street}, ${area}, ${city}, ${state} - ${pincode}${formData.landmark ? `, Near ${formData.landmark}` : ''}`;

    if (!name || !phone || !houseNo || !street || !area || !city || !state || !pincode || !date || !timeSlot || cartItems.length === 0) {
      toast.error("Please fill in all required fields and add at least one service.");
      return;
    }

    setLoading(true);

    try {
      const normalizedItems = cartItems.map((it) => ({
        id: it.id,
        name: it.name,
        imageUrl: it.imageUrl || it.image || it.packageImageUrl || "https://placehold.co/200x200?text=Service",
        price: it.price ?? 0,
        offerPrice: it.offerPrice ?? null,
        quantity: it.quantity || 1,
      }));

      // Create order object
      const orderData = {
        userId: currentUser.uid,
        customerName: name,
        phone,
        address: fullAddress,
        instruction: formData.instruction || "",
        date,
        time: timeSlot,
        items: normalizedItems,
        subtotal,
        serviceCharge,
        discount: 0,
        total,
        status: "Pending",
        createdAt: serverTimestamp(),
      };

      // Save order to Firestore
      await addDoc(collection(db, "orders"), orderData);

      // Send email notification to seller
      await sendSellerNotification(orderData);

      // Clear cart and redirect
      cartItems.forEach((item) => removeFromCart(item.id));
      toast.success("Order placed successfully! Seller has been notified.");
      navigate("/my-orders");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-25 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Review your services and complete your booking</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Your Services</h2>
                <span className="bg-[var(--color-opaque)] text-[var(--color-secondary)] px-3 py-1 rounded-full text-sm font-medium">
                  {cartItems.length} {cartItems.length === 1 ? 'Service' : 'Services'}
                </span>
              </div>
              
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-500 mb-4">Your cart is empty</p>
                  <button
                    onClick={() => navigate('/services')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Browse Services
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {cartItems.map((product) => {
                    const displayImage = product.image || product.imageUrl || product.packageImageUrl;
                    const hasValidImage = displayImage && 
                                         typeof displayImage === 'string' && 
                                         displayImage.trim() !== '' && 
                                         !['undefined', 'null', 'false'].includes(displayImage.toLowerCase());

                    return (
                      <div key={product.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-200">
                        {/* Image */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {hasValidImage ? (
                            <img
                              className="w-full h-full object-cover"
                              src={displayImage}
                              alt={product.name || 'Product'}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full flex items-center justify-center text-gray-400 ${hasValidImage ? 'hidden' : 'flex'}`}>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                          <h3 className="font-medium text-sm text-gray-900 mb-1">{product.name}</h3>
                          {product.services && product.services.length > 0 && (
                            <ul className="text-gray-600 text-sm">
                              {product.services.map((s) => (
                                <li key={s.id}>• {s.name}</li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 text-sm">Qty:</span>
                          <select
                            value={product.quantity || 1}
                            onChange={e => updateQuantity(product.id, Number(e.target.value))}
                            className="border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:outline-none"
                          >
                            {[...Array(10)].map((_, idx) => (
                              <option key={idx + 1} value={idx + 1}>{idx + 1}</option>
                            ))}
                          </select>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ₹{(product.offerPrice !== undefined ? product.offerPrice : product.price) * (product.quantity || 1)}
                          </p>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                  
                  <button
                    onClick={() => navigate('/services')}
                    className="text-[var(--color-secondary)] font-medium hover:text-[var(--color-accent)] transition-colors text-sm"
                  >
                    + Add More Services
                  </button>
                </div>
              )}
            </div>

            {/* Booking Form */}
            {cartItems.length > 0 && (
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                
                {/* Personal Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Address</h2>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">House/Flat No. *</label>
                        <input
                          type="text"
                          name="houseNo"
                          value={formData.houseNo}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                          placeholder="House/Flat No."
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street/Road *</label>
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                          placeholder="Street/Road"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Area/Locality *</label>
                        <input
                          type="text"
                          name="area"
                          value={formData.area}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                          placeholder="Area/Locality"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                          placeholder="City"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                          placeholder="State"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code *</label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                          placeholder="PIN Code"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Landmark (Optional)</label>
                        <input
                          type="text"
                          name="landmark"
                          value={formData.landmark}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                          placeholder="Nearby landmark"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instructions (Optional)</label>
                        <input
                          type="text"
                          name="instruction"
                          value={formData.instruction}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                          placeholder="Any special instructions"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date & Time Selection */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Date & Time</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date *</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Time Slot *</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {timeSlots.map((slot) => (
                          <label key={slot.value} className="cursor-pointer">
                            <input
                              type="radio"
                              name="timeSlot"
                              value={slot.value}
                              checked={formData.timeSlot === slot.value}
                              onChange={handleInputChange}
                              className="sr-only"
                              required
                            />
                            <div className={`p-3 text-center text-sm rounded-lg border transition-all ${
                              formData.timeSlot === slot.value
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}>
                              {slot.label}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-[var(--color-secondary)] text-white rounded-lg hover:bg-[var(--color-accent)] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || cartItems.length === 0}
                >
                  {loading ? "Placing Order..." : `Complete Booking - ₹${total.toFixed(0)}`}
                </button>
              </form>
            )}
          </div>

          {/* Order Summary Sidebar - Enhanced Responsiveness */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1 order-first lg:order-last">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:sticky lg:top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm sm:text-base text-gray-600">
                    <span className="truncate mr-2">Subtotal ({cartItems.length} items)</span>
                    <span className="font-medium whitespace-nowrap">₹{subtotal.toFixed(0)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm sm:text-base">
                    <span className="truncate mr-2">Service Charge</span>
                    <span className={`font-medium whitespace-nowrap ${serviceCharge === 0 ? 'text-[var(--color-secondary)]' : 'text-gray-600'}`}>
                      {serviceCharge === 0 ? 'FREE' : `₹${serviceCharge}`}
                    </span>
                  </div>
                  
                  {subtotal < 999 && (
                    <div className="text-xs text-[var(--color-secondary)] bg-[var(--color-opaque)] p-2 rounded">
                      💡 Add ₹{(999 - subtotal).toFixed(0)} more to get FREE service charge!
                    </div>
                  )}
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span className="whitespace-nowrap">₹{total.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100">
                  <p className="text-sm font-medium text-[var(--color-accent)] mb-2">Service Benefits:</p>
                  <ul className="text-xs sm:text-sm text-gray-700 space-y-1">
                    <li>• 100% Secure Payment</li>
                    <li>• Trained Professionals</li>
                    <li>• Quality Guaranteed</li>
                    <li>• Customer Support</li>
                    {subtotal >= 999 && <li>• FREE Service Charge</li>}
                  </ul>
                </div>

                {/* Mobile-only Quick Action */}
                <div className="mt-4 lg:hidden">
                  <button
                    type="button"
                    onClick={handleBookingSubmit}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || cartItems.length === 0}
                  >
                    {loading ? "Placing Order..." : `Complete Booking - ₹${total.toFixed(0)}`}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Booking;