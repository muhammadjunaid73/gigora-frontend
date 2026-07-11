import { Link } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#1E3A5F] sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-black text-[#FFFFFF] tracking-wider cursor-pointer">
              GIGORA
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8 font-medium">
            <a href="#features" className="text-[#FFFFFF] hover:text-[#EFF6FF] transition duration-200">Features</a>
            <a href="#pricing" className="text-[#FFFFFF] hover:text-[#EFF6FF] transition duration-200">Pricing</a>
          </div>

          {/* Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* ✓ Button ko Link se change kar diya */}
            <Link to="/login" className="text-[#FFFFFF] hover:text-[#EFF6FF] font-medium transition">
              Login
            </Link>
            <button className="bg-[#1A56DB] text-[#FFFFFF] px-5 py-2 rounded-md font-medium hover:bg-[#1E3A5F] transition duration-200 shadow-md">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} type="button" className="text-[#FFFFFF] hover:text-[#EFF6FF] focus:outline-none">
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#1E3A5F] border-t border-[#EFF6FF] px-2 pt-2 pb-4 space-y-1">
          <a href="#features" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-[#FFFFFF] hover:bg-[#1A56DB]">Features</a>
          <a href="#pricing" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-[#FFFFFF] hover:bg-[#1A56DB]">Pricing</a>
          <div className="pt-4 border-t border-[#EFF6FF] flex flex-col space-y-2 px-3">
            {/* ✓ Mobile view ke button ko bhi Link se change kar diya */}
            <Link to="/login" onClick={() => setIsOpen(false)} className="text-[#FFFFFF] hover:text-[#EFF6FF] font-medium text-left">
              Login
            </Link>
            <button className="w-full bg-[#1A56DB] text-[#FFFFFF] px-4 py-2 rounded-md font-medium hover:bg-[#1E3A5F] transition">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;