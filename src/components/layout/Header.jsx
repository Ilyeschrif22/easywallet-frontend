import React from 'react';

const Header = () => {
    return (
        <header>
            <div className="logo">
                EasyWallet
            </div>
            <nav>
                <a href="#">Features</a>
                <a href="#sandbox">Sandbox</a>
                <a href="#">Docs</a>
                <a href="#">GitHub</a>
            </nav>
        </header>
    );
};

export default Header;
