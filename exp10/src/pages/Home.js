import React from 'react';
import Spline from '@splinetool/react-spline';
import '../styles/Home.css'; // We'll create this CSS file next

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-header">
        <h2>Welcome to Recipe Master!</h2>
      </div>
      <div className="spline-container">
        <Spline scene="https://prod.spline.design/BaAFMglSU6DoXsry/scene.splinecode" />
      </div>
    </div>
  );
}

