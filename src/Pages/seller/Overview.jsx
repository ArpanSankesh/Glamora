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
      toast.error("Could not fetch data.");
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
    setImageFile(null);
    setPackageItemImageFiles({});

    if (type === "package") {
      setFormData({
        name: item.name || "",
        price: item.price || "",
        time: item.time || "",
        description: item.description || "",
        items: item.items || [],
        imageUrl: item.imageUrl || "",
      });
    } else {
      setFormData({
        name: item.name || "",
        price: item.price || "",
        time: item.time || "",
        description: item.description || "",
        categoryId: item.categoryId || "",
        imageUrl: item.imageUrl || "",
      });
    }
  };

  // Save changes
  const handleSaveEdit = async () => {
    if (!editingItem) return;
    setIsUploading(true);
    try {
      let updatedImageUrl = formData.imageUrl;
      if (imageFile) {
        updatedImageUrl = await uploadImage(imageFile);
      }

      const updatedData = {
        ...formData,
        price: Number(formData.price),
        time: Number(formData.time || 0),
        imageUrl: updatedImageUrl,
      };

      if (editType === "package") {
        // Asynchronously process all package items, including potential image uploads
        const updatedItems = await Promise.all(
          formData.items.map(async (item, index) => {
            let itemImageUrl = item.imageUrl;
            const file = packageItemImageFiles[index];
            
            if (file) {
              itemImageUrl = await uploadImage(file);
            }
            
            // Return the updated item object with correct data types
            return {
              ...item,
              price: Number(item.price || 0),
              time: Number(item.time || 0), // Ensures the time is saved as a number
              imageUrl: itemImageUrl,
            };
          })
        );
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

  // Updates a single item's field (like time) in the form state
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
    const newItem = { name: "", price: 0, time: 0, imageUrl: "" };
    setFormData({ ...formData, items: [...(formData.items || []), newItem] });
  };
  
  const handleMainFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handlePackageItemFileChange = (index, e) => {
    if (e.target.files[0]) {
      setPackageItemImageFiles({ ...packageItemImageFiles, [index]: e.target.files[0] });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 animate-pulse text-lg">Loading data...</p>
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
                        Duration
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
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {pkg.time || 0} min
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {pkg.items?.length || 0} items
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
                          {pkg.time || 0} min • {pkg.items?.length || 0} items
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                        Duration
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
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {srv.time || 0} min
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
                        <p className="text-sm text-gray-600 mt-1">
                          Duration: {srv.time || 0} min
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
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  Edit {editType === "package" ? "Package" : "Service"}
                </h3>
                <button
                  onClick={() => setEditingItem(null)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
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
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (min)
                      </label>
                      <input
                        type="number"
                        value={formData.time || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, time: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Image
                    </label>
                    <input
                      type="file"
                      onChange={handleMainFileChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formData.imageUrl && !imageFile && (
                      <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                        <img
                          src={formData.imageUrl}
                          alt="Current"
                          className="w-10 h-10 object-cover rounded"
                        />
                        <p>Current image</p>
                      </div>
                    )}
                  </div>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description || ""}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter a description..."
                      />
                  </div>
                </div>

                {/* Package Items Section */}
                {editType === "package" && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-800">
                        Package Items ({formData.items?.length || 0})
                      </h4>
                      <button
                        onClick={handleAddItem}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium"
                      >
                        + Add Item
                      </button>
                    </div>

                    <div className="space-y-4 max-h-64 overflow-y-auto p-1">
                      {formData.items && formData.items.length > 0 ? (
                        formData.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white border border-gray-200 rounded-lg p-4 relative"
                          >
                            <button
                              onClick={() => handleRemoveItem(idx)}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center text-xs"
                              title="Remove item"
                            >
                              ✕
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-8">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Item Name
                                </label>
                                <input
                                  type="text"
                                  value={item.name || ""}
                                  onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
                                  placeholder="Service name"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Price (₹)
                                </label>
                                <input
                                  type="number"
                                  value={item.price || ""}
                                  onChange={(e) => handleItemChange(idx, "price", e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
                                  placeholder="0"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Time (min)
                                </label>
                                <input
                                  type="number"
                                  value={item.time || ""}
                                  onChange={(e) => handleItemChange(idx, "time", e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm"
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
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>No items in this package yet.</p>
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
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center ${isUploading ? 'cursor-not-allowed' : ''}`}
                disabled={isUploading}
              >
                {isUploading ? "Saving..." : "💾 Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;