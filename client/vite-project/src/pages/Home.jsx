import React from 'react';

import Products from '../components/Products';
import About from '../components/About';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';

const Home = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <Products />
            <About />
            <Footer />
        </>
    );
};

export default Home;
