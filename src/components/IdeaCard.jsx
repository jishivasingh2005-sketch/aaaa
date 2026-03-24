import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Trash2, Smile, Edit2, Share2, Linkedin } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import './IdeaFeed.css';

const CAT_META = {
  'Tech Idea':      { badge: 'b-tech',     card: 'cat-tech',     emoji: '💻' },
  'Business Idea':  { badge: 'b-business', card: 'cat-business', emoji: '💼' },
  'Startup Idea':   { badge: 'b-startup',  card: 'cat-startup',  emoji: '🚀' },
  'College Project':{ badge: 'b-college',  card: 'cat-college',  emoji: '🎓' },
  'Creative Idea':  { badge: 'b-creative', card: 'cat-creative', emoji: '🎨' },
};

const IdeaCard = ({ idea, onDelete, onEdit, onLike, onComment, currentUser }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const meta = CAT_META[idea.category] || { badge: '', card: 'cat-default', emoji: '💡' };
  const initials = (n) => n ? n.split(' ').map(x => x[0]).join('').toUpperCase().slice(0,2) : '??';

  const isAuthor = currentUser && (
    currentUser.uid === idea.authorId || 
    currentUser.displayName === idea.author ||
    (currentUser.email && currentUser.email.split('@')[0] === idea.author)
  );

  const likedBy = idea.likedBy || [];
  const hasLiked = currentUser && likedBy.includes(currentUser.uid);

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    if (!currentUser) return alert('Please log in to comment');
    onComment(idea.id, commentText);
    setCommentText('');
  };

  const handleShare = () => {
    const url = `${window.location.origin}?idea=${idea.id}`;
    navigator.clipboard.writeText(`Check out this idea: "${idea.title}" on Socho!\n${url}`);
    alert('Link copied to clipboard! Ready to share.');
  };

  return (
    <div className={`idea-card anim d2 ${meta.card}`}>
      <div className="card-top">
        <span className={`cat-badge ${meta.badge}`}>{meta.emoji} {idea.category}</span>
        <div className="flex items-center gap-1">
          {isAuthor && onEdit && (
            <button className="stat-btn" onClick={() => onEdit(idea)} title="Edit Idea" style={{ color: 'var(--muted)' }}>
              <Edit2 size={16} />
            </button>
          )}
          {isAuthor && onDelete && (
            <button className="stat-btn hover-delete" onClick={() => onDelete(idea.id)} title="Delete Idea">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
      <h3 className="card-title" style={{ marginTop: '0.5rem' }}>{idea.title}</h3>
      
      {idea.image && (
        <div style={{ width: '100%', maxHeight: '350px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginTop: '0.5rem' }}>
          <img src={idea.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Attachment" />
        </div>
      )}
      
      <p className="card-desc" style={{ marginTop: idea.image ? '0.8rem' : '0' }}>{idea.description}</p>
      
      {idea.tags && idea.tags.length > 0 && (
        <div className="flex" style={{ gap: '0.4rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
          {idea.tags.map(tag => (
            <span key={tag} className="sans" style={{ fontSize: '0.75rem', background: 'var(--bg)', color: 'var(--muted)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', fontWeight: '500' }}>
              #{tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="card-footer">
        <div className="card-author">
          <div className="mini-avatar">{initials(idea.author)}</div>
          <span className="author-name">{idea.author}</span>
        </div>
        <div className="card-stats">
          <button
            className={`stat-btn ${hasLiked ? 'liked' : ''}`}
            onClick={() => onLike(idea.id)}
            title={hasLiked ? "Unlike" : "Upvote"}
          >
            <ThumbsUp size={14} /> {idea.likes || 0}
          </button>
          <button className="stat-btn" onClick={() => setShowComments(!showComments)}>
            <MessageSquare size={14} /> {idea.commentsList?.length || idea.comments || 0}
          </button>
          <button className="stat-btn" onClick={handleShare} title="Copy Link to Clipboard">
            <Share2 size={14} />
          </button>
          
          <a 
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '?idea=' + idea.id)}&title=${encodeURIComponent(idea.title)}&summary=${encodeURIComponent(idea.description)}`}
            target="_blank" 
            rel="noreferrer" 
            className="stat-btn share-linkedin"
            title="Share on LinkedIn"
            style={{ color: '#0077b5' }}
          >
            <Linkedin size={14} />
          </a>
        </div>
      </div>

      {showComments && (
        <div className="comments-section anim d1" style={{ borderTop: '1px dashed var(--border)', paddingTop: '1.2rem', marginTop: '1.2rem' }}>
          <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {(idea.commentsList || []).map(c => (
               <div key={c.id} className="comment-item flex" style={{ gap: '0.8rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border)', alignItems: 'flex-start' }}>
                 <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: '600', flexShrink: 0, overflow: 'hidden' }}>
                    {c.authorPhoto ? (
                       <img src={c.authorPhoto} alt="dp" style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                    ) : (
                       initials(c.authorName || c.authorEmail || '??')
                    )}
                 </div>
                 <div>
                   <strong className="sans" style={{ color: 'var(--text)', display: 'block', marginBottom: '0.15rem', fontSize: '0.85rem', fontWeight: '600' }}>{c.authorName}</strong>
                   <span style={{ color: 'var(--text)', opacity: 0.85, lineHeight: 1.4, fontSize: '0.85rem' }}>{c.text}</span>
                 </div>
               </div>
            ))}
            {(!idea.commentsList || idea.commentsList.length === 0) && (
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', textAlign: 'center', padding: '0.5rem 0' }}>No comments yet. Start the discussion!</p>
            )}
          </div>
          
          <div className="comment-input-area flex items-center gap-2 relative">
            <div style={{ position: 'relative' }}>
              <button 
                className="btn btn-ghost" 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                style={{ padding: '0.4rem', color: 'var(--muted)' }}
                disabled={!currentUser}
                title="Add Emoji"
              >
                <Smile size={20} />
              </button>
              {showEmojiPicker && currentUser && (
                <div style={{ position: 'absolute', bottom: 'calc(100% + 5px)', left: '0', zIndex: 100, boxShadow: 'var(--shadow-md)', borderRadius: '12px' }}>
                  <EmojiPicker 
                    onEmojiClick={(e) => {
                      setCommentText(prev => prev + e.emoji);
                      setShowEmojiPicker(false);
                    }} 
                    theme="light"
                    searchDisabled={true}
                    skinTonesDisabled={true}
                    width={280}
                    height={320}
                  />
                </div>
              )}
            </div>
            
            <input 
              type="text" 
              className="input" 
              placeholder="Add your thoughts..." 
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePostComment()}
              style={{ padding: '0.6rem 1rem', fontSize: '0.9rem', borderRadius: 'var(--radius-full)' }}
              disabled={!currentUser}
            />
            {currentUser ? (
              <button className="btn btn-primary" onClick={handlePostComment} style={{ padding: '0.6rem 1.2rem' }}>Post</button>
            ) : (
              <button className="btn btn-outline" onClick={() => alert('Please sign in to comment.')} style={{ padding: '0.6rem 1.2rem', borderColor: 'transparent' }}>Sign In</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaCard;
