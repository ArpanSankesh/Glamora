import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'


const NavBar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev)
    }
    return (
        <nav className={`h-[70px] fixed w-full px-6 md:px-16 lg:px-24 xl:px-26 flex items-center justify-between z-20 transition-all ${isScrolled
      ? 'bg-white text-[var(--color-accent)] shadow-md'
      : 'bg-transparent text-[var(--color-text)]'}`}>
            {/* Logo */}
            <a href="/" className="text-2xl font-bold transition">PrettyNbeauty</a>
            
            <div className='flex gap-10 items-center justify-center'>    
            {/* Desktop Menu */}
            <ul className="md:flex hidden items-center gap-10">
                <li><a className="font-medium hover:text-[var(--color-accent)] transition" href="/">Home</a></li>
                <li><a className="font-medium hover:text-[var(--color-accent)] transition" href="/services">Services</a></li>
                <li><a className="font-medium hover:text-[var(--color-accent)] transition" href="/about">About</a></li>
                <li><a className="font-medium hover:text-[var(--color-accent)] transition" href="/contact">Contact</a></li>
            </ul>

            {/* Book Now Button (Desktop) */}
            <button type="button" className="bg-[var(--color-accent)] text-[var(--color-text)] border border-[var(--color-accent)] md:inline hidden text-sm font-semibold hover:bg-[var(--color-text)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] active:scale-95 transition-all w-40 h-11 rounded-2xl">
                Book Now
            </button>
            </div>


            {/* Mobile Menu Button */}
            <button
                aria-label="menu-btn"
                type="button"
                className="menu-btn inline-block md:hidden active:scale-90 transition"
                onClick={toggleMobileMenu}
            >
                <FontAwesomeIcon className='text-[var(--color-text)]' icon={faBars} />
            </button>

            {/* Mobile Menu */}
            <div className={`mobile-menu fixed top-[70px] left-0 w-full bg-white p-6 
                ${isMobileMenuOpen ? '' : 'hidden'} 
                md:hidden`}>
                <ul className="flex flex-col space-y-4 text-lg">
                    <li><a href="#" className="text-sm text-[var(--color-accent)] font-medium ">Home</a></li>
                    <li><a href="#" className="text-sm text-[var(--color-accent)] font-medium ">Services</a></li>
                    <li><a href="#" className="text-sm text-[var(--color-accent)] font-medium ">Portfolio</a></li>
                    <li><a href="#" className="text-sm text-[var(--color-accent)] font-medium ">Pricing</a></li>
                </ul>

                <button type="button" className="bg-[var(--color-accent)] text-[var(--color-text)] border border-gray-300 mt-6 text-sm font-semibold hover:bg-[var(--color-text)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] active:scale-95 transition-all w-40 h-11 rounded-2xl">
                    Book now
                </button>
            </div>
        </nav>
    )
}

export default NavBar