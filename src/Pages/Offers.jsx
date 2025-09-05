import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig.js";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const offersSnap = await getDocs(collection(db, "offers"));
        const offersData = offersSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOffers(offersData);
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Coupon "${text}" copied! ✅`);
  };

  if (loading) {
    return (
      <div className="py-28 px-6 max-w-5xl mx-auto">
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-gray-500">Loading offers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-28 px-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold flex items-center gap-2 text-pink-600 mb-8">
        🎁 Limited Time Offers
      </h1>

      <div className="flex flex-col gap-6">
        {offers.length > 0 ? (
          offers.map((offer) => (
            <div
              key={offer.id}
              className="flex flex-col sm:flex-row gap-6 border border-gray-200 rounded-2xl p-6 shadow-sm bg-white"
            >
              {/* Offer Image */}
              <img
                src={offer.imageUrl}
                alt={offer.name}
                className="w-full sm:w-40 h-40 object-cover rounded-lg"
              />

              {/* Offer Content */}
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {offer.name}
                  </h2>
                  {offer.description && (
                    <p className="text-gray-600 mt-2">{offer.description}</p>
                  )}
                  <p className="mt-3 text-lg font-bold text-pink-600">
                    🎉 {offer.discount}% OFF
                  </p>
                  <p className="text-sm text-gray-500">
                    Valid Until: {offer.validUntil}
                  </p>
                </div>

                {/* Coupon Code Section */}
                {offer.couponCode && (
                  <div className="mt-4 flex items-center gap-3">
                    <span className="bg-pink-100 text-pink-600 font-semibold px-3 py-1 rounded-md">
                      {offer.couponCode}
                    </span>
                    <button
                      onClick={() => copyToClipboard(offer.couponCode)}
                      className="px-3 py-1 bg-pink-500 text-white rounded-md text-sm hover:bg-pink-600 transition"
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No offers available right now.</p>
        )}
      </div>

      <div className="mt-12 flex items-center justify-center text-red-500 font-medium text-lg gap-2">
        ❤️ Hurry! Book your slot now and save more.
      </div>
    </div>
  );
};

export default Offers;
