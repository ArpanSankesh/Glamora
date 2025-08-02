import React from 'react'
import ReviewCard from './ReviewCard'

const Testimonials = () => {
    return (
        <div className="text-center my-20">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-accent)]">What Our Coustomer Say</h1>
            <p className="text-sm md:text-base text-[var(--color-secondary)] mt-4">Join thousand of successful students who transformed their careers with us</p>
            <div className="flex flex-wrap justify-center gap-5 mt-16 text-left">
                <ReviewCard />
                <ReviewCard />
                <ReviewCard />
                <ReviewCard />
                <ReviewCard />
                <ReviewCard />
            </div>
        </div>
    )
}

export default Testimonials