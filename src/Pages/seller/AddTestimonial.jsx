import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../config/firebaseConfig.js";

const EMPTY_PREVIEW =
  "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png";

const AddTestimonial = () => {
  // State for form fields
  const [customerName, setCustomerName] = useState("");
  const [customerImage, setCustomerImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(EMPTY_PREVIEW);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [serviceUsed, setServiceUsed] = useState("");
  const [location, setLocation] = useState("");

  // UI feedback
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle image change
  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setCustomerImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Reset form
  const resetForm = () => {
    setCustomerName("");
    setCustomerImage(null);
    setImagePreview(EMPTY_PREVIEW);
    setReviewText("");
    setRating(5);
    setServiceUsed("");
    setLocation("");
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !reviewText || !rating) {
      setMessage("Please fill out all required fields.");
      return;
    }

    setIsLoading(true);
    setMessage("Adding testimonial...");

    try {
      let imageUrl = null;
      
      // Upload image if provided
      if (customerImage) {
        const imageRef = ref(storage, `testimonials/${customerImage.name}-${Date.now()}`);
        await uploadBytes(imageRef, customerImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Save testimonial
      await addDoc(collection(db, "testimonials"), {
        customerName: customerName.trim(),
        reviewText: reviewText.trim(),
        rating: Number(rating),
        serviceUsed: serviceUsed.trim(),
        location: location.trim(),
        customerImage: imageUrl,
        isActive: true, // For admin to control visibility
        source: "manual", // To distinguish from automated imports
        createdAt: serverTimestamp(),
      });

      setMessage("Testimonial added successfully!");
      resetForm();
    } catch (error) {
      console.error("Error adding testimonial:", error);
      setMessage("Failed to add testimonial. Please try again.");
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="py-4 px-3 flex flex-col items-center min-h-screen bg-gray-50">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Add Customer Testimonial</h2>
      <form
        onSubmit={handleSubmit}
        className="p-4 sm:p-6 md:p-10 space-y-4 sm:space-y-6 bg-white shadow-md rounded-lg w-full max-w-3xl"
      >
        {/* Customer Image */}
        <div>
          <p className="text-sm sm:text-base font-medium mb-2">Customer Photo (Optional)</p>
          <label htmlFor="customer-image" className="inline-block cursor-pointer">
            <input
              id="customer-image"
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
            <img
              src={imagePreview}
              alt="customer"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover rounded-full border-2 border-gray-300"
            />
          </label>
        </div>

        {/* Customer Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm sm:text-base font-medium">Customer Name *</label>
          <input
            type="text"
            className="p-3 sm:p-2 border border-gray-300 rounded w-full focus:border-gray-400 focus:outline-none text-base"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            placeholder="Enter customer's full name"
          />
        </div>

        {/* Review Text */}
        <div className="flex flex-col gap-1">
          <label className="text-sm sm:text-base font-medium">Review Text *</label>
          <textarea
            rows={4}
            className="p-3 sm:p-2 border border-gray-300 rounded w-full resize-none focus:border-gray-400 focus:outline-none text-base"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Enter the customer's review or testimonial"
            required
          />
        </div>

        {/* Rating & Service Used */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm sm:text-base font-medium">Rating *</label>
            <select
              className="p-3 sm:p-2 border border-gray-300 rounded w-full focus:border-gray-400 focus:outline-none text-base"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            >
              <option value={5}>5 Stars - Excellent</option>
              <option value={4}>4 Stars - Very Good</option>
              <option value={3}>3 Stars - Good</option>
              <option value={2}>2 Stars - Fair</option>
              <option value={1}>1 Star - Poor</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm sm:text-base font-medium">Service Used</label>
            <input
              type="text"
              className="p-3 sm:p-2 border border-gray-300 rounded w-full focus:border-gray-400 focus:outline-none text-base"
              value={serviceUsed}
              onChange={(e) => setServiceUsed(e.target.value)}
              placeholder="e.g. Hair Cut, Facial, etc."
            />
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1">
          <label className="text-sm sm:text-base font-medium">Customer Location</label>
          <input
            type="text"
            className="p-3 sm:p-2 border border-gray-300 rounded w-full focus:border-gray-400 focus:outline-none text-base"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. New York, NY"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 sm:py-2.5 bg-[var(--color-secondary)] text-white font-medium text-base sm:text-sm rounded disabled:bg-gray-400 hover:bg-[var(--color-accent)] transition-colors"
        >
          {isLoading ? "ADDING..." : "ADD TESTIMONIAL"}
        </button>

        {message && (
          <p
            className={`text-center text-sm mt-2 ${
              message.includes("successfully")
                ? "text-green-600"
                : message.includes("required") || message.includes("Failed")
                ? "text-red-600"
                : "text-[var(--color-secondary)]"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddTestimonial;