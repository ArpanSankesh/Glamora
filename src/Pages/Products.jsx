import React from 'react'
import products from '../data/servicesData';
import { useParams } from 'react-router-dom';

const Products = () => {
    const { id } = useParams();
    const product = products.find(p => p.id === parseInt(id));

    if (!product) return <p>Product not found</p>;

    return product && (
        <div className="max-w-6xl w-full my-36 mx-26">
            {/* <p>
                <span>Home</span> /
                <span> Products</span> /
                <span> {product.category}</span> /
                <span className="text-indigo-500"> {product.name}</span>
            </p> */}

            <div className="w-full flex flex-col justify-between md:flex-row gap-16 mt-4 ">
                <div className="flex gap-3">
                    <div className="w-full md:w-[400px] lg:w-[500px] flex flex-col gap-3">
                        <img
                            className="w-full h-auto max-h-[500px] object-contain rounded-lg"
                            src={product.image}
                            alt={product.name}
                        />
                    </div>
                </div>


                <div className="text-sm w-full md:w-1/2">
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

                    <div className="flex items-center mt-10 gap-4 text-base">
                        <button className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition" >
                            Add to Cart
                        </button>
                        <button className="w-full py-3.5 cursor-pointer font-medium bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent)] transition" >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Products