import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../config/firebaseConfig.js";

const EMPTY_PREVIEW =
  "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png";

const AddPackage = () => {
  // Package fields
  const [packageName, setPackageName] = useState("");
  const [description, setDescription] = useState("");
  const [packagePrice, setPackagePrice] = useState("");
  const [pkgImageFile, setPkgImageFile] = useState(null);
  const [pkgImagePreview, setPkgImagePreview] = useState(EMPTY_PREVIEW);
  const [maxServices, setMaxServices] = useState(4); // NEW field

  // Services inside the package
  const [items, setItems] = useState([
    { name: "", price: "", imageFile: null, preview: EMPTY_PREVIEW },
  ]);

  // UI
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePkgImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPkgImageFile(file);
      setPkgImagePreview(URL.createObjectURL(file));
    }
  };

  const addItem = () =>
    setItems((prev) => [
      ...prev,
      { name: "", price: "", imageFile: null, preview: EMPTY_PREVIEW },
    ]);

  const removeItem = (idx) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  const updateItemField = (idx, field, value) =>
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it))
    );

  const handleItemImage = (idx, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setItems((prev) =>
      prev.map((it, i) =>
        i === idx
          ? { ...it, imageFile: file, preview: URL.createObjectURL(file) }
          : it
      )
    );
  };

  const resetForm = () => {
    setPackageName("");
    setDescription("");
    setPackagePrice("");
    setPkgImageFile(null);
    setPkgImagePreview(EMPTY_PREVIEW);
    setMaxServices(4);
    setItems([{ name: "", price: "", imageFile: null, preview: EMPTY_PREVIEW }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!packageName || !packagePrice || !pkgImageFile) {
      setMessage("Package name, price, and image are required.");
      return;
    }
    if (!maxServices || maxServices < 1) {
      setMessage("Max selectable services must be at least 1.");
      return;
    }
    const invalidItem = items.find(
      (it) => !it.name || !it.price || !it.imageFile
    );
    if (invalidItem) {
      setMessage("Every service must have name, price, and image.");
      return;
    }

    setIsLoading(true);
    setMessage("Adding package...");

    try {
      // Upload package image
      const pkgRef = ref(storage, `packages/${pkgImageFile.name}-${Date.now()}`);
      await uploadBytes(pkgRef, pkgImageFile);
      const packageImageUrl = await getDownloadURL(pkgRef);

      // Upload each service image
      const folderStamp = Date.now();
      const uploadedItems = [];
      for (let i = 0; i < items.length; i++) {
        const file = items[i].imageFile;
        const itemRef = ref(
          storage,
          `package-items/${packageName}-${folderStamp}/item-${i}-${file.name}`
        );
        await uploadBytes(itemRef, file);
        const url = await getDownloadURL(itemRef);
        uploadedItems.push({
          name: items[i].name.trim(),
          price: Number(items[i].price),
          imageUrl: url,
        });
      }

      // Save to Firestore
      await addDoc(collection(db, "packages"), {
        name: packageName.trim(),
        description: description.trim(),
        price: Number(packagePrice),
        imageUrl: packageImageUrl,
        items: uploadedItems,
        itemsCount: uploadedItems.length,
        maxServices, // NEW
        createdAt: serverTimestamp(),
      });

      setMessage("Package added successfully!");
      resetForm();
    } catch (err) {
      console.error("Error adding package:", err);
      setMessage("Failed to add package. Please try again.");
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="py-4 px-3 flex flex-col items-center min-h-screen bg-gray-50">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
        Add Package
      </h2>
      <form
        onSubmit={handleSubmit}
        className="p-4 sm:p-6 md:p-10 space-y-4 sm:space-y-6 bg-white shadow-md rounded-lg w-full max-w-4xl"
      >
        {/* Package image */}
        <div>
          <p className="text-sm sm:text-base font-medium mb-2">Package Image</p>
          <label htmlFor="pkg-image" className="inline-block cursor-pointer">
            <input
              id="pkg-image"
              type="file"
              accept="image/*"
              hidden
              onChange={handlePkgImageChange}
            />
            <img
              src={pkgImagePreview}
              alt="package"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover rounded border border-gray-300"
            />
          </label>
        </div>

        {/* Name, Price, Max Services */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Package Name</label>
            <input
              type="text"
              className="p-2 border border-gray-300 rounded"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Package Price</label>
            <input
              type="number"
              className="p-2 border border-gray-300 rounded"
              value={packagePrice}
              onChange={(e) => setPackagePrice(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Max Selectable Services</label>
            <input
              type="number"
              min="1"
              className="p-2 border border-gray-300 rounded"
              value={maxServices}
              onChange={(e) => setMaxServices(Number(e.target.value))}
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Description</label>
          <textarea
            rows={3}
            className="p-2 border border-gray-300 rounded resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short details about this package"
          />
        </div>

        {/* Services */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-base">Services in this Package</h3>
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 rounded bg-gray-900 text-white text-sm hover:bg-gray-800"
            >
              + Add Service
            </button>
          </div>

          <div className="space-y-3">
            {items.map((it, idx) => (
              <div
                key={idx}
                className="flex flex-col p-4 border border-gray-300 rounded space-y-3"
              >
                <div className="flex justify-center">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => handleItemImage(idx, e)}
                    />
                    <img
                      src={it.preview}
                      alt="service"
                      className="w-16 h-16 object-cover rounded border border-gray-300"
                    />
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Service Name"
                    className="p-2 border border-gray-300 rounded flex-1"
                    value={it.name}
                    onChange={(e) => updateItemField(idx, "name", e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    className="p-2 border border-gray-300 rounded flex-1"
                    value={it.price}
                    onChange={(e) => updateItemField(idx, "price", e.target.value)}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                  disabled={items.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[var(--color-secondary)] text-white font-medium rounded disabled:bg-gray-400 hover:bg-[var(--color-accent)]"
        >
          {isLoading ? "ADDING..." : "ADD PACKAGE"}
        </button>

        {message && (
          <p
            className={`text-center text-sm mt-2 ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddPackage;
