import React from 'react'
import ProductCard from '../Components/ProductCard'
import AboutSection from '../Components/AboutSection'

const Services = () => {
    return (
        <div className='w-full pt-35'>
            <h1 class="text-3xl font-semibold text-center ">Our Services</h1>
            <p class="text-sm text-[var(--color-secondary)] text-center mt-2 ">Everything you need to manage, track, and grow your finances, securely and efficiently.</p>
            <div className=' flex flex-wrap items-center justify-center gap-6 mt-20'>
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
            </div>
            <div className='lg:mt-40 mt-10'>
                <AboutSection />
            </div>

        </div>
    )
}

export default Services