import React from 'react';
import { Linkedin, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-area">
      <div className="container footer-inner flex justify-between items-center">
        <div className="footer-left">
          <p className="footer-text">
            © {new Date().getFullYear()} Socho. Made with <Heart size={14} className="heart-icon" /> by <span className="author-name">Shiva Singh</span>
          </p>
        </div>
        <div className="footer-right flex items-center gap-4">
          <a 
            href="https://www.linkedin.com/in/jishivasingh2005" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-social-link"
          >
            <Linkedin size={20} />
            <span>Connect on LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
