import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../config/firebaseConfig.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";

const Overview = () => {
  const [packages, setPackages] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [editingItem, setEditingItem] = useState(null);
  const [editType, setEditType] = useState(""); // "package" or "service"
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null); // For main item image
  const [packageItemImageFiles, setPackageItemImageFiles] = useState({}); // For images of items within a package
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Categories
      const categoriesSnapshot = await getDocs(collection(db, "categories"));
      const categoriesMap = {};
      categoriesSnapshot.forEach((doc) => {
        categoriesMap[doc.id] = doc.data().name;
      });

      // Packages
      const pkgSnapshot = await getDocs(collection(db, "packages"));
      const pkgList = pkgSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Services
      const serviceSnapshot = await getDocs(collection(db, "services"));
      const serviceList = serviceSnapshot.docs.map((doc) => {
        const serviceData = doc.data();
        return {
          id: doc.id,
          ...serviceData,
          categoryName: categoriesMap[serviceData.categoryId] || "Uncategorized",
        };
      });

      setPackages(pkgList);
      setServices(serviceList);
      setCategories(categoriesMap);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Upload image to Firebase Storage and return URL
  const uploadImage = async (file) => {
    if (!file) return null;
    const fileRef = ref(storage, `images/${Date.now()}-${file.name}`);
    const uploadTask = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(uploadTask.ref);
    return downloadURL;
  };

  // Delete package
  const handleDeletePackage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      await deleteDoc(doc(db, "packages", id));
      setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
      toast.success("Package deleted successfully!");
    } catch (err) {
      console.error("Error deleting package:", err);
      toast.error("Failed to delete package.");
    }
  };

  // Delete service
  const handleDeleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteDoc(doc(db, "services", id));
      setServices((prev) => prev.filter((srv) => srv.id !== id));
      toast.success("Service deleted successfully!");
    } catch (err) {
      console.error("Error deleting service:", err);
      toast.error("Failed to delete service.");
    }
  };

  // Start editing
  const handleEdit = (item, type) => {
    setEditingItem(item);
    setEditType(type);
    setImageFile(null); // Reset main image file on new edit session
    setPackageItemImageFiles({}); // Reset package item image files

    if (type === "package") {
      setFormData({
        name: item.name || "",
        price: item.price || "",
        description: item.description || "",
        items: item.items || [],
        imageUrl: item.imageUrl || "",
      });
    } else {
      setFormData({
        name: item.name || "",
        price: item.price || "",
        description: item.description || "",
        categoryId: item.categoryId || "",
        imageUrl: item.imageUrl || "",
      });
    }
  };

  // Save changes
  const handleSaveEdit = async () => {
    try {
      if (!editingItem) return;

      setIsUploading(true);

      let updatedImageUrl = formData.imageUrl;
      if (imageFile) {
        updatedImageUrl = await uploadImage(imageFile);
      }

      let updatedData = {
        ...formData,
        price: Number(formData.price),
        imageUrl: updatedImageUrl,
      };

      // Handle image uploads for package items if applicable
      if (editType === "package" && Object.keys(packageItemImageFiles).length > 0) {
        const updatedItems = [...formData.items];
        for (const index in packageItemImageFiles) {
          const file = packageItemImageFiles[index];
          const newImageUrl = await uploadImage(file);
          updatedItems[index] = { ...updatedItems[index], imageUrl: newImageUrl };
        }
        updatedData.items = updatedItems;
      }
      
      const docRef = doc(
        db,
        editType === "package" ? "packages" : "services",
        editingItem.id
      );

      await updateDoc(docRef, updatedData);
      
      toast.success("Changes saved successfully!");
      fetchData(); // Refresh data from Firestore
      setEditingItem(null);
      setEditType("");
    } catch (err) {
      console.error("Error updating:", err);
      toast.error("Failed to save changes.");
    } finally {
      setIsUploading(false);
      setImageFile(null);
      setPackageItemImageFiles({});
    }
  };

  // Update a package item
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFormData({ ...formData, items: updatedItems });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleAddItem = () => {
    const newItem = { name: "", price: 0, imageUrl: "" };
    setFormData({ ...formData, items: [...formData.items, newItem] });
  };

  // Handle main image file change
  const handleMainFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Handle package item image file change
  const handlePackageItemFileChange = (index, e) => {
    if (e.target.files[0]) {
      setPackageItemImageFiles({ ...packageItemImageFiles, [index]: e.target.files[0] });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-600 animate-pulse">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* ================= PACKAGES ================= */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            📦 All Packages
          </h2>

          {packages.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                        Package
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                        Items
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {packages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-4">
                          <img
                            src={pkg.imageUrl}
                            alt={pkg.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <span className="font-medium text-gray-900">
                            {pkg.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-800 font-medium">
                          ₹{pkg.price}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {pkg.itemsCount || pkg.items?.length || 0} items
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(pkg, "package")}
                              className="px-3 py-1.5 text-sm bg-blue-700 text-white rounded hover:bg-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePackage(pkg.id)}
                              className="px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={pkg.imageUrl}
                        alt={pkg.name}
                        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {pkg.name}
                        </h3>
                        <p className="text-lg font-medium text-gray-800">
                          ₹{pkg.price}
                        </p>
                        <p className="text-sm text-gray-600">
                          {pkg.itemsCount || pkg.items?.length || 0} items
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(pkg, "package")}
                        className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 text-center"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="flex-1 px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 text-center"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">No packages added yet.</p>
            </div>
          )}
        </div>

        {/* ================= SERVICES ================= */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            💇 All Services
          </h2>

          {services.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                        Price
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {services.map((srv) => (
                      <tr key={srv.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-4">
                          <img
                            src={srv.imageUrl}
                            alt={srv.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <span className="font-medium text-gray-900">
                            {srv.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {srv.categoryName}
                        </td>
                        <td className="px-6 py-4 text-gray-800 font-medium">
                          ₹{srv.price}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(srv, "service")}
                              className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteService(srv.id)}
                              className="px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {services.map((srv) => (
                  <div key={srv.id} className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={srv.imageUrl}
                        alt={srv.name}
                        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {srv.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {srv.categoryName}
                        </p>
                        <p className="text-lg font-medium text-gray-800">
                          ₹{srv.price}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(srv, "service")}
                        className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 text-center"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(srv.id)}
                        className="flex-1 px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 text-center"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">No services added yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* ================= IMPROVED EDIT MODAL ================= */}
      {editingItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {editType === "package" ? "📦" : "💇"}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Edit {editType === "package" ? "Package" : "Service"}
                    </h3>
                    <p className="text-sm text-gray-600">{editingItem.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingItem(null)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                {/* Basic Information Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                      ℹ
                    </span>
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.name || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        value={formData.price || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter price"
                      />
                    </div>
                  </div>

                  {/* Image Upload for main item */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Image
                    </label>
                    <input
                      type="file"
                      onChange={handleMainFileChange}
                      className="w-full border border-gray-300 rounded-lg"
                    />
                    {formData.imageUrl && !imageFile && (
                      <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                        <img
                          src={formData.imageUrl}
                          alt="Current"
                          className="w-10 h-10 object-cover rounded"
                        />
                        <p>Current image (select a new file to change)</p>
                      </div>
                    )}
                    {imageFile && (
                      <div className="mt-2 text-sm text-gray-500">
                        <p>New image selected: {imageFile.name}</p>
                      </div>
                    )}
                  </div>

                  {/* Service Category Selection */}
                  {editType === "service" && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.categoryId || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, categoryId: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select Category</option>
                        {Object.entries(categories).map(([id, name]) => (
                          <option key={id} value={id}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Package Description */}
                  {editType === "package" && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                        placeholder="Enter package description"
                      />
                    </div>
                  )}
                </div>

                {/* Package Items Section */}
                {editType === "package" && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                          📋
                        </span>
                        Package Items ({formData.items?.length || 0})
                      </h4>
                      <button
                        onClick={handleAddItem}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        <span>+</span> Add Item
                      </button>
                    </div>

                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {formData.items && formData.items.length > 0 ? (
                        formData.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white border border-gray-200 rounded-lg p-4 relative"
                          >
                            <div className="absolute top-2 right-2">
                              <button
                                onClick={() => handleRemoveItem(idx)}
                                className="w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center text-xs transition-colors"
                                title="Remove item"
                              >
                                ✕
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Item Name
                                </label>
                                <input
                                  type="text"
                                  value={item.name || ""}
                                  onChange={(e) =>
                                    handleItemChange(idx, "name", e.target.value)
                                  }
                                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  placeholder="Item name"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Price (₹)
                                </label>
                                <input
                                  type="number"
                                  value={item.price || ""}
                                  onChange={(e) =>
                                    handleItemChange(idx, "price", e.target.value)
                                  }
                                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  placeholder="0"
                                />
                              </div>
                            </div>
                            <div className="mt-3">
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Item Image
                              </label>
                              <input
                                type="file"
                                onChange={(e) => handlePackageItemFileChange(idx, e)}
                                className="w-full border border-gray-200 rounded-md"
                              />
                                {item.imageUrl && !packageItemImageFiles[idx] && (
                                  <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                                    <img
                                      src={item.imageUrl}
                                      alt="Current"
                                      className="w-10 h-10 object-cover rounded"
                                    />
                                    <p>Current image</p>
                                  </div>
                                )}
                                {packageItemImageFiles[idx] && (
                                  <div className="mt-2 text-sm text-gray-500">
                                    <p>New image selected: {packageItemImageFiles[idx].name}</p>
                                  </div>
                                )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            📦
                          </div>
                          <p className="text-sm">No items in this package yet</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Click "Add Item" to get started
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setEditingItem(null)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
