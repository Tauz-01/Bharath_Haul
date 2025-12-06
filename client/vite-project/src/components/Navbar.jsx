import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsOpen(false);
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">

                    <div className="font-bold text-2xl">
                        Logo
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                        >
                            Home
                        </Link>
                        <button
                            onClick={() => scrollToSection('products')}
                            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                        >
                            Products
                        </button>
                        <button
                            onClick={() => scrollToSection('about')}
                            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                        >
                            About
                        </button>
                        <Link
                            to="/login"
                            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
                        >
                            Sign Up
                        </Link>
                    </div>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-gray-700 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {isOpen && (
                    <div className="md:hidden pb-4">
                        <div className="flex flex-col space-y-3">
                            <Link
                                to="/"
                                onClick={() => setIsOpen(false)}
                                className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-left"
                            >
                                Home
                            </Link>
                            <button
                                onClick={() => scrollToSection('products')}
                                className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-left"
                            >
                                Products
                            </button>
                            <button
                                onClick={() => scrollToSection('about')}
                                className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-left"
                            >
                                About
                            </button>
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-left"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                onClick={() => setIsOpen(false)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md text-left"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
