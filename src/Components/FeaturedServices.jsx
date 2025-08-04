import React from 'react'
import ProductCard from './ProductCard'
import services from '../data/servicesData.js'
import { useNavigate } from 'react-router-dom'

const FeaturedServices = () => {
  const navigate = useNavigate(); // 👈

  return (
    <div className='my-20 mx-10 flex flex-col items-center justify-center'>
      <h1 className="text-3xl md:text-5xl font-medium text-[var(--color-accent)] text-center">Featured Services</h1>
      <p className="text-[var(--color-secondary)] text-center md:text-xl mt-2">Explore our top beauty treatments.</p>
      <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
        {services.slice(0, 6).map(service => (
          <ProductCard
            key={service.id}
            id={service.id}
            name={service.name}
            description={service.description}
            category={service.category}
            time={service.time}
            price={service.price}
            offerPrice={service.offerPrice}
            image={service.image}
          />
        ))}
      </div>
      <button onClick={() => navigate('/services')} className='cursor-pointer px-10 py-3 border-2 border-[var(--color-accent)] text-[var(--color-accent)]  mt-20 rounded-full hover:bg-[var(--color-accent)] hover:text-[var(--color-text)] transition-all'>More</button>
    </div>

  )
}

export default FeaturedServices