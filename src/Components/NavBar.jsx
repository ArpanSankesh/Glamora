import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBars, faBoxOpen, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { handleLogout } from '../config/firebaseConfig';

const NavBar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (!isHomePage) return;
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHomePage]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen((p) => !p);
  const toggleUserMenu = () => setIsUserMenuOpen((p) => !p);

  const handleNavClick = (path) => {
    setIsMobileMenuOpen(false);
    if (path === 'contact' && isHomePage) {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/${path === 'home' ? '' : path}`);
    }
  };

  const handleUserMenuClick = (action) => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    if (action === 'logout') {
      handleLogout();
    } else {
      navigate(action);
    }
  };

  const role = currentUser?.role; // may be "user" or "seller"
  const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

  return (
    <nav
      className={`fixed top-0 left-0 w-full h-[70px]  transition-all duration-300
        px-6 md:px-16 lg:px-24 flex items-center justify-between z-50
        ${isHomePage && !isScrolled
          ? 'bg-transparent text-[var(--color-text)]'
          : 'bg-[var(--color-text)] text-[var(--color-accent)] shadow-lg backdrop-blur-sm'}`}
    >
      {/* Logo */}
      <button onClick={() => handleNavClick('home')} className="cursor-pointer md:text-2xl text:xl font-bold transition">
        PrettyNbeauty
      </button>

      {/* Desktop Menu + User area */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-10">
          {['home', 'services', 'offers', 'about', 'contact'].map((link) => (
            <button 
              key={link} 
              onClick={() => handleNavClick(link)} 
              className="font-medium hover:text-[var(--color-accent)] transition cursor-pointer"
            >
              {link.charAt(0).toUpperCase() + link.slice(1)}
            </button>
          ))}
        </div>

        {/* Cart - visible on all screen sizes */}
        <div className="relative cursor-pointer" onClick={() => navigate('/booking')}>
          <FontAwesomeIcon icon={faShoppingCart} className="text-2xl text-[var(--color-accent)]" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 text-xs text-white bg-[var(--color-accent)] w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </div>

        {/* Desktop User Section - hidden on mobile */}
        <div className=" md:block" ref={userMenuRef}>
          {loading ? (
            <div className="w-24 h-9 rounded-full bg-gray-200 animate-pulse" />
          ) : !currentUser ? (
            <button 
              onClick={() => navigate('/login')} 
              className="cursor-pointer px-3 py-2 md:px-6 md:py-2 rounded-full text-xs md:text-sm bg-[var(--color-accent)] text-[var(--color-text)] hover:scale-105 transition-transform shadow-md hover:shadow-lg"
            >
              Log In
            </button>
          ) : (
            <div className="relative">
              <img src="/assets/user.png" alt="profile" className="w-10 h-10 cursor-pointer rounded-full border border-gray-300" onClick={toggleUserMenu} />
              {isUserMenuOpen && (
                <ul className="absolute top-12 right-0 bg-white shadow border border-gray-200 py-2 w-60 rounded-md text-sm z-40">
                  {role === 'seller' ? (
                    <li onClick={() => handleUserMenuClick('/seller')} className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-[var(--color-accent)]">
                      Admin Panel
                    </li>
                  ) : (
                    <li onClick={() => handleUserMenuClick('/my-orders')} className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-[var(--color-accent)]">
                      My Orders
                    </li>
                  )}
                  <li onClick={() => handleUserMenuClick('logout')} className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-[var(--color-accent)]">
                    Logout
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Mobile hamburger toggle */}
        <button 
          aria-label="menu-btn" 
          type="button" 
          className="text-2xl inline-block md:hidden active:scale-90 transition-transform" 
          onClick={toggleMobileMenu}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed top-[70px] left-0 w-full bg-white shadow-lg z-10 transition-all duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="p-6">
          <ul className="flex flex-col space-y-1 text-lg text-[var(--color-accent)] font-medium">
            {/* Navigation Links */}
            {['home', 'services', 'offers', 'about', 'contact'].map((link) => (
              <li key={link}>
                <button 
                  onClick={() => handleNavClick(link)} 
                  className="text-left w-full cursor-pointer py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {link.charAt(0).toUpperCase() + link.slice(1)}
                </button>
              </li>
            ))}
            
            <li>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); navigate('/booking'); }} 
                className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
              >
                <FontAwesomeIcon icon={faShoppingCart} className="w-4" />
                <span>Booking</span>
              </button>
            </li>

            {/* Mobile Profile Section */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              {loading ? (
                <div className="w-32 h-6 bg-gray-200 animate-pulse rounded" />
              ) : !currentUser ? (
                <li>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}
                    className="cursor-pointer w-full py-3 px-4 rounded-lg bg-[var(--color-accent)] text-[var(--color-text)] font-medium text-center hover:scale-105 transition-transform shadow-md hover:shadow-lg"
                  >
                    Log In
                  </button>
                </li>
              ) : (
                <>
                  {/* Profile Header */}
                  <div className="flex items-center gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
                    <img 
                      src="/assets/user.png" 
                      alt="profile" 
                      className="w-12 h-12 rounded-full border border-gray-300" 
                    />
                    <div>
                      <span className="font-semibold text-gray-800 block">
                        {userName}
                      </span>
                      <span className="text-sm text-gray-600">
                        {currentUser.email}
                      </span>
                    </div>
                  </div>

                  {/* Profile Menu Items */}
                  <div className="space-y-1">
                    {role === 'seller' ? (
                      <li>
                        <button 
                          onClick={() => handleUserMenuClick('/seller')} 
                          className="flex items-center gap-3 text-left w-full cursor-pointer py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <FontAwesomeIcon icon={faCog} className="text-[var(--color-accent)] w-5" />
                          <span>Admin Panel</span>
                        </button>
                      </li>
                    ) : (
                      <li>
                        <button 
                          onClick={() => handleUserMenuClick('/my-orders')} 
                          className="flex items-center gap-3 text-left w-full cursor-pointer py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <FontAwesomeIcon icon={faBoxOpen} className="text-green-600 w-5" />
                          <span>My Orders</span>
                        </button>
                      </li>
                    )}
                    <li>
                      <button 
                        onClick={() => handleUserMenuClick('logout')} 
                        className="flex items-center gap-3 text-left w-full cursor-pointer py-3 px-4 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="w-5" />
                        <span>Logout</span>
                      </button>
                    </li>
                  </div>
                </>
              )}
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
