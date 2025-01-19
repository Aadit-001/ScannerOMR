import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Main_logo.png';
import { AiOutlineUser } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <nav className="flex fixed z-50 top-0 left-0 right-0 backdrop-blur-md justify-between items-center p-4 bg-gray-800 text-white">
            <div className="flex items-center cursor-pointer" onClick={() => {navigate('/');window.location.reload()}}>
                <img src={logo} alt="Logo" className="h-12 w-16 " />
                <span className="text-xl font-bold ">OMR Checker</span>
            </div>
            <div className="flex items-center space-x-8">
                <Link to="/add-ans" className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Add Ans
                </Link>
                <Link to="/add-sub" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Add Sub
                </Link>
                <Link to="/profile">
                    <AiOutlineUser className="h-12 w-12 rounded-full" />
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
