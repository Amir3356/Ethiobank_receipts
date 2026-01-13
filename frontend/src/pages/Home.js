import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>EthioBank Receipts</h1>
        <p>Extract structured bank receipt data from Ethiopian banks</p>
        <Link to="/extract" className="btn-primary">
          Start Extracting
        </Link>
      </section>

      <section className="features">
        <div className="feature">
          <h3>Multiple Banks</h3>
          <p>Support for CBE, Dashen, Awash, BOA, Zemen, and Telebirr</p>
        </div>
        <div className="feature">
          <h3>Fast Extraction</h3>
          <p>Get structured data from receipts in seconds</p>
        </div>
        <div className="feature">
          <h3>Easy to Use</h3>
          <p>Simple interface for quick receipt processing</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
