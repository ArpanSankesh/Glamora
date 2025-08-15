import React from 'react'
import NavBar from './Components/NavBar'
import Home from './Pages/Home'
import { Routes, Route } from 'react-router-dom'
import Services from './Pages/Services'
import Footer from './Components/Footer'
import About from './Pages/About'
import Booking from './Pages/Booking'
import PopUpBanner from './Components/PopUpBanner'
import Products from './Pages/Products'
import Contact from './Pages/Contact'
import PrivacyPolicy from './Pages/PrivacyPolicy';
import TermsAndConditions from './Pages/TermsAndConditions';
import ScrollToTop from './Components/ScrollToTop'
import Banner from './Components/banner'
import PackageDetails from './Pages/PackageDetails'


const App = () => {
  return (
    <>
      <NavBar />
      <ScrollToTop />
      
      {/* <PopUpBanner /> */}
      {/* <Banner /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:type/:id" element={<Products />} />
       <Route path="/package/:id" element={<PackageDetails />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App