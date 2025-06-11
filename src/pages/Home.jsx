import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Past from '../components/Past';
import Services from '../components/Services';
import Footer from '../components/Footer';
import Contact from '../components/contact';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay (you can replace this with real data fetching)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Navbar />
      <Hero />
      <Services />
      <Past />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
