import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig.js";
import { useCart } from "../context/CartContext";

const Products = () => {
  const { type, id } = useParams();
  const { addToCart, removeFromCart, isInCart } = useCart();
  
  // State management
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || !type) {
        setError("Invalid product parameters");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Determine collection based on type
        let collectionName = "";
        if (type === "services" || type === "service") {
          collectionName = "services";
        } else if (type === "packages" || type === "package") {
          collectionName = "packages";
        } else {
          throw new Error(`Invalid product type: ${type}`);
        }

        console.log(`Fetching ${collectionName} with ID: ${id}`);

        // Fetch document from Firebase
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = {
            id: docSnap.id,
            ...docSnap.data()
          };
          console.log("Product found:", productData);
          setProduct(productData);
        } else {
          console.log("No document found!");
          setError("Product not found");
        }

      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [type, id]);

  const handleCart = () => {
    if (!product) return;

    if (isInCart(product.id)) {
      removeFromCart(product.id);
    } else {
      addToCart({ ...product, quantity: 1 });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl w-full lg:py-36 lg:px-26 px-8 py-20">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)]"></div>
            <p className="text-gray-500">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl w-full lg:py-36 lg:px-26 px-8 py-20">
        <div className="text-center py-20">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-[var(--color-accent)] text-white rounded hover:opacity-90 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="max-w-6xl w-full lg:py-36 lg:px-26 px-8 py-20">
        <div className="text-center py-20">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-[var(--color-accent)] text-white rounded hover:opacity-90 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl w-full lg:py-36 lg:px-26 px-8 py-20">
      <div className="w-full flex flex-col justify-between md:flex-row lg:gap-16 gap-6 mt-4">
        {/* Product Image */}
        <div className="flex gap-3">
          <div className="w-full md:w-[350px] lg:w-[500px] flex flex-col gap-3">
            {product.image ? (
              <img
                className="w-full h-auto max-h-[500px] object-contain rounded-lg"
                src={product.image}
                alt={product.name}
              />
            ) : (
              <div className="w-full h-[300px] md:h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-lg">No Image Available</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl text-[var(--color-accent)] font-medium">{product.name}</h1>

          {/* Price Section */}
          <div className="mt-6">
            <p className="text-2xl font-medium">MRP: ₹{product.price}</p>
            <span className="text-gray-500/70">(inclusive of all taxes)</span>
          </div>

          {/* Description */}
          <p className="text-base font-medium mt-6">About Product</p>
          <p className="text-gray-500/70">{product.description}</p>

          {/* Add to Cart Button */}
          <div className="flex items-center mt-10 gap-4 text-base">
            <button
              onClick={handleCart}
              className={`w-full py-3.5 cursor-pointer font-medium transition 
                ${isInCart(product.id)
                  ? "bg-[var(--color-opaque)] border border-[var(--color-secondary)] text-[var(--color-accent)]"
                  : "bg-[var(--color-accent)] text-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] hover:border"}`}
            >
              {isInCart(product.id) ? "Remove from Cart" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;