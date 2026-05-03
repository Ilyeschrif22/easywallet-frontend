import React from 'react';

const Hero = () => {
    return (
        <section className="hero">
            <h1>Next-gen<br /><span>virtual payments</span></h1>
            <div className="hero-actions">
                <a href="#sandbox" className="btn btn-accent">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M5 6.5l1.5 1.5L8.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                            strokeLinejoin="round" />
                    </svg>
                    Open sandbox
                </a>
                <a href="#" className="btn btn-ghost">Get Postman collection</a>
            </div>
        </section>
    );
};

export default Hero;
