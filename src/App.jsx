import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import IdeaFeed from './components/IdeaFeed'
import AuthModal from './components/AuthModal'
import PostIdeaModal from './components/PostIdeaModal'
import UserProfile from './components/UserProfile'
import AdminDashboard from './components/AdminDashboard'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import './App.css'

const API_URL = '/api';

function AppContent() {
  const [showLogin, setShowLogin] = useState(false);
  const [showPostIdea, setShowPostIdea] = useState(false);
  const [editIdeaTemp, setEditIdeaTemp] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [currentView, setCurrentView] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('socho_theme') || 'light');
  const [dbError, setDbError] = useState(false);
  
  const { currentUser, totalUsers } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('socho_theme', theme);
  }, [theme]);
  
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const fetchIdeas = async () => {
    try {
      const res = await fetch(`${API_URL}/ideas`);
      if (!res.ok) throw new Error('Could not fetch');
      const data = await res.json();
      // Map MongoDB _id to id for the frontend seamlessly
      const mapped = data.map(i => ({ ...i, id: i._id || i.id }));
      setIdeas(mapped);
      setDbError(false);
    } catch (err) {
      console.error(err);
      setDbError(true);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const handlePostOrEditIdea = async (ideaData) => {
    try {
      if (editIdeaTemp) {
        // Editing existing idea
        const res = await fetch(`${API_URL}/ideas/${editIdeaTemp.id || editIdeaTemp._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ideaData)
        });
        if (res.ok) fetchIdeas();
      } else {
        // Creating new idea
        const ideaWithAuthor = {
          ...ideaData,
          author: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Anonymous',
          authorId: currentUser?.uid
        };
        const res = await fetch(`${API_URL}/ideas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ideaWithAuthor)
        });
        if (res.ok) fetchIdeas();
      }
      setEditIdeaTemp(null);
    } catch (err) {
      alert("Failed to save idea! Is MongoDB running?");
    }
  };

  const handleDeleteIdea = async (id) => {
    if(window.confirm("Are you sure you want to delete this idea?")) {
      try {
        const res = await fetch(`${API_URL}/ideas/${id}`, { method: 'DELETE' });
        if (res.ok) fetchIdeas();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLikeIdea = async (id) => {
    if (!currentUser) return setShowLogin(true);
    try {
      const res = await fetch(`${API_URL}/ideas/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: currentUser.uid })
      });
      if (res.ok) fetchIdeas();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentIdea = async (id, text) => {
    if (!currentUser) return setShowLogin(true);
    try {
      const commentPayload = {
        authorName: currentUser.displayName || currentUser.email.split('@')[0],
        authorEmail: currentUser.email,
        authorPhoto: currentUser.photoURL || '',
        authorId: currentUser.uid,
        text: text
      };
      const res = await fetch(`${API_URL}/ideas/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentPayload)
      });
      if (res.ok) fetchIdeas();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostClick = () => {
    if (currentUser) {
      setEditIdeaTemp(null);
      setShowPostIdea(true);
    } else {
      setShowLogin(true);
    }
  };

  const handleEditClick = (idea) => {
    setEditIdeaTemp(idea);
    setShowPostIdea(true);
  };

  const handleViewProfile = () => currentUser ? setCurrentView('profile') : setShowLogin(true);
  const handleViewAdmin = () => (currentUser?.email === 'jishivasingh2005@gmail.com') ? setCurrentView('admin') : setCurrentView('feed');

  return (
    <div className="app-container relative">
      <div className="hero-bg-blob"></div>
      
      {dbError && (
        <div style={{ padding: '12px', background: '#ff3b30', color: '#fff', textAlign: 'center', fontWeight: 'bold', zIndex: 1000, position: 'relative' }}>
          ⚠️ Server Connection Error! Please make sure the backend is running (`node server.js` in backend folder).
        </div>
      )}

      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onPostClick={handlePostClick}
        onSearch={setSearchQuery}
        onViewProfile={handleViewProfile}
        onAdminClick={handleViewAdmin}
        onHomeClick={() => { setCurrentView('feed'); setSearchQuery(''); }}
        currentView={currentView}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {currentView === 'feed' ? (
        <main className="container mt-4 anim d1" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
          
          {!searchQuery && (
            <div className="hero-section flex justify-between items-center" style={{ marginBottom: '3rem' }}>
              <div className="hero-text">
                <h1 className="serif" style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: '1.1', color: 'var(--text)' }}>
                  Got a wild idea? <br/>
                  <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Let's hear it.</span>
                </h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--muted)', maxWidth: '500px', lineHeight: '1.6' }}>
                  No matter how crazy, simple, or weird it sounds. This is your personal sandbox to drop thoughts, side-hustle concepts, and late-night epiphanies.
                </p>
              </div>
              
              <div className="hero-stats card anim d2" style={{ padding: '1.5rem 2rem', borderRadius: '16px', textAlign: 'center', backgroundColor: 'var(--surface)' }}>
                <p className="sans" style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Community</p>
                <h2 className="serif" style={{ fontSize: '2.8rem', margin: '0.5rem 0', color: 'var(--text)' }}>{ideas.length > 0 ? ideas.length + 3 : 0}</h2>
                <p className="sans" style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>minds sharing here</p>
              </div>
            </div>
          )}

          <IdeaFeed 
            ideas={ideas} 
            onDelete={handleDeleteIdea} 
            onEdit={handleEditClick}
            onLike={handleLikeIdea}
            onComment={handleCommentIdea}
            searchQuery={searchQuery}
            currentUser={currentUser}
          />
        </main>
      ) : currentView === 'admin' ? (
        <main className="container mt-4" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
          <AdminDashboard onBack={() => setCurrentView('feed')} />
        </main>
      ) : (
        <main className="container mt-4" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
          <UserProfile 
            ideas={ideas} 
            currentUser={currentUser} 
            onDelete={handleDeleteIdea} 
            onEdit={handleEditClick}
            onLike={handleLikeIdea} 
            onComment={handleCommentIdea}
          />
        </main>
      )}

      {showLogin && <AuthModal onClose={() => setShowLogin(false)} />}
      {showPostIdea && <PostIdeaModal onClose={() => { setShowPostIdea(false); setEditIdeaTemp(null); }} onSubmit={handlePostOrEditIdea} editData={editIdeaTemp} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
