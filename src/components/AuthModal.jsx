import React, { useState } from 'react';
import { X, User, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Modal.css';

const AuthModal = ({ onClose }) => {
  const [view, setView] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { signInWithGoogle, loginWithEmail, signUpWithEmail, resetPassword } = useAuth();

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (view === 'login') {
        await loginWithEmail(email, password);
        onClose();
      } else if (view === 'signup') {
        await signUpWithEmail(name, email, password);
        onClose();
      } else if (view === 'forgot') {
        await resetPassword(email, password); // reuse password field for new password
        setSuccess('Password updated successfully! You can now log in.');
        setTimeout(() => setView('login'), 2000);
      }
    } catch (err) {
      const code = err.error || err.code;
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password') {
        setError('Invalid email or password. (Note: Old accounts may need a password reset due to new security updates)');
      } else if (code === 'auth/email-already-in-use') {
        setError('Email is already registered. Please login.');
      } else if (code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else if (err.error === 'User not found' && view === 'forgot') {
        setError('No account found with this email.');
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content glass-panel relative stagger-1" style={{ maxWidth: '420px' }}>
        <button className="btn-ghost absolute" style={{ top: '1rem', right: '1rem' }} onClick={onClose}>
          <X size={24} />
        </button>

        <div className="text-center" style={{ marginBottom: '1.5rem', marginTop: '0.5rem' }}>
          <div className="logo-icon mx-auto" style={{ width: '48px', height: '48px', marginBottom: '1rem' }}>
             <User size={24} color="#818cf8" />
          </div>
          <h2 className="text-gradient">
            {view === 'login' ? 'Welcome Back' : view === 'signup' ? 'Join Socho' : 'Reset Password'}
          </h2>
          <p className="text-sm" style={{ marginTop: '0.5rem' }}>
            {view === 'login' ? 'Log in to share and explore ideas' : view === 'signup' ? 'Create your free account' : 'Enter your email and new password'}
          </p>
        </div>

        {view !== 'forgot' && (
          <>
            <button
              className="btn btn-secondary w-full"
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{ justifyContent: 'center', gap: '0.75rem', padding: '0.75rem', marginBottom: '1.5rem', borderRadius: '10px' }}
            >
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              Continue with Google
            </button>

            <div className="divider" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <hr style={{ flex: 1, borderColor: 'var(--glass-border)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>OR</span>
              <hr style={{ flex: 1, borderColor: 'var(--glass-border)' }} />
            </div>
          </>
        )}

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#f87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {success && (
          <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#34d399', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {view === 'signup' && (
            <div>
              <label className="label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input type="text" className="input" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ paddingLeft: '2.75rem' }} />
              </div>
            </div>
          )}

          <div>
             <label className="label">Email Address</label>
             <div style={{ position: 'relative' }}>
               <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
               <input type="email" className="input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ paddingLeft: '2.75rem' }} />
             </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="label">{view === 'forgot' ? 'New Password' : 'Password'}</label>
              {view === 'login' && (
                <span 
                  onClick={() => setView('forgot')}
                  style={{ fontSize: '0.75rem', color: 'var(--accent)', cursor: 'pointer', fontWeight: '500' }}
                >
                  Forgot Password?
                </span>
              )}
            </div>
            <div style={{ position: 'relative' }}>
               <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
               <input type="password" className="input" placeholder={view === 'login' ? '••••••••' : 'Min. 6 characters'} value={password} onChange={(e) => setPassword(e.target.value)} required style={{ paddingLeft: '2.75rem' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ padding: '0.85rem', marginTop: '0.5rem' }}>
            {loading ? 'Please wait...' : (view === 'login' ? 'Log In' : view === 'signup' ? 'Create Account' : 'Reset My Password')}
          </button>
        </form>

        <div className="text-center" style={{ marginTop: '1.5rem' }}>
          <p className="text-sm" style={{ cursor: 'pointer' }} onClick={() => { setView(view === 'login' ? 'signup' : 'login'); setError(''); setSuccess(''); }}>
            {view === 'login' ? "Don't have an account? " : view === 'signup' ? "Already have an account? " : "Go back to "}
            <span style={{ color: 'var(--accent-neon)', fontWeight: '600' }}>
              {view === 'login' ? 'Sign up' : 'Log in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
