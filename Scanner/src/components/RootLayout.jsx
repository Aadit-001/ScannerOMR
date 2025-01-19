import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <Outlet />
        </div>
    );
};

export default RootLayout;
