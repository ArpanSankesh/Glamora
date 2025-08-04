import React, { useState } from 'react'

const ProductCard = ({ name, description, image, price, offerPrice }) => {

    const [isAddedToCart, setIsAddedToCart] = useState(false);

    const handleAddToCart = () => {
        setIsAddedToCart(true);
        console.log(`Added ${name} to cart`);
    };
    const handleRemoveFromCart = () => {
        setIsAddedToCart(false);
        console.log(`Removed ${name} from cart`);
    };

    return (
        <div className="border border-[var(--color-secondary)] rounded-md  bg-white lg:min-w-56 lg:max-w-90 md:max-w-80 max-w-90 w-full">
            <div className="group cursor-pointer flex items-center justify-center h-60 w-full bg-cover bg-center rounded-t-md"
                style={{ backgroundImage: `url(${image})` }}>

            </div>
            <div className="p-5 text-gray-500/60 text-sm">
                <p className="text-[var(--color-secondary)] font-semibold text-xl truncate w-full">{name}</p>
                <p className="text-gray-700 font-medium text-sm  w-full">{description}</p>

                <div className="flex items-end justify-between mt-3">
                    <p className="md:text-xl text-base font-medium text-[var(--color-secondary)]">
                        ₹{offerPrice} <span className="text-gray-500/60 md:text-sm text-xs line-through">₹{price}</span>
                    </p>
                    <div className="text-[var(--color-secondary)]">
                        {isAddedToCart ? (
                            <button className="flex items-center justify-center gap-1 bg-[var(--color-opaque)] border border-[var(--color-secondary)] md:w-[80px] w-[64px] h-[34px] rounded text-[var(--color-accent)] font-medium" onClick={handleRemoveFromCart} >

                                Remove
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-[var(--color-text)] rounded select-none">
                                <button onClick={handleAddToCart} className="cursor-pointer text-md px-2 h-full" >
                                    Add
                                </button>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard