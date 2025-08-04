import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import { faBars } from '@fortawesome/free-solid-svg-icons'
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cartContext';


const NavBar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const { cartItems } = useCart();
  const navigate = useNavigate();


  useEffect(() => {
    const handleScroll = () => {
      if (!isHomePage) return
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
    <nav className={`fixed top-0 left-0 w-full h-[70px] z-20 transition-all 
  px-6 md:px-16 lg:px-24 xl:px-26 flex items-center justify-between 
  ${isHomePage
        ? isScrolled
          ? 'bg-[var(--color-text)] text-[var(--color-accent)] '
          : 'bg-transparent text-[var(--color-text)]'
        : 'bg-[var(--color-text)] text-[var(--color-accent)] '
      }
`}>
      {/* Logo */}
      <a href="/" className="text-2xl font-bold transition">PrettyNbeauty</a>

      <div className='flex gap-10 items-center justify-center'>
        {/* Desktop Menu */}
        <ul className="md:flex hidden items-center gap-10">
          <li><a className="cursor-pointer font-medium hover:text-[var(--color-accent)] transition" onClick={() => (navigate('/'))} >Home</a></li>
          <li><a className="cursor-pointer font-medium hover:text-[var(--color-accent)] transition" onClick={() => (navigate('/services'))}>Services</a></li>
          <li><a className="cursor-pointer font-medium hover:text-[var(--color-accent)] transition" onClick={() => (navigate('/about'))}>About</a></li>
          <li><a className="cursor-pointer font-medium hover:text-[var(--color-accent)] transition" onClick={() => {
            const el = document.getElementById("contact");
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            }
          }}>Contact</a></li>
        </ul>

        <div className="relative cursor-pointer">
          <FontAwesomeIcon icon={faShoppingCart} onClick={() => (navigate('/booking'))} className="text-2xl text-[var(--color-accent)]" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 text-xs text-white bg-[var(--color-accent)] w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </div>
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
          <li><a onClick={() => (navigate('/'))} className="coursor-pointer text-sm text-[var(--color-accent)] font-medium ">Home</a></li>
          <li><a onClick={() => (navigate('/services'))} className="coursor-pointer text-sm text-[var(--color-accent)] font-medium ">Services</a></li>
          <li><a onClick={() => (navigate('/about'))} className="coursor-pointer text-sm text-[var(--color-accent)] font-medium ">About</a></li>
          <li><a className="coursor-pointer text-sm text-[var(--color-accent)] font-medium " onClick={() => {
            const el = document.getElementById("contact");
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            }
          }}>Contact</a></li>
        </ul>
      </div>
    </nav>
  )
}

export default NavBar