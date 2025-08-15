import React from "react";
import { useParams } from "react-router-dom";
import services from "../data/servicesData";
import packages from "../data/packageData";
import { useCart } from "../context/CartContext"

const Products = () => {
  const { type, id } = useParams();
  const { addToCart, removeFromCart, isInCart } = useCart();

  const dataset = type === "services" ? services : type === "packages" ? packages : [];
  const product = dataset.find((item) => String(item.id) === String(id));

  if (!product) {
    return <p className="text-center mt-10">Product not found.</p>;
  }

  const handleCart = () => {
    if (isInCart(product.id)) {
      removeFromCart(product.id);
    } else {
      addToCart({ ...product, quantity: 1 });
    }
  };

  return (
    <div className="max-w-6xl w-full lg:py-36 lg:px-26 px-8 py-20">
      <div className="w-full flex flex-col justify-between md:flex-row lg:gap-16 gap-6 mt-4 ">
        {/* Product Image */}
        <div className="flex gap-3">
          <div className="w-full md:w-[350px] lg:w-[500px] flex flex-col gap-3">
            {product.image && (
              <img
                className="w-full h-auto max-h-[500px] object-contain rounded-lg"
                src={product.image}
                alt={product.name}
              />
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl text-[var(--color-accent)] font-medium">{product.name}</h1>

          {/* Price Section */}
          <div className="mt-6">
            <p className="text-gray-500/70 line-through">MRP: ₹{product.price}</p>
            <p className="text-2xl font-medium">Offer: ₹{product.offerPrice}</p>
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
