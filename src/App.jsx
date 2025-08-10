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


const App = () => {
  return (
    <>
      <NavBar />
    {/* <PopUpBanner /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/package" element={<Packages />} />
        <Route path="/product/:id" element={<Products />} />
      </Routes>
      <Footer />
      
    </>
  )
}

export default App