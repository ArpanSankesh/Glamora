import React from 'react'
import NavBar from './Components/NavBar'
import Hero from './Components/Hero'

const App = () => {
  return (
    <>
      <NavBar />
      <Hero />
      <div className='w-full h-screen bg-red-300 opacity-50'></div>
    </>
  )
}

export default App