import React from 'react'
import Hero from '../Components/Hero'
import FeaturedServices from '../Components/FeaturedServices'
import AboutSection from '../Components/AboutSection'
import ContactSection from '../Components/ContactSection'
import Banner from '../Components/Banner'
import Testimonials from '../Components/Testimonials'


const Home = () => (
  <>
    <Hero />
    <Banner />
    <FeaturedServices />
    <AboutSection />
    <Testimonials />
    <ContactSection />
  </>
)

export default Home
