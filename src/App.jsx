import React from 'react'
import NavBar from './Components/NavBar'
import Hero from './Components/Hero'

const App = () => {
  return (
    <>
      <NavBar />
      <Hero />
      <div className='w-full h-screen opacity-50'></div>
    </>
  )
}

export default App