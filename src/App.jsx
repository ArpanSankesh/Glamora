import React from 'react'
import NavBar from './Components/NavBar'
import Home from './Pages/Home'
import { Routes, Route } from 'react-router-dom'
import Services from './Pages/Services'
import Footer from './Components/Footer'


const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
      </Routes>
      <Footer />
      
    </>
  )
}

export default App