import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, orderBy, query } from "firebase/firestore";
import { db } from "../../config/firebaseConfig.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faEye, faEyeSlash, faTrash, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  // Fetch all testimonials
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const testimonialsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTestimonials(testimonialsData);
    } catch (error) {
      console.error("Error fetching testimonials: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle testimonial visibility
  const toggleVisibility = async (id, currentStatus) => {
    setActionLoading(id);
    try {
      await updateDoc(doc(db, "testimonials", id), {
        isActive: !currentStatus
      });
      
      // Update local state
      setTestimonials(testimonials.map(testimonial => 
        testimonial.id === id 
          ? { ...testimonial, isActive: !currentStatus }
          : testimonial
      ));
    } catch (error) {
      console.error("Error updating testimonial:", error);
    } finally {
      setActionLoading("");
    }
  };

  // Delete testimonial
  const deleteTestimonial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial? This action cannot be undone.")) {
      return;
    }

    setActionLoading(id);
    try {
      await deleteDoc(doc(db, "testimonials", id));
      setTestimonials(testimonials.filter(testimonial => testimonial.id !== id));
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    } finally {
      setActionLoading("");
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FontAwesomeIcon
        key={index}
        icon={faStar}
        className={`${
          index < rating ? "text-yellow-400" : "text-gray-300"
        } text-sm`}
      />
    ));
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="py-8 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-secondary)] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 px-3 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Manage Testimonials</h2>
          <p className="text-gray-600">View, edit, and manage customer testimonials and reviews</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{testimonials.length}</p>
              </div>
              <FontAwesomeIcon icon={faQuoteLeft} className="text-3xl text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Reviews</p>
                <p className="text-2xl font-bold text-green-600">
                  {testimonials.filter(t => t.isActive).length}
                </p>
              </div>
              <FontAwesomeIcon icon={faEye} className="text-3xl text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {testimonials.length > 0 
                    ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
                    : "0.0"
                  }
                </p>
              </div>
              <FontAwesomeIcon icon={faStar} className="text-3xl text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Testimonials List */}
        {testimonials.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">All Testimonials</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="p-6">
                  <div className="flex items-start justify-between">
                    {/* Testimonial Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        {/* Customer Image */}
                        {testimonial.customerImage ? (
                          <img
                            src={testimonial.customerImage}
                            alt={testimonial.customerName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[var(--color-secondary)] text-white flex items-center justify-center font-semibold text-lg">
                            {testimonial.customerName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        
                        {/* Customer Info */}
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {testimonial.customerName}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="flex gap-1">
                              {renderStars(testimonial.rating)}
                            </div>
                            <span>({testimonial.rating}/5)</span>
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            testimonial.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {testimonial.isActive ? "Active" : "Hidden"}
                        </span>
                      </div>
                      
                      {/* Review Text */}
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        "{testimonial.reviewText}"
                      </p>
                      
                      {/* Additional Info */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {testimonial.serviceUsed && (
                          <span>Service: <strong>{testimonial.serviceUsed}</strong></span>
                        )}
                        {testimonial.location && (
                          <span>Location: <strong>{testimonial.location}</strong></span>
                        )}
                        <span>Added: <strong>{formatDate(testimonial.createdAt)}</strong></span>
                        <span>Source: <strong className="capitalize">{testimonial.source || 'Manual'}</strong></span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => toggleVisibility(testimonial.id, testimonial.isActive)}
                        disabled={actionLoading === testimonial.id}
                        className={`p-2 rounded-lg transition-colors ${
                          testimonial.isActive
                            ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                            : "bg-green-100 text-green-600 hover:bg-green-200"
                        } ${actionLoading === testimonial.id ? "opacity-50 cursor-not-allowed" : ""}`}
                        title={testimonial.isActive ? "Hide testimonial" : "Show testimonial"}
                      >
                        <FontAwesomeIcon 
                          icon={testimonial.isActive ? faEyeSlash : faEye} 
                          className="w-4 h-4"
                        />
                      </button>
                      
                      <button
                        onClick={() => deleteTestimonial(testimonial.id)}
                        disabled={actionLoading === testimonial.id}
                        className={`p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors ${
                          actionLoading === testimonial.id ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        title="Delete testimonial"
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FontAwesomeIcon icon={faQuoteLeft} className="text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Testimonials Yet</h3>
            <p className="text-gray-600 mb-4">
              Start building trust by adding your first customer testimonial.
            </p>
            <button
              onClick={() => window.location.href = '/seller/add-testimonial'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-secondary)] hover:bg-[var(--color-accent)] text-white font-semibold rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faQuoteLeft} />
              Add First Testimonial
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTestimonials;