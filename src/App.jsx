import React from 'react'
import NavBar from './Components/NavBar'
import Home from './Pages/Home'
import { Routes, Route } from 'react-router-dom'
import Services from './Pages/Services'
import Footer from './Components/Footer'
import About from './Pages/About'


const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
      
    </>
  )
}

export default App