import React from 'react'
import products from '../data/servicesData';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/cartContext';

const Products = () => {
    const { id } = useParams();
    const product = products.find(p => p.id === parseInt(id));

    if (!product) return <p>Product not found</p>;
    const { addToCart, removeFromCart, isInCart } = useCart();

    const handleCart = () => {
        if (isInCart(product.id)) {
            removeFromCart(product.id);
        } else {
            addToCart({ ...product, quantity: 1 });
        }
    };
     
    return product && (
        <div className="max-w-6xl w-full lg:py-36 lg:px-26 px-8 py-20">
            {/* <p>
                <span>Home</span> /
                <span> Products</span> /
                <span> {product.category}</span> /
                <span className="text-indigo-500"> {product.name}</span>
            </p> */}

            <div className="w-full flex flex-col justify-between md:flex-row lg:gap-16 gap-6 mt-4 ">
                <div className="flex gap-3">
                    <div className="w-full md:w-[350px] lg:w-[500px] flex flex-col gap-3">
                        <img
                            className="w-full h-auto max-h-[500px] object-contain rounded-lg"
                            src={product.image}
                            alt={product.name}
                        />
                    </div>
                </div>


                <div className="text-sm w-full md:w-1/2 ">
                    <h1 className="text-3xl text-[var(--color-accent)] font-medium">{product.name}</h1>

                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">MRP: ₹{product.price}</p>
                        <p className="text-2xl font-medium">MRP: ₹{product.offerPrice}</p>
                        <span className="text-gray-500/70">(inclusive of all taxes)</span>
                    </div>

                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc text-gray-500/70">
                        {product.description}
                    </ul>

                    <div onClick={handleCart} className="flex items-center mt-10 gap-4 text-base">
                        <button
                            onClick={handleCart}
                            className={`w-full py-3.5 cursor-pointer font-medium transition 
                                ${isInCart(product.id)
                                    ? 'bg-[var(--color-opaque)] border border-[var(--color-secondary)] text-[var(--color-accent)]'
                                    : 'bg-[var(--color-accent)] text-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] hover:border'}`}
                        >
                            {isInCart(product.id) ? 'Remove from Cart' : 'Add to Cart'}
                        </button>
                       
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Products