import React from 'react'
import ReviewCard from './ReviewCard'
import testimonial from '../Data/TestimonialData.js'

const Testimonials = () => {
    
    return (
        <div className="text-center my-20">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-accent)]">What Our Coustomer Say</h1>
            <div className="flex flex-wrap justify-center gap-5 mt-16 text-left">
                {testimonial.slice(0, 6).map(review => (
                    <ReviewCard 
                    id={review.id}
                    name={review.name}
                    feedback={review.feedback}
                    image={review.image}
                    />

                ))}
                
            </div>
        </div>
    )
}

export default Testimonials