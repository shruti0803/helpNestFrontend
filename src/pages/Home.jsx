import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Past from '../components/Past'
import Services from '../components/Services'
import Footer from '../components/Footer'
import Contact from '../components/contact'

const Home = () => {
  return (
    <div >
     
     <Hero/>
     <Services/>
     <Past/>
     <Contact/>
    </div>
  )
}

export default Home
