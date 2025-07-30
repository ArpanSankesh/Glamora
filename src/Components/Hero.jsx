import React from 'react'

const Hero = () => {
  return (
    <div className='w-full h-screen flex items-center px-6 md:px-16 lg:px-20 xl:px-26 '>
      <div className='w-full h-screen absolute top-0 left-0 bg-[var(--color-overlay)] opacity-50 z-10'></div>
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('./src/assets/hero.jpg')" }}
      ></div>

      <div className='z-20 flex flex-col gap-10 text-[var(--color-text)] mt-30'>
        <div>
          <p className='text-2xl font-medium text-[var(--color-accent)]'>LUXURY BEAUTY SERVICES</p>
          <h1 className='text-8xl font-bold leading-[0.9]'>Inner Beauty</h1>
          <h1 className='text-8xl font-bold leading-[0.9]'>Reveal Your,</h1>
        </div>
        <button type="button" className="w-50 h-15 bg-[var(--color-accent)] text-[var(--color-text)] border border-[var(--color-accent)] md:inline hidden text-lg font-semibold hover:bg-[var(--color-text)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] active:scale-95 transition-all rounded-2xl">
          Book Now
        </button>
      </div>
    </div>
  )
}

export default Hero