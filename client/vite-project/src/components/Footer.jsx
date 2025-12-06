import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaGoogle, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {

    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">

                    <div className="mb-6 md:mb-0 text-center md:text-left">
                        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">ShopBrand</h3>
                        <p className="text-gray-400 max-w-xs mx-auto md:mx-0">
                            Your one-stop destination for premium products and exceptional service.
                        </p>
                    </div>

                    <div className="flex space-x-6">
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                            <FaFacebookF />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-400 transition-colors duration-300">
                            <FaTwitter />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors duration-300">
                            <FaInstagram />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-500 transition-colors duration-300">
                            <FaGoogle />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-700 transition-colors duration-300">
                            <FaLinkedinIn />
                        </a>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} ShopBrand. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
