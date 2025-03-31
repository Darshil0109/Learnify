import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Navbar */}
            <nav className="relative z-10 border-b border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <img src="../src/assets/learnify.png" alt="learnify" className="h-12 w-12" />
                        </div>
                        {/* Desktop Menu */}
                        <div className="hidden sm:block">
                            <div className="flex items-center space-x-4">
                                <Link to="#" className="text-gray-600 hover:text-gray-900 px-3 py-2">Courses</Link>
                                <Link to="#" className="text-gray-600 hover:text-gray-900 px-3 py-2">About</Link>
                                <Link to="#" className="text-gray-600 hover:text-gray-900 px-3 py-2">Pricing</Link>
                                <Link to="/login">
                                    <button className="bg-sky-400 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-sky-500 transition">
                                        Get Started
                                    </button>
                                </Link>
                            </div>
                        </div>
                        {/* Hamburger Menu Icon */}
                        <div className="sm:hidden flex items-center">
                            <AiOutlineMenu 
                                className="h-6 w-6 cursor-pointer text-gray-700" 
                                onClick={toggleMenu} 
                            />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={toggleMenu}></div>
            <div className={`fixed top-0 left-0 w-64 h-full bg-white z-30 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                    <img src="../src/assets/learnify.png" alt="learnify" className="h-12 w-12" />
                    <AiOutlineClose 
                        className="h-6 w-6 cursor-pointer text-gray-700" 
                        onClick={toggleMenu} 
                    />
                </div>
                <div className="flex flex-col p-4 space-y-4">
                    <Link to="#" className="text-gray-600 hover:text-gray-900" onClick={toggleMenu}>Courses</Link>
                    <Link to="#" className="text-gray-600 hover:text-gray-900" onClick={toggleMenu}>About</Link>
                    <Link to="#" className="text-gray-600 hover:text-gray-900" onClick={toggleMenu}>Pricing</Link>
                    <Link to="/login" onClick={toggleMenu}>
                        <button className="bg-sky-400 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-sky-500 transition w-full">
                            Get Started
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Navbar;
