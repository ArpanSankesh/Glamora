import React from 'react'
import ProductCard from './ProductCard'
import services from '../assets/data/servicesData'

const FeaturedServices = () => {
  
  return (
    <div className='my-20 mx-10 flex flex-col items-center justify-center'>
        <h1 className="text-3xl md:text-5xl font-medium text-[var(--color-accent)] text-center">Featured Services</h1>
        <p className="text-[var(--color-secondary)] text-center md:text-xl mt-2">Explore our top beauty treatments.</p>
        <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
          {services.map(service => (
            <ProductCard
            key={service.id}
            name={service.name}
            description={service.description}
            image={service.image}
            price={service.price}
            offerPrice={service.offerPrice}
            isAvailable={service.id}
            />

          ))}
        </div>
        <button className='px-10 py-3 border-2 border-[var(--color-accent)] mt-20 rounded-full'>More</button>
    </div>
        
  )
}

export default FeaturedServices