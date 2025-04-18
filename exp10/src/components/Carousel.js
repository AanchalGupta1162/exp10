import React, { useState, useEffect } from 'react';
import slide1 from '../assets/SHF_home-slide-1.jpg';
import slide2 from '../assets/pexels-ash-craig-122861-376464.jpg';
import slide3 from '../assets/Landing_image_Desktop.jpg';
import './Carousel.css'; // We'll create this CSS file next

function Carousel(){
    const slides = [
        { id: 1, image: slide1, alt: 'Delicious Food 1' },
        { id: 2, image: slide2, alt: 'Delicious Food 2' },
        { id: 3, image: slide3, alt: 'Delicious Food 3' },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    
    // Auto slideshow effect
    useEffect(() => {
        let slideshowInterval;
        if (!isPaused) {
            slideshowInterval = setInterval(() => {
                nextSlide();
            }, 3000); // Change slide every 3 seconds
        }
        
        // Clean up interval on component unmount
        return () => {
            clearInterval(slideshowInterval);
        };
    }, [currentIndex, isPaused]); // Re-run effect when currentIndex or isPaused changes

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    return (
        <div className="carousel" 
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}>
            <button className="carousel-button prev" onClick={prevSlide}>
                &#10094;
            </button>
            <div className="carousel-slide">
                <img
                    src={slides[currentIndex].image}
                    alt={slides[currentIndex].alt}
                    className="carousel-image"
                />
            </div>
            <button className="carousel-button next" onClick={nextSlide}>
                &#10095;
            </button>
            <div className="carousel-dots">
                {slides.map((slide, index) => (
                    <span 
                        key={slide.id}
                        className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default Carousel;