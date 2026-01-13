import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">EthioBank Receipts</Link>
      </div>
      <ul className="navbar-menu">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/extract">Extract</Link></li>
        <li><Link to="/banks">Banks</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
