import React, { useState } from 'react'
import { useCart } from '../context/cartContext';

const ProductCard = ({ id, name, description, categry, time, price, offerPrice, image,}) => {
    const { addToCart, removeFromCart, isInCart } = useCart();


    const handleClick = () => {
        if (isInCart(id)) {
            removeFromCart(id);
        } else {
            addToCart({ id, name, description, categry, time, price, offerPrice, image, quantity: 1 });
        }
    };

    return (
        <div className="border border-[var(--color-secondary)] rounded-md  bg-white lg:min-w-56 lg:max-w-90 md:max-w-80 max-w-90 w-full">
            <div className="group cursor-pointer flex items-center justify-center h-60 w-full bg-cover bg-center rounded-t-md"
                style={{ backgroundImage: `url(${image})` }}>

            </div>
            <div className="p-5 text-gray-500/60 text-sm">
                <div className='flex justify-between'>
                    <p className="text-[var(--color-secondary)] font-semibold text-xl  ">{name}</p>
                    <p className='text-[var(--color-secondary)]  w-15'>{time} min</p>
                </div>
                <p className="text-gray-700  text-sm ">{description}</p>

                <div className="flex items-end justify-between mt-3">
                    <p className="md:text-xl text-base font-medium text-[var(--color-secondary)]">
                        ₹{offerPrice} <span className="text-gray-500/60 md:text-sm text-xs line-through">₹{price}</span>
                    </p>
                    <div className="text-[var(--color-secondary)]">
                        <button
                            onClick={handleClick}
                            className={`cursor-pointer flex items-center justify-center gap-1 md:w-[80px] w-[64px] h-[34px] rounded font-medium transition-all
                                ${isInCart(id)
                                    ? 'bg-[var(--color-opaque)] border border-[var(--color-secondary)] text-[var(--color-accent)]'
                                    : 'bg-[var(--color-text)] text-[var(--color-secondary)]'}`}
                        >
                            {isInCart(id) ? 'Remove' : 'Add'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard