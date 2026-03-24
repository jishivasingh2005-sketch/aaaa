import React, { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import './Modal.css';

const CATEGORIES = ['Business Idea', 'Tech Idea', 'Startup Idea', 'College Project', 'Creative Idea'];

const PostIdeaModal = ({ onClose, onSubmit, editData }) => {
  const [title, setTitle] = useState(editData?.title || '');
  const [description, setDescription] = useState(editData?.description || '');
  const [category, setCategory] = useState(editData?.category || CATEGORIES[0]);
  const [tagsInput, setTagsInput] = useState(editData?.tags ? editData.tags.join(', ') : '');
  const [image, setImage] = useState(editData?.image || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
       const reader = new FileReader();
       reader.onloadend = () => {
         setImage(reader.result);
       };
       reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    
    onSubmit({
      title,
      description,
      category,
      tags: tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0),
      image
    });
    onClose();
  };

  return (
    <div className="modal-overlay anim d1">
      <div className="modal-content" style={{ width: '100%', maxWidth: '640px', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', padding: '2.5rem' }}>
        <div className="modal-header flex justify-between items-center mb-4 relative">
          <h2 className="serif" style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--text)' }}>
            {editData ? 'Edit Your Idea' : 'Share Your Idea'}
          </h2>
          <button className="btn-ghost absolute" style={{ top: '-1rem', right: '-1rem' }} onClick={onClose} type="button">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4 w-full">
            <div className="w-full">
              <label className="label">Idea Title</label>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g., AI resume builder" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="w-full">
              <label className="label">Hashtags (Optional)</label>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g., SaaS, AI, Mobile App" 
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="label">Category</label>
            <select 
              className="input" 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="label">Description</label>
            <textarea 
              className="textarea" 
              rows="5" 
              placeholder="Describe what problem it solves and how it works..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
             <label className="label flex items-center gap-2">
                <ImageIcon size={16} /> Attach Image (Optional)
             </label>
             {image ? (
               <div style={{ position: 'relative', marginBottom: '1rem', width: '100%', height: '180px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                 <img src={image} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                 <button type="button" onClick={() => setImage(null)} style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer', padding: '6px' }}>
                   <X size={16} />
                 </button>
               </div>
             ) : (
               <input 
                 type="file" 
                 accept="image/*" 
                 className="input" 
                 onChange={handleImageChange}
                 style={{ border: '2px dashed var(--border)', padding: '1rem', background: 'transparent' }}
               />
             )}
          </div>
          
          <div className="flex justify-end mt-4 gap-3">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 2rem' }}>
              {editData ? 'Save Changes' : 'Post Idea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostIdeaModal;
