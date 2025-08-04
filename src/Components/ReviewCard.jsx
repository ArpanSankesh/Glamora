import React from 'react'

const ReviewCard = ({ name, feedback, image}) => {
  return (
    <div className="w-80 flex flex-col items-start border border-gray-200 p-5 rounded-lg bg-[var(--color-opaque)]">
                    <div className="flex items-center gap-3 mt-4">
                        <img className="h-12 w12 rounded-full" src={image} alt="userImage1" />

                    </div>
                    <div>
                        <h2 className="text-lg text-[var(--color-secondary)] font-medium">{name}</h2>
                    </div>

                    <p className="text-sm mt-3 text-gray-500">{feedback}</p>

                </div>
  )
}

export default ReviewCard