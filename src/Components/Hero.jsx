import React from 'react'

const Hero = () => {
  return (
    <div className='w-full h-screen flex items-center px-6 md:px-16 lg:px-20 xl:px-26 '>
      <div className='w-full h-screen absolute top-0 left-0 bg-[var(--color-overlay)] opacity-50 z-10'></div>
      <div
        className="absolute inset-0 bg-cover bg-[30%_center] md:bg-center z-0"
        style={{ backgroundImage: "url('./src/assets/hero.jpg')" }}
      ></div>

      <div className='z-10 flex flex-col md:items-start items-center justify-center gap-5 md:gap-10 w-full md:mt-15'>
        <div className='text-[var(--color-text)] md:text-left text-center'>
          <p className=' xl:text-2xl md:text-xl sm:text-lg text-md ml-[6px] font-medium tracking-wider text-[var(--color-accent)]'>LUXURY BEAUTY SERVICES</p>
          <h1 className='xl:text-[7rem] md:text-8xl text-[3.25rem] font-bold leading-[0.9]'>Reveal Your,</h1>
          <h1 className='xl:text-[7rem] md:text-8xl text-[3.25rem] font-bold leading-[0.9]'>Inner Beauty</h1>
        </div>
        <button type="button" className="md:w-50 md:h-15 w-40 h-15 ml-[6px] bg-[var(--color-accent)] text-[var(--color-text)] border border-[var(--color-accent)] md:inline text-lg font-semibold hover:bg-[var(--color-text)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] active:scale-95 transition-all rounded-2xl">
          Book Now
        </button>
      </div>
    </div>
  )
}

export default Hero