import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../config/firebaseConfig.js";

const EMPTY_PREVIEW =
  "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png";

const AddService = () => {
  // State for form fields
  const [serviceName, setServiceName] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [price, setPrice] = useState("");
  const [serviceTime, setServiceTime] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // State for image handling
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(EMPTY_PREVIEW);

  // Categories
  const [categories, setCategories] = useState([]);

  // UI feedback
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoriesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle image change
  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Reset form
  const resetForm = () => {
    setServiceName("");
    setServiceDesc("");
    setPrice("");
    setServiceTime("");
    setSelectedCategory("");
    setImageFile(null);
    setImagePreview(EMPTY_PREVIEW);
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serviceName || !price || !serviceTime || !selectedCategory || !imageFile) {
      setMessage("Please fill out all required fields and select an image.");
      return;
    }

    setIsLoading(true);
    setMessage("Adding service...");

    try {
      // Upload image
      const imageRef = ref(storage, `services/${imageFile.name}-${Date.now()}`);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      // Save service
      await addDoc(collection(db, "services"), {
        name: serviceName.trim(),
        description: serviceDesc.trim(),
        price: Number(price),
        time: serviceTime.trim(),
        categoryId: selectedCategory,
        imageUrl: imageUrl,
        createdAt: serverTimestamp(),
      });

      setMessage("Service added successfully!");
      resetForm();
    } catch (error) {
      console.error("Error adding service:", error);
      setMessage("Failed to add service. Please try again.");
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="py-4 px-3 flex flex-col items-center min-h-screen bg-gray-50">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Add Service</h2>
      <form
        onSubmit={handleSubmit}
        className="p-4 sm:p-6 md:p-10 space-y-4 sm:space-y-6 bg-white shadow-md rounded-lg w-full max-w-3xl"
      >
        {/* Service Image */}
        <div>
          <p className="text-sm sm:text-base font-medium mb-2">Service Image</p>
          <label htmlFor="service-image" className="inline-block cursor-pointer">
            <input
              id="service-image"
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
            <img
              src={imagePreview}
              alt="service"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover rounded border border-gray-300"
            />
          </label>
        </div>

        {/* Service Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm sm:text-base font-medium">Service Name</label>
          <input
            type="text"
            className="p-3 sm:p-2 border border-gray-300 rounded w-full focus:border-gray-400 focus:outline-none text-base"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            required
          />
        </div>

        {/* Service Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm sm:text-base font-medium">Service Description</label>
          <textarea
            rows={3}
            className="p-3 sm:p-2 border border-gray-300 rounded w-full resize-none focus:border-gray-400 focus:outline-none text-base"
            value={serviceDesc}
            onChange={(e) => setServiceDesc(e.target.value)}
            placeholder="Short details about this service"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-sm sm:text-base font-medium">Category</label>
          <select
            className="p-3 sm:p-2 border border-gray-300 rounded w-full focus:border-gray-400 focus:outline-none text-base"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price & Time side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm sm:text-base font-medium">Service Price</label>
            <input
              type="number"
              className="p-3 sm:p-2 border border-gray-300 rounded w-full focus:border-gray-400 focus:outline-none text-base"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm sm:text-base font-medium">Service Time</label>
            <input
              type="text"
              placeholder="e.g. 30 mins"
              className="p-3 sm:p-2 border border-gray-300 rounded w-full focus:border-gray-400 focus:outline-none text-base"
              value={serviceTime}
              onChange={(e) => setServiceTime(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 sm:py-2.5 bg-[var(--color-secondary)] text-white font-medium text-base sm:text-sm rounded disabled:bg-gray-400 hover:bg-[var(--color-accent)] transition-colors"
        >
          {isLoading ? "ADDING..." : "ADD SERVICE"}
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

export default AddService;
