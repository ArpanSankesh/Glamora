import React from 'react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ id, name, description, category, time, price, offerPrice, image, viewType }) => {
    const { addToCart, removeFromCart, isInCart } = useCart();
    const navigate = useNavigate();

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
                           bg-cover bg-center  md:rounded-t-md"
                style={{ backgroundImage: `url(${image})` }}
            />

            {/* CONTENT */}
            <div className="p-4 flex flex-col justify-between text-gray-500/60 text-sm flex-1">
                <div>
                    <div className="flex justify-between items-center">
                        <p className="text-[var(--color-secondary)] font-semibold text-lg md:text-xl">{name}</p>
                        <p className="text-[var(--color-secondary)] text-sm md:text-base">{time} min</p>
                    </div>
                    <p className="text-gray-700 line-clamp-3 text-sm mt-1">{description}</p>
                </div>

                <div className="flex items-center justify-between mt-3">
                    <p className="text-base md:text-xl font-medium text-[var(--color-secondary)]">
                        ₹{offerPrice}{' '}
                        <span className="text-gray-500/60 text-xs md:text-sm line-through">₹{price}</span>
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
