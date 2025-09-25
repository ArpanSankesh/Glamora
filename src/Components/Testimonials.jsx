import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../config/firebaseConfig.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faQuoteLeft, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Your Google Business Profile URL - Replace with your actual Google Business URL
  const GOOGLE_REVIEW_URL = "https://www.google.com/search?sca_esv=ddc633b75768fb2c&rlz=1C1RXQR_enIN1108IN1108&sxsrf=AE3TifP9guhHuD6NfE7s7mT0Bwm-cNC8dw:1758799723270&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-EyTdVejcf1wLy0MXipoCdwuEo2q690dPHi5Fa1gzX4Sj3DrFmxMq1oTZWewiTYKKF4fbSeetWzimnRGr44WBkYm5mfkx&q=PrettyNbeauty+Reviews&sa=X&ved=2ahUKEwi0_PHF5_OPAxWQzTgGHZFRCvAQ0bkNegQIHhAD&biw=1440&bih=825&dpr=1.5";
  

  // Fetch testimonials from Firestore
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        console.log("Fetching testimonials...");
        
        // First try to get all testimonials to see if any exist
        const allTestimonials = await getDocs(collection(db, "testimonials"));
        console.log("Total testimonials in database:", allTestimonials.size);
        
        if (allTestimonials.size > 0) {
          allTestimonials.forEach((doc) => {
            console.log("Testimonial:", doc.id, doc.data());
          });
        }

        // Now try the filtered query
        const q = query(
          collection(db, "testimonials"),
          where("isActive", "==", true),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        console.log("Active testimonials found:", querySnapshot.size);
        
        const testimonialsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        console.log("Final testimonials data:", testimonialsData);
        setTestimonials(testimonialsData);
      } catch (error) {
        console.error("Error fetching testimonials: ", error);
        
        // Fallback: try without orderBy in case of index issues
        try {
          console.log("Trying fallback query without orderBy...");
          const fallbackQuery = query(
            collection(db, "testimonials"),
            where("isActive", "==", true)
          );
          const fallbackSnapshot = await getDocs(fallbackQuery);
          const fallbackData = fallbackSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("Fallback data:", fallbackData);
          setTestimonials(fallbackData);
        } catch (fallbackError) {
          console.error("Fallback query also failed:", fallbackError);
          
          // Last resort: get all testimonials without any filters
          try {
            console.log("Trying to get all testimonials without filters...");
            const simpleQuery = await getDocs(collection(db, "testimonials"));
            const simpleData = simpleQuery.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            console.log("Simple query data:", simpleData);
            setTestimonials(simpleData.filter(t => t.isActive !== false)); // Show all except explicitly hidden
          } catch (simpleError) {
            console.error("All queries failed:", simpleError);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

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

  // Handle Google review redirect
  const handleGoogleReview = () => {
    window.open(GOOGLE_REVIEW_URL, '_blank');
  };

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-secondary)] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about their experience.
          </p>
        </div>

        
        

        {/* Testimonials Grid */}
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                {/* Quote Icon */}
                <div className="text-[var(--color-secondary)] mb-4">
                  <FontAwesomeIcon icon={faQuoteLeft} className="text-2xl opacity-50" />
                </div>

                {/* Review Text */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  "{testimonial.reviewText}"
                </p>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex gap-1 mr-2">
                    {renderStars(testimonial.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({testimonial.rating}/5)
                  </span>
                </div>

                {/* Customer Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  {/* Customer Image */}
                  <div className="flex-shrink-0">
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
                  </div>

                  {/* Customer Details */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">
                      {testimonial.customerName}
                    </h4>
                    <div className="text-sm text-gray-600">
                      {testimonial.serviceUsed && (
                        <p>Service: {testimonial.serviceUsed}</p>
                      )}
                      {testimonial.location && (
                        <p>{testimonial.location}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faQuoteLeft} className="text-6xl text-gray-300 mb-4" />
            <p className="text-gray-600 mb-6">
              No reviews available at the moment. Check back soon!
            </p>
          </div>
        )}
      </div>
      <div className="text-center my-12">
          <button
            onClick={handleGoogleReview}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-secondary)] hover:bg-[var(--color-accent)] text-white rounded-md"
          >
            <FontAwesomeIcon icon={faExternalLinkAlt} />
            Leave a Review on Google
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Share your experience and help others discover our services
          </p>
        </div>
    </section>
  );
};

export default Testimonials;