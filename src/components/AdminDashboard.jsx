import React, { useState, useEffect } from 'react';
import { Users, Lightbulb, Trash2, ArrowLeft, BarChart3, ShieldCheck } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = ({ onBack }) => {
  const [users, setUsers] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'ideas'
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, ideasRes] = await Promise.all([
        fetch('/api/auth/users'),
        fetch('/api/ideas')
      ]);
      const usersData = await usersRes.json();
      const ideasData = await ideasRes.json();
      setUsers(usersData);
      setIdeas(ideasData);
    } catch (err) {
      console.error('Admin Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const deleteUser = async (uid) => {
    if (!window.confirm("Are you sure you want to delete this user? All their login access will be removed.")) return;
    try {
      const res = await fetch(`/api/auth/users/${uid}`, { method: 'DELETE' });
      if (res.ok) fetchAdminData();
    } catch (err) { alert("Failed to delete user"); }
  };

  const deleteIdea = async (id) => {
    if (!window.confirm("Admin: Are you sure you want to delete this idea?")) return;
    try {
      const res = await fetch(`/api/ideas/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAdminData();
    } catch (err) { alert("Failed to delete idea"); }
  };

  const stats = [
    { label: 'Total Minds', value: users.length, icon: <Users size={24} />, color: '#6366F1' },
    { label: 'Total Ideas', value: ideas.length, icon: <Lightbulb size={24} />, color: '#F59E0B' },
    { label: 'Total Engagement', value: ideas.reduce((acc, current) => acc + (current.likes || 0) + (current.comments || 0), 0), icon: <BarChart3 size={24} />, color: '#10B981' }
  ];

  if (loading) return (
    <div className="admin-loading">
      <div className="loader"></div>
      <p>Initializing Control Center...</p>
    </div>
  );

  return (
    <div className="admin-dashboard anim d1">
      <header className="admin-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} /> Back to Socho
        </button>
        <div className="admin-title-area">
          <ShieldCheck size={32} color="#6366F1" />
          <h1>Admin Control Center</h1>
        </div>
      </header>

      <nav className="admin-nav">
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Minds ({users.length})</button>
        <button className={activeTab === 'ideas' ? 'active' : ''} onClick={() => setActiveTab('ideas')}>Ideas ({ideas.length})</button>
      </nav>

      <main className="admin-content">
        {activeTab === 'overview' && (
          <div className="admin-overview anim d2">
            <div className="stats-grid">
              {stats.map((s, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-icon" style={{ backgroundColor: `${s.color}20`, color: s.color }}>{s.icon}</div>
                  <div className="stat-info">
                    <p>{s.label}</p>
                    <h3>{s.value}</h3>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="admin-welcome-card card">
              <h3>System Health: <span style={{color: '#10B981'}}>Active</span></h3>
              <p>Welcome back, Administrator. You have full moderation access to all content and user accounts on the platform.</p>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-table-container anim d2">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mind</th>
                  <th>ID / Method</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.uid}>
                    <td>
                      <div className="table-user">
                        <div className="mini-avatar">{u.displayName?.[0] || 'U'}</div>
                        <div className="user-info">
                          <p className="name">{u.displayName}</p>
                          <p className="email">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td><code className="uid-code">{u.uid}</code></td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="action-btn delete" onClick={() => deleteUser(u.uid)} title="Delete User">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'ideas' && (
          <div className="admin-table-container anim d2">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Idea Title</th>
                  <th>Author</th>
                  <th>Likes / Comments</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {ideas.map(idea => (
                  <tr key={idea._id}>
                    <td><p className="idea-title">{idea.title}</p></td>
                    <td><p className="author">{idea.author}</p></td>
                    <td><p className="stats">{idea.likes} Likes • {idea.comments} Comments</p></td>
                    <td>
                      <button className="action-btn delete" onClick={() => deleteIdea(idea._id)} title="Moderate Idea">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
