import React from 'react'

const AboutSection = () => {
  return (
    <div className="w-full flex justify-center items-center px-6 md:px-16 lg:px-24 xl:px-32 py-20 relative">
      <div className="w-full h-auto bg-[var(--color-accent)] rounded-3xl flex flex-col md:flex-row items-center justify-between px-10 py-12 md:py-20  overflow-hidden ">
        
        {/* Text Content */}
        <div className="max-w-lg z-10 text-center md:text-left">
          <h1 className="text-[var(--color-text)] text-4xl md:text-6xl font-bold leading-tight">
            Your Glow,<br /> Our Passion
          </h1>
          <p className="text-[var(--color-text)] text-base md:text-lg leading-6 mt-3">
            More than a salon — it’s your beauty sanctuary.
          </p>
          <button className="px-8 py-3 bg-[var(--color-text)] text-[var(--color-accent)] font-bold rounded-xl mt-8">
            About Us
          </button>
        </div>

        {/* Image */}
        <div className="absolute bottom-21 right-0 w-full md:w-auto mt-10 md:mt-0 flex justify-center z-10">
          <img
            src="./src/assets/3d.png" // Replace with your actual image path
            alt="About"
            className="h-[620px] object-contain"
          />
        </div>
      </div>
    </div>
  )
}

export default AboutSection
