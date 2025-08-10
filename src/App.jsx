import React from 'react'
import NavBar from './Components/NavBar'
import Home from './Pages/Home'
import { Routes, Route } from 'react-router-dom'
import Services from './Pages/Services'
import Footer from './Components/Footer'
import About from './Pages/About'
import Booking from './Pages/Booking'
import PopUpBanner from './Components/PopUpBanner'
import Packages from './Pages/Packages'
import Products from './Pages/Products'
import Contact from './Pages/Contact'
import PrivacyPolicy from './Pages/PrivacyPolicy';
import TermsAndConditions from './Pages/TermsAndConditions';
import ScrollToTop from './Components/ScrollToTop'


const App = () => {
  return (
    <>
      <NavBar />
      <ScrollToTop />
      {/* <PopUpBanner /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/package" element={<Packages />} />
        <Route path="/product/:id" element={<Products />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App