import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../config/firebaseConfig.js';

const AddCategory = () => {
    // Form states
    const [categoryName, setCategoryName] = useState('');
    const [categoryImage, setCategoryImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    
    // List states
    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    
    // Edit states
    const [editingCategory, setEditingCategory] = useState(null);
    const [editName, setEditName] = useState('');
    const [editImage, setEditImage] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoadingCategories(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'categories'));
            const categoriesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setMessage('Error loading categories.');
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const handleImageChange = (e) => {
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

            setCategoryImage(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
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

    const removeImage = () => {
        setCategoryImage(null);
        setImagePreview(null);
    };

    const uploadImage = async (file) => {
        const timestamp = Date.now();
        const imageRef = ref(storage, `categories/${timestamp}_${file.name}`);
        
        try {
            const snapshot = await uploadBytes(imageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Failed to upload image');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!categoryName.trim()) {
            setMessage('Please enter a category name.');
            return;
        }
        
        if (!categoryImage) {
            setMessage('Please select an image for the category.');
            return;
        }

        setIsLoading(true);
        setMessage('Adding category...');

        try {
            // Upload image first
            const imageUrl = await uploadImage(categoryImage);
            
            // Add category to Firestore with image URL
            await addDoc(collection(db, 'categories'), {
                name: categoryName.trim(),
                imageUrl: imageUrl,
                createdAt: serverTimestamp()
            });
            
            // Reset form
            setCategoryName('');
            setCategoryImage(null);
            setImagePreview(null);
            setMessage('Category added successfully!');
            
            // Refresh categories list
            fetchCategories();
            
        } catch (error) {
            console.error("Error adding category: ", error);
            setMessage('Failed to add category. Please try again.');
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleDelete = async (categoryId, imageUrl) => {
        if (!window.confirm('Are you sure you want to delete this category?')) {
            return;
        }

        try {
            // Delete from Firestore
            await deleteDoc(doc(db, 'categories', categoryId));
            
            // Delete image from storage if it exists
            if (imageUrl && !imageUrl.includes('data:image')) {
                try {
                    const imageRef = ref(storage, imageUrl);
                    await deleteObject(imageRef);
                } catch (error) {
                    console.log('Error deleting image from storage:', error);
                }
            }
            
            setMessage('Category deleted successfully!');
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            setMessage('Failed to delete category.');
        }
        
        setTimeout(() => setMessage(''), 3000);
    };

    const startEdit = (category) => {
        setEditingCategory(category.id);
        setEditName(category.name);
        setEditImagePreview(category.imageUrl);
        setEditImage(null);
    };

    const cancelEdit = () => {
        setEditingCategory(null);
        setEditName('');
        setEditImage(null);
        setEditImagePreview(null);
    };

    const handleUpdate = async (categoryId, currentImageUrl) => {
        if (!editName.trim()) {
            setMessage('Please enter a category name.');
            return;
        }

        setIsUpdating(true);
        setMessage('Updating category...');

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

            // Update category in Firestore
            await updateDoc(doc(db, 'categories', categoryId), {
                name: editName.trim(),
                imageUrl: imageUrl,
                updatedAt: serverTimestamp()
            });

            setMessage('Category updated successfully!');
            cancelEdit();
            fetchCategories();
            
        } catch (error) {
            console.error('Error updating category:', error);
            setMessage('Failed to update category.');
        } finally {
            setIsUpdating(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <div className="py-10 px-4 max-w-6xl mx-auto">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add Category Form */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Add New Category</h2>
                    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-lg">
                        
                        {/* Category Name Input */}
                        <div className="flex flex-col gap-2 mb-4">
                            <label className="text-base font-medium" htmlFor="category-name">
                                Category Name *
                            </label>
                            <input 
                                id="category-name"
                                type="text"
                                placeholder="e.g., Hair Care"
                                className="outline-none py-2 px-3 rounded border border-gray-400 focus:border-blue-500"
                                required
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                            />
                        </div>

                        {/* Image Upload Section */}
                        <div className="flex flex-col gap-2 mb-4">
                            <label className="text-base font-medium" htmlFor="category-image">
                                Category Image *
                            </label>
                            
                            {!imagePreview ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                    <input
                                        id="category-image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        required
                                    />
                                    <label htmlFor="category-image" className="cursor-pointer">
                                        <div className="flex flex-col items-center gap-2">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <span className="text-sm text-gray-500">Click to upload image</span>
                                            <span className="text-xs text-gray-400">PNG, JPG up to 5MB</span>
                                        </div>
                                    </label>
                                </div>
                            ) : (
                                <div className="relative">
                                    <img 
                                        src={imagePreview} 
                                        alt="Category preview" 
                                        className="w-full h-32 object-cover rounded-lg border"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-8 py-2.5 bg-[var(--color-secondary)] text-white font-medium rounded disabled:bg-gray-400 hover:bg-opacity-90 transition-colors"
                        >
                            {isLoading ? 'ADDING...' : 'ADD CATEGORY'}
                        </button>
                    </form>
                </div>

                {/* Categories List */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">All Categories ({categories.length})</h2>
                    
                    {isLoadingCategories ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="bg-white shadow-md rounded-lg max-h-96 overflow-y-auto">
                            {categories.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No categories found.</p>
                            ) : (
                                categories.map((category) => (
                                    <div key={category.id} className="p-4 border-b border-gray-200 last:border-b-0">
                                        {editingCategory === category.id ? (
                                            // Edit Mode
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 outline-none"
                                                />
                                                
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={editImagePreview || category.imageUrl}
                                                        alt={category.name}
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
                                                        onClick={() => handleUpdate(category.id, category.imageUrl)}
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
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={category.imageUrl}
                                                        alt={category.name}
                                                        className="w-16 h-16 object-cover rounded"
                                                        onError={(e) => {
                                                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='%23d1d5db' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21,15 16,10 5,21'/%3E%3C/svg%3E";
                                                        }}
                                                    />
                                                    <div>
                                                        <h3 className="font-medium text-lg">{category.name}</h3>
                                                        <p className="text-sm text-gray-500">
                                                            Created: {category.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => startEdit(category)}
                                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(category.id, category.imageUrl)}
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
                <p className={`text-center text-sm mt-6 ${
                    message.includes('successfully') ? 'text-green-600' : 
                    message.includes('Failed') || message.includes('Error') || message.includes('Please') ? 'text-red-600' : 
                    'text-blue-600'
                }`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default AddCategory;