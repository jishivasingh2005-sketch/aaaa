import React, { useState } from 'react';
import IdeaCard from './IdeaCard';
import { useAuth } from '../contexts/AuthContext';
import { Camera, Edit2 } from 'lucide-react';

const UserProfile = ({ ideas, currentUser, onDelete, onEdit, onLike, onComment }) => {
  const { updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.displayName || '');
  const [editPhoto, setEditPhoto] = useState(currentUser?.photoURL || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!currentUser) return null;

  const userIdeas = ideas.filter(i => i.authorId === currentUser.uid);
  const totalLikesReceived = userIdeas.reduce((sum, idea) => sum + (idea.likes || 0), 0);
  const initials = (n) => n ? n.split(' ').map(x => x[0]).join('').toUpperCase().slice(0,2) : '??';

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
       const reader = new FileReader();
       reader.onloadend = () => setEditPhoto(reader.result);
       reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await updateUserProfile(editName, editPhoto);
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <div className="user-profile anim d1">
      <div className="profile-header card relative" style={{ padding: '3rem 2rem', marginBottom: '3rem', textAlign: 'center', background: 'var(--surface)' }}>
        
        {!isEditing && (
          <button className="btn-ghost absolute" style={{ top: '1.5rem', right: '1.5rem' }} onClick={() => setIsEditing(true)} title="Edit Profile">
             <Edit2 size={18} />
          </button>
        )}

        {isEditing ? (
          <div className="edit-profile-form mx-auto flex flex-col items-center gap-4" style={{ maxWidth: '320px' }}>
            <div className="relative">
              <div className="avatar-lg mx-auto" style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'var(--accent2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#fff', overflow: 'hidden', border: '2px solid var(--border)' }}>
                {editPhoto ? <img src={editPhoto} alt="dp" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials(editName || currentUser.email)}
              </div>
              <label style={{ position: 'absolute', bottom: -5, right: -5, background: 'var(--accent)', color: '#fff', padding: '6px', borderRadius: '50%', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
                 <Camera size={16} />
                 <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
            </div>
            
            <div className="w-full text-left">
              <label className="label">Display Name</label>
              <input type="text" className="input" value={editName} onChange={e => setEditName(e.target.value)} />
            </div>

            <div className="flex gap-2 w-full mt-2">
               <button className="btn btn-outline w-full" onClick={() => setIsEditing(false)}>Cancel</button>
               <button className="btn btn-primary w-full" onClick={handleSaveProfile} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        ) : (
          <>
            <div className="avatar-lg mx-auto" style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'var(--accent2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: '500', color: '#fff', marginBottom: '1.2rem', fontFamily: 'var(--font-serif)', overflow: 'hidden', border: '2px solid var(--surface)', boxShadow: 'var(--shadow-sm)' }}>
              {currentUser.photoURL ? <img src={currentUser.photoURL} alt="dp" style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" /> : initials(currentUser.displayName || currentUser.email)}
            </div>
            <h2 className="serif" style={{ fontSize: '2.2rem', marginBottom: '0.2rem', color: 'var(--text)' }}>
              {currentUser.displayName || currentUser.email.split('@')[0]}
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>{currentUser.email}</p>
          </>
        )}
        
        <div className="stats-row flex justify-center" style={{ gap: '3.5rem', borderTop: '1px solid var(--border)', paddingTop: '2rem', maxWidth: '400px', margin: '0 auto', marginTop: isEditing ? '2rem' : '0' }}>
          <div className="stat-box">
            <h3 className="serif" style={{ fontSize: '2.2rem', color: 'var(--accent)' }}>{userIdeas.length}</h3>
            <p className="sans" style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Ideas Shared</p>
          </div>
          <div className="stat-box">
            <h3 className="serif" style={{ fontSize: '2.2rem', color: 'var(--accent3)' }}>{totalLikesReceived}</h3>
            <p className="sans" style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Upvotes</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', padding: '0 0.5rem' }}>
        <h3 className="serif" style={{ fontSize: '1.5rem', color: 'var(--text)' }}>Your Repository</h3>
      </div>
      
      {userIdeas.length > 0 ? (
        <div className="cards-grid">
           {userIdeas.map(idea => (
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
        </div>
      ) : (
        <div className="empty-state text-center anim d2" style={{ padding: '4rem', border: '2px dashed var(--border)', borderRadius: 'var(--radius)' }}>
           <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>✍️</p>
           <h4 className="serif" style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--text)' }}>Blank Canvas</h4>
           <p style={{ color: 'var(--muted)' }}>You haven't shared anything yet. Post your first idea to see it here!</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
