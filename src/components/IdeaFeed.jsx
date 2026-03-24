import React, { useState } from 'react';
import IdeaCard from './IdeaCard';
import './IdeaFeed.css';

const CAT_META = {
  'Tech Idea':      { badge: 'b-tech',     card: 'cat-tech',     emoji: '💻' },
  'Business Idea':  { badge: 'b-business', card: 'cat-business', emoji: '💼' },
  'Startup Idea':   { badge: 'b-startup',  card: 'cat-startup',  emoji: '🚀' },
  'College Project':{ badge: 'b-college',  card: 'cat-college',  emoji: '🎓' },
  'Creative Idea':  { badge: 'b-creative', card: 'cat-creative', emoji: '🎨' },
};

const ALL_CATS = ['All', ...Object.keys(CAT_META)];

const IdeaFeed = ({ ideas = [], onDelete, onEdit, searchQuery = '', onLike, onComment, currentUser }) => {
  const [active, setActive] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'top'

  // Filter Categories
  let filtered = active === 'All' ? ideas : ideas.filter(i => i.category === active);
  
  // Search Filter
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(i => 
      i.title.toLowerCase().includes(q) || 
      i.description.toLowerCase().includes(q) ||
      (i.tags && i.tags.some(tag => tag.toLowerCase().includes(q)))
    );
  }

  // Sort Logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    } else {
      return (b.likes || 0) - (a.likes || 0);
    }
  });

  return (
    <div className="feed-layout">
      <aside className="sidebar anim d1">
        <p className="sidebar-title">Categories</p>
        <ul className="cat-list">
          {ALL_CATS.map(cat => (
            <li key={cat}>
              <button className={`cat-btn ${active === cat ? 'active' : ''}`} onClick={() => setActive(cat)}>
                {CAT_META[cat] ? `${CAT_META[cat].emoji} ${cat}` : '✨ All Ideas'}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div className="cards-area">
        <div className="feed-header flex justify-between items-center" style={{ marginBottom: '1.5rem', padding: '0 0.5rem' }}>
          <h3 className="serif" style={{ fontSize: '1.2rem', color: 'var(--muted)' }}>
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Explore Discoveries'}
          </h3>
          <select className="input" style={{ width: 'auto', padding: '0.4rem 1.5rem 0.4rem 0.8rem', fontSize: '0.85rem' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
             <option value="newest">Latest Feed</option>
             <option value="top">Top Rated</option>
          </select>
        </div>
        
        <div className="cards-grid">
          {sorted.map(idea => (
            <IdeaCard 
              key={idea.id} 
              idea={idea} 
              onDelete={onDelete} 
              onEdit={onEdit}
              onLike={onLike} 
              onComment={onComment}
              currentUser={currentUser} 
            />
          ))}
          {sorted.length === 0 && (
            <div className="empty-state anim d1">
              <p style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌱</p>
              <h3 className="serif" style={{ marginBottom: '0.5rem' }}>No ideas match</h3>
              <p style={{ color: 'var(--muted)' }}>Try adjusting your filters, searching differently, or be the first to share one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaFeed;
