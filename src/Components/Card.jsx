import React from 'react'

const Card = () => {
    return (
        <div className="bg-white rounded-lg shadow text-sm max-w-80 lg:max-w-120 border border-[var(--color-border)]">
            <img className="rounded-t-md lg:h-90 h-55 w-full object-cover" 
            src="./src/assets/hair Spa.jpg" alt="officeImage" />
            <p className="text-[var(--color-secondary)] text-xl font-semibold ml-2 mt-2">Your Card Title</p>
            <p className="text-gray-500 mt-3 ml-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore..</p>
            <button type="button" className=" bg-[var(--color-accent)] mt-4 mb-3 ml-2 px-6 py-2 font-medium rounded text-white">Learn More</button>
        </div>
    )
}

export default Card