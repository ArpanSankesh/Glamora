import React from 'react'
import { useNavigate } from 'react-router-dom'

const AboutSection = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex justify-center items-center px-6 md:px-16 lg:px-24 xl:px-32 py-20 ">
      <div className="relative w-full h-auto bg-[var(--color-accent)] rounded-3xl flex flex-col md:flex-row items-center justify-center px-10 py-12 lg:py-20">
        
        {/* Text Content */}
        <div className="max-w-lg z-10 text-center">
          <h1 className="text-[var(--color-text)] text-4xl md:text-4xl xl:text-6xl font-bold leading-tight">
            Your Glow,<br /> Our Passion
          </h1>
          <p className="text-[var(--color-text)] text-base lg:text-lg leading-6 mt-3">
            More than a salon — it’s your beauty sanctuary.
          </p>
          <button onClick={()=> (navigate('/about'))} className="cursor-pointer hover:bg-[var(--color-accent)] hover:text-[var(--color-text)] border-2 hover:border-[var(--color-text)]  px-8 py-3 bg-[var(--color-text)] text-[var(--color-accent)] font-bold rounded-xl mt-8 transition-all">
            About Us
          </button>
        </div>

        
      </div>
    </div>
  )
}

export default AboutSection
