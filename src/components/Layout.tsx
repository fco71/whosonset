// src/components/Layout.tsx
import React from 'react';
import '../styles/Layout.scss';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="layout">
            <div className="content">
                {children}
            </div>
        </div>
    );
};

export default Layout;