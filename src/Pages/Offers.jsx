import React from "react";
import  offers  from "../data/offersData";

const Offers = () => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Coupon "${text}" copied! ✅`);
  };

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
              className={`${offer.bg} border border-gray-200 rounded-2xl p-6 shadow-sm`}
            >
              <p className="text-lg font-semibold">{offer.title}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className={`w-5 h-5 ${offer.text}`}>🏷️</span>
                <span
                  className={`${offer.text} font-bold bg-white border px-3 py-1 rounded-md shadow-sm`}
                >
                  {offer.coupon}
                </span>
                <button
                  onClick={() => copyToClipboard(offer.coupon)}
                  className="ml-2 px-3 py-1 bg-pink-500 text-white rounded-md text-sm hover:bg-pink-600 transition"
                >
                  Copy
                </button>
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
