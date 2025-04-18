import React from 'react';
import './Footer.css'; // Optional: Create a CSS file for styling

function Footer() {
return (
    <footer className="footer">
        <div className="footer-container">
            <div className="footer-section">
                <h4>About RecipeMaster</h4>
                <p>
                    RecipeMaster is your ultimate destination for discovering and sharing delicious recipes from around the world.
                </p>
            </div>

            <div className="footer-section">
                <h4>Contact Us</h4>
                <p>Email: support@recipemaster.com</p>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} RecipeMaster. All Rights Reserved.</p>
                <div className="social-icons">
                    {/* Add your social media icons here (e.g., Font Awesome) */}
                    <a href="#" className="social-icon">
                        <i className="fab fa-facebook"></i>
                    </a>
                    <a href="#" className="social-icon">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="social-icon">
                        <i className="fab fa-instagram"></i>
                    </a>
                </div>
            </div>
        </div>
    </footer>
);
}

export default Footer;