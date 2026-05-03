import React from 'react';
import './App.css';
import Header from './components/layout/Header';
import Hero from './components/home/Hero';
import Sandbox from './components/sandbox/Sandbox';
import Footer from './components/layout/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <Sandbox />
      </main>
      <Footer />
    </div>
  );
}

export default App;
