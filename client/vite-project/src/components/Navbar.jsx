import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-black p-2`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className={`text-2xl tracking-tighter `}>
                    <span className='text-red-500'> Bharath</span><span className='text-white'>Haul</span>
                </Link>

                <div className="hidden md:flex space-x-8 items-center">
                    {!user && ['Home', 'Features', 'How it Works'].map((item) => (
                        <Link
                            key={item}
                            to={`#${item.toLowerCase().replace(/\s/g, '')}`}
                            className={`hover:text-blue-500 transition-colors `}
                        >
                            {item}
                        </Link>
                    ))}

                    {user ? (
                        <>
                            <span className={`font-medium text-white`}>
                                Hello, {user.name}
                            </span>
                            <Link
                                to="/dashboard"
                                className={`text-white hover:text-blue-500 transition-colors `}
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className={`text-white border border-red-500 hover:bg-red-500 hover:text-white px-5 py-2 rounded transition-all `}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/signup" className={`text-white hover:text-blue-500 transition`}>
                                Signup
                            </Link>

                            <Link to="/login" className={`text-white hover:text-blue-500 transition`}>
                                Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
