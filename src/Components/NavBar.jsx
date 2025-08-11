import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faBars } from '@fortawesome/free-solid-svg-icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/cartContext'

const NavBar = () => {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { cartItems } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isHomePage) return
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomePage])

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev)

  const handleNavClick = (path) => {
    setIsMobileMenuOpen(false)
    if (path === 'contact' && isHomePage) {
      const el = document.getElementById('contact')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/${path === 'home' ? '' : path}`)
    }
  }

  return (
    <nav className={`fixed top-0 left-0 w-full h-[70px] z-20 transition-all 
      px-6 md:px-16 lg:px-24 flex items-center justify-between 
      ${isHomePage && !isScrolled
        ? 'bg-transparent text-[var(--color-text)]'
        : 'bg-[var(--color-text)] text-[var(--color-accent)]'}
    `}>
      {/* Logo */}
      <button onClick={() => handleNavClick('home')} className="cursor-pointer text-2xl font-bold transition">PrettyNbeauty</button>

      {/* Desktop Menu */}
      <div className='flex items-center gap-5'>
      <div className='hidden md:flex items-center gap-10 '>
        {['home', 'services', 'about', 'contact'].map(link => (
          <button
          key={link}
            onClick={() => handleNavClick(link)}
            className="font-medium hover:text-[var(--color-accent)] transition cursor-pointer"
            >
            {link.charAt(0).toUpperCase() + link.slice(1)}
          </button>
        ))}

        {/* Cart Icon */}
      </div>
        <div className="relative cursor-pointer" onClick={() => navigate('/booking')}>
          <FontAwesomeIcon icon={faShoppingCart} className="text-2xl text-[var(--color-accent)]" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 text-xs text-white bg-[var(--color-accent)] w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </div>

      {/* Mobile Menu Button */}
      <button
        aria-label="menu-btn"
        type="button"
        className="text-2xl inline-block md:hidden active:scale-90 transition"
        onClick={toggleMobileMenu}
        >
        <FontAwesomeIcon icon={faBars} />
      </button>
      </div>

      {/* Mobile Menu */}
      
      <div className={`fixed top-[70px] left-0 w-full bg-white p-6 z-10 transition-all md:hidden 
        ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <ul className="flex flex-col space-y-4 text-lg text-[var(--color-accent)] font-medium ">
          {['home', 'services', 'about', 'contact'].map(link => (
            <li key={link}>
              <button
                onClick={() => handleNavClick(link)}
                className="text-left w-full cursor-pointer"
              >
                {link.charAt(0).toUpperCase() + link.slice(1)}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false)
                navigate('/booking')
              }}
              className="flex items-center gap-2"
            >
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default NavBar
