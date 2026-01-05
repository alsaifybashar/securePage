import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import BackgroundAnimation from './BackgroundAnimation';

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <BackgroundAnimation />
            <Navigation />
            <main className="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
