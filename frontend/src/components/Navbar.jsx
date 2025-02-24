// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // Function to scroll to footer contact section
  const scrollToContact = (e) => {
    e.preventDefault();
    const contactSection = document.querySelector('#contactSection');
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <nav className="bg-[#2952E3] text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img 
              src="/api/placeholder/40/40"
              alt="College Logo"
              className="h-10 w-10"
            />
          </div>

          {/* Navigation Links */}
          <div className="flex items-center ml-6 space-x-8">
            <Link 
              to="/" 
              className="text-white text-lg hover:bg-blue-600 px-3 py-2 rounded-md"
            >
              Home
            </Link>
            <Link 
              to="/halls" 
              className="text-white text-lg hover:bg-blue-600 px-3 py-2 rounded-md"
            >
              Halls
            </Link>
           
          </div>

         
        </div>
      </div>
    </nav>
  );
};

export default Navbar;