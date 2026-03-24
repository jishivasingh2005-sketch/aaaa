import React from 'react';
import { Lightbulb, Search, Plus, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = ({ onPostClick, onLoginClick, onSearch, onViewProfile, onHomeClick, currentView, theme, toggleTheme }) => {
  const { currentUser, logout } = useAuth();

  const initials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';

  return (
    <header className="navbar">
      <div className="container navbar-inner flex justify-between items-center">
        
        {/* Logo */}
        <div className="logo flex items-center gap-2" onClick={onHomeClick}>
          <div className="logo-mark">
            <Lightbulb size={20} color="#fff" />
          </div>
          <h1 className="logo-text">Socho<span style={{color: 'var(--accent)'}}>.</span></h1>
        </div>

        {/* Search */}
        <div className="search-bar hidden md-flex">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search ideas, topics, or keywords..." 
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="nav-actions flex items-center">
          <button className="btn btn-ghost hidden md-flex" onClick={toggleTheme} title="Toggle Dark Mode" style={{ padding: '0.4rem', color: 'var(--text)', marginRight: '0.5rem' }}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          {currentUser && currentUser.email === 'jishivasingh2005@gmail.com' && (
            <div className="hidden md-flex" style={{ padding: '0.4rem 1rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent)', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem', marginRight: '0.5rem', border: '1px solid rgba(99, 102, 241, 0.3)' }} title="Only visible to Admins">
              🛡️ Total Users: {useAuth().totalUsers}
            </div>
          )}
          
          {currentUser ? (
            <>
              <button className="btn btn-primary" onClick={onPostClick}>
                <Plus size={16} /> Post Idea
              </button>
              <div 
                className="user-pill" 
                title="Your Dashboard" 
                onClick={onViewProfile} 
                style={{ 
                  cursor: 'pointer', 
                  border: currentView === 'profile' ? '1px solid var(--accent)' : '1px solid var(--border)',
                  background: currentView === 'profile' ? 'var(--surface)' : 'transparent'
                }}
              >
                {currentUser.photoURL
                  ? <img src={currentUser.photoURL} alt="avatar" className="avatar-img" referrerPolicy="no-referrer" />
                  : <div className="avatar-fallback">{initials(currentUser.displayName || currentUser.email)}</div>
                }
                <span className="user-label">{currentUser.displayName || currentUser.email.split('@')[0]}</span>
              </div>
              <button 
                className="btn btn-outline" 
                onClick={logout} 
                title="Log Out of your account"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: 'transparent', color: 'var(--muted)', padding: '0.4rem 0.6rem' }}
              >
                <LogOut size={16} /> 
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={toggleTheme} title="Toggle Dark Mode" style={{ padding: '0.4rem', color: 'var(--text)' }}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className="btn btn-ghost" onClick={onLoginClick}>Sign In</button>
              <button className="btn btn-primary" onClick={onLoginClick}>Join Now</button>
            </>
          )}
        </div>
        
      </div>
    </header>
  );
};

export default Navbar;
