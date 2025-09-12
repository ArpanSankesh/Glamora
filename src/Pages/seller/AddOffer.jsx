import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../../config/firebaseConfig.js";

const EMPTY_PREVIEW =
  "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png";

const AddOffer = () => {
  // Form states
  const [offerName, setOfferName] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [minOrderValue, setMinOrderValue] = useState(""); // New field
  const [maxDiscount, setMaxDiscount] = useState(""); // Optional max discount cap
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(EMPTY_PREVIEW);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // List states
  const [offers, setOffers] = useState([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);

  // Edit states
  const [editingOffer, setEditingOffer] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDiscount, setEditDiscount] = useState("");
  const [editValidUntil, setEditValidUntil] = useState("");
  const [editCouponCode, setEditCouponCode] = useState("");
  const [editMinOrderValue, setEditMinOrderValue] = useState(""); // New edit field
  const [editMaxDiscount, setEditMaxDiscount] = useState(""); // New edit field
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch offers on component mount
  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setIsLoadingOffers(true);
    try {
      console.log("Fetching offers from Firestore...");
      const querySnapshot = await getDocs(collection(db, "offers"));
      console.log("Query snapshot size:", querySnapshot.size);
      
      const offersData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("Offer data:", { id: doc.id, ...data });
        return {
          id: doc.id,
          ...data,
        };
      });
      
      console.log("Total offers fetched:", offersData.length);
      setOffers(offersData);
    } catch (error) {
      console.error("Error fetching offers:", error);
      setMessage("Error loading offers: " + error.message);
    } finally {
      setIsLoadingOffers(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select a valid image file.');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Image size should be less than 5MB.');
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setMessage('');
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select a valid image file.');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Image size should be less than 5MB.');
        return;
      }

      setEditImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setMessage('');
    }
  };

  const uploadImage = async (file) => {
    const timestamp = Date.now();
    const imageRef = ref(storage, `offers/${timestamp}_${file.name}`);
    
    try {
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  const resetForm = () => {
    setOfferName("");
    setDescription("");
    setDiscount("");
    setValidUntil("");
    setCouponCode("");
    setMinOrderValue("");
    setMaxDiscount("");
    setImageFile(null);
    setImagePreview(EMPTY_PREVIEW);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offerName || !discount || !validUntil || !imageFile) {
      setMessage("Please fill out all required fields.");
      return;
    }

    // Validate min order value and max discount if provided
    if (minOrderValue && isNaN(Number(minOrderValue))) {
      setMessage("Please enter a valid minimum order value.");
      return;
    }

    if (maxDiscount && isNaN(Number(maxDiscount))) {
      setMessage("Please enter a valid maximum discount amount.");
      return;
    }

    setIsLoading(true);
    setMessage("Adding offer...");

    try {
      // Upload image
      const imageUrl = await uploadImage(imageFile);

      // Prepare offer data
      const offerData = {
        name: offerName.trim(),
        description: description.trim(),
        discount: Number(discount),
        validUntil,
        couponCode: couponCode.trim() || "", // Make couponCode optional with fallback
        imageUrl,
        createdAt: serverTimestamp(),
      };

      // Add optional fields if they have values
      if (minOrderValue && minOrderValue.trim() !== "") {
        offerData.minOrderValue = Number(minOrderValue);
      }

      if (maxDiscount && maxDiscount.trim() !== "") {
        offerData.maxDiscount = Number(maxDiscount);
      }

      // Save offer
      await addDoc(collection(db, "offers"), offerData);

      setMessage("Offer added successfully!");
      resetForm();
      fetchOffers(); // Refresh offers list
    } catch (error) {
      console.error("Error adding offer:", error);
      setMessage("Failed to add offer. Please try again.");
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (offerId, imageUrl) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) {
      return;
    }

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'offers', offerId));
      
      // Delete image from storage if it exists
      if (imageUrl && !imageUrl.includes('data:image')) {
        try {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        } catch (error) {
          console.log('Error deleting image from storage:', error);
        }
      }
      
      setMessage('Offer deleted successfully!');
      fetchOffers();
    } catch (error) {
      console.error('Error deleting offer:', error);
      setMessage('Failed to delete offer.');
    }
    
    setTimeout(() => setMessage(''), 3000);
  };

  const startEdit = (offer) => {
    setEditingOffer(offer.id);
    setEditName(offer.name);
    setEditDescription(offer.description || "");
    setEditDiscount(offer.discount);
    setEditValidUntil(offer.validUntil);
    setEditCouponCode(offer.couponCode || ""); // Handle missing couponCode
    setEditMinOrderValue(offer.minOrderValue || ""); // Handle missing minOrderValue
    setEditMaxDiscount(offer.maxDiscount || ""); // Handle missing maxDiscount
    setEditImagePreview(offer.imageUrl);
    setEditImage(null);
  };

  const cancelEdit = () => {
    setEditingOffer(null);
    setEditName('');
    setEditDescription('');
    setEditDiscount('');
    setEditValidUntil('');
    setEditCouponCode('');
    setEditMinOrderValue('');
    setEditMaxDiscount('');
    setEditImage(null);
    setEditImagePreview(null);
  };

  const handleUpdate = async (offerId, currentImageUrl) => {
    if (!editName.trim() || !editDiscount || !editValidUntil) {
      setMessage('Please fill out all required fields.');
      return;
    }

    // Validate min order value and max discount if provided
    if (editMinOrderValue && isNaN(Number(editMinOrderValue))) {
      setMessage("Please enter a valid minimum order value.");
      return;
    }

    if (editMaxDiscount && isNaN(Number(editMaxDiscount))) {
      setMessage("Please enter a valid maximum discount amount.");
      return;
    }

    setIsUpdating(true);
    setMessage('Updating offer...');

    try {
      let imageUrl = currentImageUrl;
      
      // If new image selected, upload it
      if (editImage) {
        imageUrl = await uploadImage(editImage);
        
        // Delete old image from storage
        if (currentImageUrl && !currentImageUrl.includes('data:image')) {
          try {
            const oldImageRef = ref(storage, currentImageUrl);
            await deleteObject(oldImageRef);
          } catch (error) {
            console.log('Error deleting old image:', error);
          }
        }
      }

      // Prepare update data
      const updateData = {
        name: editName.trim(),
        description: editDescription.trim(),
        discount: Number(editDiscount),
        validUntil: editValidUntil,
        couponCode: editCouponCode.trim() || "", // Make couponCode optional
        imageUrl: imageUrl,
        updatedAt: serverTimestamp()
      };

      // Add optional fields if they have values
      if (editMinOrderValue && editMinOrderValue.trim() !== "") {
        updateData.minOrderValue = Number(editMinOrderValue);
      }

      if (editMaxDiscount && editMaxDiscount.trim() !== "") {
        updateData.maxDiscount = Number(editMaxDiscount);
      }

      // Update offer in Firestore
      await updateDoc(doc(db, 'offers', offerId), updateData);

      setMessage('Offer updated successfully!');
      cancelEdit();
      fetchOffers();
      
    } catch (error) {
      console.error('Error updating offer:', error);
      setMessage('Failed to update offer.');
    } finally {
      setIsUpdating(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="py-4 px-3 max-w-7xl mx-auto min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Add Offer Form */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Add Offer</h2>
          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-6 md:p-10 space-y-4 sm:space-y-6 bg-white shadow-md rounded-lg"
          >
            {/* Offer Image */}
            <div>
              <p className="text-sm sm:text-base font-medium mb-2">Offer Image</p>
              <label htmlFor="offer-image" className="inline-block cursor-pointer">
                <input
                  id="offer-image"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
                <img
                  src={imagePreview}
                  alt="offer"
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover rounded border border-gray-300"
                />
              </label>
            </div>

            {/* Offer Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm sm:text-base font-medium">Offer Name</label>
              <input
                type="text"
                className="p-3 sm:p-2 border border-gray-300 rounded w-full focus:border-gray-400 focus:outline-none text-base"
                value={offerName}
                onChange={(e) => setOfferName(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-sm sm:text-base font-medium">Description</label>
              <textarea
                rows={3}
                className="p-3 sm:p-2 border border-gray-300 rounded w-full resize-none focus:border-gray-400 focus:outline-none text-base"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details about this offer"
              />
            </div>

            {/* Discount, Valid Until & Coupon Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm sm:text-base font-medium">Discount (%)</label>
                <input
                  type="number"
                  className="p-3 sm:p-2 border border-gray-300 rounded w-full focus:border-gray-400 focus:outline-none text-base"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm sm:text-base font-medium">Valid Until</label>
                <input
                  type="date"
                  className="p-3 sm:p-2 border border-gray-300 rounded w-full focus:border-gray-400 focus:outline-none text-base"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm sm:text-base font-medium">Coupon Code</label>
                <input
                  type="text"
                  className="p-3 sm:p-2 border border-gray-300 rounded w-full focus:border-gray-400 focus:outline-none text-base uppercase"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="SAVE20"
                  required
                />
              </div>
            </div>

            {/* NEW: Minimum Order Value and Maximum Discount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm sm:text-base font-medium">
                  Minimum Order Value (₹)
                  <span className="text-gray-500 font-normal"> - Optional</span>
                </label>
                <input
                  type="number"
                  className="p-3 sm:p-2 border border-gray-300 rounded w-full focus:border-gray-400 focus:outline-none text-base"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(e.target.value)}
                  placeholder="999"
                />
                <p className="text-xs text-gray-500">Leave empty for no minimum order requirement</p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm sm:text-base font-medium">
                  Maximum Discount (₹)
                  <span className="text-gray-500 font-normal"> - Optional</span>
                </label>
                <input
                  type="number"
                  className="p-3 sm:p-2 border border-gray-300 rounded w-full focus:border-gray-400 focus:outline-none text-base"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  placeholder="500"
                />
                <p className="text-xs text-gray-500">Cap the maximum discount amount</p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 sm:py-2.5 bg-[var(--color-secondary)] text-white font-medium text-base sm:text-sm rounded disabled:bg-gray-400 hover:bg-[var(--color-accent)] transition-colors"
            >
              {isLoading ? "ADDING..." : "ADD OFFER"}
            </button>
          </form>
        </div>

        {/* Offers List */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">All Offers ({offers.length})</h2>
          
          {isLoadingOffers ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="ml-2">Loading offers...</p>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg max-h-[600px] overflow-y-auto">
              {offers.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No offers found.</p>
                  <p className="text-sm mt-2">Try adding an offer using the form on the left.</p>
                </div>
              ) : (
                offers.map((offer) => (
                  <div key={offer.id} className="p-4 border-b border-gray-200 last:border-b-0">
                    {editingOffer === offer.id ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 outline-none"
                          placeholder="Offer name"
                        />
                        
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 outline-none resize-none"
                          rows={2}
                          placeholder="Description"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="number"
                            value={editDiscount}
                            onChange={(e) => setEditDiscount(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded focus:border-blue-500 outline-none"
                            placeholder="Discount %"
                          />
                          <input
                            type="date"
                            value={editValidUntil}
                            onChange={(e) => setEditValidUntil(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded focus:border-blue-500 outline-none"
                          />
                          <input
                            type="text"
                            value={editCouponCode}
                            onChange={(e) => setEditCouponCode(e.target.value.toUpperCase())}
                            className="px-3 py-2 border border-gray-300 rounded focus:border-blue-500 outline-none uppercase"
                            placeholder="Coupon code"
                          />
                        </div>

                        {/* NEW: Edit Min Order Value and Max Discount */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="number"
                            value={editMinOrderValue}
                            onChange={(e) => setEditMinOrderValue(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded focus:border-blue-500 outline-none"
                            placeholder="Min order value (₹)"
                          />
                          <input
                            type="number"
                            value={editMaxDiscount}
                            onChange={(e) => setEditMaxDiscount(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded focus:border-blue-500 outline-none"
                            placeholder="Max discount (₹)"
                          />
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <img
                            src={editImagePreview || offer.imageUrl}
                            alt={offer.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleEditImageChange}
                              className="text-sm border-1 p-2 rounded-xl"
                            />
                            <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(offer.id, offer.imageUrl)}
                            disabled={isUpdating}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 text-sm"
                          >
                            {isUpdating ? 'Updating...' : 'Save'}
                          </button>
                          <button
                            onClick={cancelEdit}
                            disabled={isUpdating}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <img
                            src={offer.imageUrl}
                            alt={offer.name}
                            className="w-20 h-20 object-cover rounded"
                            onError={(e) => {
                              e.target.src = EMPTY_PREVIEW;
                            }}
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{offer.name}</h3>
                            {offer.description && (
                              <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
                            )}
                            <div className="flex flex-wrap gap-4 mt-2 text-sm">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                {offer.discount}% OFF
                              </span>
                              {offer.couponCode && (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">
                                  {offer.couponCode}
                                </span>
                              )}
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                Until: {
                                  offer.validUntil 
                                    ? new Date(offer.validUntil + 'T00:00:00').toLocaleDateString()
                                    : 'No expiry'
                                }
                              </span>
                            </div>
                            
                            {/* NEW: Display Min Order Value and Max Discount */}
                            <div className="flex flex-wrap gap-4 mt-2 text-sm">
                              {offer.minOrderValue && (
                                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                  Min Order: ₹{offer.minOrderValue}
                                </span>
                              )}
                              {offer.maxDiscount && (
                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                  Max Discount: ₹{offer.maxDiscount}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-gray-500 mt-2">
                              Created: {
                                offer.createdAt && typeof offer.createdAt.toDate === 'function' 
                                  ? offer.createdAt.toDate().toLocaleDateString() 
                                  : offer.createdAt && offer.createdAt.seconds 
                                    ? new Date(offer.createdAt.seconds * 1000).toLocaleDateString()
                                    : 'Unknown'
                              }
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => startEdit(offer)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(offer.id, offer.imageUrl)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <p
          className={`text-center text-sm mt-6 ${
            message.includes("successfully")
              ? "text-green-600"
              : message.includes("Failed") || message.includes("required") || message.includes("Error")
              ? "text-red-600"
              : "text-[var(--color-secondary)]"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default AddOffer;