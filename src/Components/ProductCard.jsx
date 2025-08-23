import React from 'react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ id, name, description, category, time, price, offerPrice, image, imageUrl, viewType }) => {
    const { addToCart, removeFromCart, isInCart } = useCart();
    const navigate = useNavigate();

    // Use imageUrl if image is not provided (for flexibility)
    const displayImage = image || imageUrl;

    // Debug logging
    console.log('ProductCard props:', { id, name, image, imageUrl, displayImage, viewType });

    const handleCart = () => {
        if (isInCart(id)) {
            removeFromCart(id);
        } else {
            addToCart({ id, name, description, category, time, price, offerPrice, image, quantity: 1 });
        }
    };

    const handleClick = () => {
        navigate(`/product/${viewType}/${id}`);
    };

    // Check if image URL is valid
    const hasValidImage = displayImage && displayImage.trim() !== '' && displayImage !== 'undefined' && displayImage !== 'null';

    return (
        <div
            className="border border-[var(--color-secondary)] rounded-md bg-white
                        w-full max-w-90
                       flex flex-row items-center justify-between md:flex-col   /* row on mobile, col on md+ */
                       hover:scale-105 transition-all"
        >
            {/* IMAGE */}
            <div
                onClick={handleClick}
                className="cursor-pointer flex-shrink-0
                            w-32 h-32 md:w-full md:h-60 ml-3 lg:ml-0
                            md:rounded-t-md overflow-hidden
                            flex items-center justify-center"
            >
                {hasValidImage ? (
                    <div
                        className="w-full h-full bg-cover bg-center bg-gray-200"
                        style={{ backgroundImage: `url(${displayImage})` }}
                        onError={(e) => {
                            console.error('Failed to load background image:', displayImage);
                            e.target.style.backgroundImage = 'none';
                        }}
                    />
                ) : (
                    // Fallback when no image is available
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <div className="text-center text-gray-400">
                            <svg className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            <p className="text-xs">No Image</p>
                        </div>
                    </div>
                )}
            </div>

            {/* CONTENT */}
            <div className="p-4 flex flex-col justify-between text-gray-500/60 text-sm flex-1">
                <div>
                    <div className="flex justify-between items-center">
                        <p className="text-[var(--color-secondary)] font-semibold text-lg md:text-xl">{name || 'Unnamed Service'}</p>
                        <p className="text-[var(--color-secondary)] text-sm md:text-base">{time ? `${time}` : 'N/A'}</p>
                    </div>
                    <p className="text-gray-700 line-clamp-3 text-sm mt-1">{description || 'No description available'}</p>
                </div>

                <div className="flex items-center justify-between mt-3">
                    <p className="text-base md:text-xl font-medium text-[var(--color-secondary)]">
                        ₹{offerPrice || price || 0}{' '}
                        {offerPrice && price && offerPrice !== price && (
                            <span className="text-gray-500/60 text-xs md:text-sm line-through">₹{price}</span>
                        )}
                    </p>
                    <button
                        onClick={handleCart}
                        className={`cursor-pointer flex items-center justify-center gap-1
                                    w-[64px] md:w-[80px] h-[34px] rounded font-medium transition-all
                                    ${isInCart(id)
                                        ? 'bg-[var(--color-opaque)] border border-[var(--color-secondary)] text-[var(--color-accent)]'
                                        : 'bg-[var(--color-text)] text-[var(--color-secondary)]'}`}
                    >
                        {isInCart(id) ? 'Remove' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard