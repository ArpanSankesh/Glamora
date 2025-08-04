import React from 'react'
import ProductCard from '../Components/ProductCard'
import AboutSection from '../Components/AboutSection'
import services from '../data/servicesData.js'
import ContactSection from '../Components/ContactSection'

const Services = () => {

    return (
        <div className='w-full pt-35'>
            <h1 class="text-3xl font-semibold text-center ">Our Services</h1>
            <p class="text-sm text-[var(--color-secondary)] text-center mt-2 ">Everything you need to manage, track, and grow your finances, securely and efficiently.</p>
            <div className=' flex flex-wrap items-center justify-center gap-6 mt-20'>
                {services.map(service => (
                    <ProductCard
                        key={service.id}
                        id={service.id} 
                        name={service.name}
                        description={service.description}
                        image={service.image}
                        price={service.price}
                        offerPrice={service.offerPrice}
                    />


                ))}

            </div>
            <div className='lg:mt-40 mt-10'>
                <AboutSection />
                <ContactSection />

            </div>

        </div>
    )
}

export default Services