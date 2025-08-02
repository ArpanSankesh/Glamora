import React from 'react'
import NavBar from './Components/NavBar'
import Hero from './Components/Hero'
import FeaturedServices from './Components/FeaturedServices'
import AboutSection from './Components/AboutSection'
import Testimonials from './Components/Testimonials'
import ContactSection from './Components/ContactSection'
import Footer from './Components/Footer'

const App = () => {
  return (
    <>
      <NavBar />
      <Hero />
      <FeaturedServices />
      <AboutSection />
      <Testimonials />
      <ContactSection />
      <Footer />
    </>
  )
}

export default App