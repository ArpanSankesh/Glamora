import React, { useState } from 'react'
import { useCart } from '../context/cartContext';

const ProductCard = ({ name, description, image, price, offerPrice }) => {
    const { addToCart, removeFromCart, isInCart } = useCart();


    const handleClick = () => {
        if (isInCart(name)) {
            removeFromCart(name);
        } else {
            addToCart({ name, description, image, price, offerPrice });
        }
    };

    return (
        <div className="border border-[var(--color-secondary)] rounded-md  bg-white lg:min-w-56 lg:max-w-90 md:max-w-80 max-w-90 w-full">
            <div className="group cursor-pointer flex items-center justify-center h-60 w-full bg-cover bg-center rounded-t-md"
                style={{ backgroundImage: `url(${image})` }}>

            </div>
            <div className="p-5 text-gray-500/60 text-sm">
                <p className="text-[var(--color-secondary)] font-semibold text-xl truncate w-full">{name}</p>
                <p className="text-gray-700  text-sm  w-full">{description}</p>

                <div className="flex items-end justify-between mt-3">
                    <p className="md:text-xl text-base font-medium text-[var(--color-secondary)]">
                        ₹{offerPrice} <span className="text-gray-500/60 md:text-sm text-xs line-through">₹{price}</span>
                    </p>
                    <div className="text-[var(--color-secondary)]">
                        <button
                            onClick={handleClick}
                            className={`cursor-pointer flex items-center justify-center gap-1 md:w-[80px] w-[64px] h-[34px] rounded font-medium transition-all
                                ${isInCart(name)
                                    ? 'bg-[var(--color-opaque)] border border-[var(--color-secondary)] text-[var(--color-accent)]'
                                    : 'bg-[var(--color-text)] text-[var(--color-secondary)]'}`}
                        >
                            {isInCart(name) ? 'Remove' : 'Add'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard