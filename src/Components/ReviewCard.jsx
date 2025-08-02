import React from 'react'

const ReviewCard = () => {
  return (
    <div className="w-80 flex flex-col items-start border border-gray-200 p-5 rounded-lg bg-[var(--color-opaque)]">
                    <div className="flex items-center gap-3 mt-4">
                        <img className="h-12 w12 rounded-full" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100" alt="userImage1" />

                    </div>
                    <div>
                        <h2 className="text-lg text-[var(--color-secondary)] font-medium">Donald Jackman</h2>
                    </div>

                    <p className="text-sm mt-3 text-gray-500">I've been using imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.</p>

                </div>
  )
}

export default ReviewCard