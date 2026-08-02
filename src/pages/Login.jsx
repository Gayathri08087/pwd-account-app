import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import '../styles/index.css';

export default function Login() {
  const navigate = useNavigate();
  const { loginWithGoogle, loginWithEmail, signUpWithEmail, resetPassword } = useAuthStore();
  
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // 'login', 'signup', 'forgot'
  const [view, setView] = useState('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err.message || "Failed to sign in with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      if (view === 'login') {
        if (!password) throw new Error("Please enter your password.");
        await loginWithEmail(email, password);
        navigate('/');
      } else if (view === 'signup') {
        if (!password) throw new Error("Please enter a password.");
        if (password.length < 6) throw new Error("Password must be at least 6 characters.");
        await signUpWithEmail(email, password);
        navigate('/');
      } else if (view === 'forgot') {
        await resetPassword(email);
        setMessage("Password reset email sent. Please check your inbox.");
        setView('login');
        setPassword('');
      }
    } catch (err) {
      // Clean up Firebase error messages for the user
      let errMsg = err.message;
      if (err.code === 'auth/invalid-credential') errMsg = 'Invalid email or password.';
      if (err.code === 'auth/email-already-in-use') errMsg = 'An account with this email already exists.';
      if (err.code === 'auth/user-not-found') errMsg = 'No account found with this email.';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--navy-950)',
      background: 'radial-gradient(circle at top right, var(--navy-800), var(--navy-950))',
      color: 'var(--text-on-dark)'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '3rem',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          marginBottom: '0.5rem',
          background: 'linear-gradient(to right, var(--teal-400), var(--accent-blue))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          PWD Manager
        </h1>
        <p style={{ color: 'var(--text-on-dark-muted)', marginBottom: '2rem' }}>
          {view === 'login' && 'Sign in to your account'}
          {view === 'signup' && 'Create a new account'}
          {view === 'forgot' && 'Reset your password'}
        </p>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            color: 'var(--accent-rose)',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}
        
        {message && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--accent-green)',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-on-dark-muted)' }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(0, 0, 0, 0.2)',
                color: 'var(--text-on-dark)',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          
          {view !== 'forgot' && (
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-on-dark-muted)' }}>
                <span>Password</span>
                {view === 'login' && (
                  <button type="button" onClick={() => { setView('forgot'); setError(null); setMessage(null); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.75rem' }}>
                    Forgot?
                  </button>
                )}
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(0, 0, 0, 0.2)',
                  color: 'var(--text-on-dark)',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.875rem',
              backgroundColor: 'var(--primary)',
              color: 'var(--surface)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Processing...' : (
              view === 'login' ? 'Sign In' : view === 'signup' ? 'Create Account' : 'Send Reset Link'
            )}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <span style={{ padding: '0 1rem', color: 'var(--text-on-dark-muted)', fontSize: '0.875rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        </div>

        <button 
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            width: '100%',
            padding: '0.875rem',
            backgroundColor: 'var(--surface)',
            color: 'var(--text-primary)',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            opacity: isLoading ? 0.7 : 1
          }}
          onMouseOver={(e) => {
            if (!isLoading) e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            if (!isLoading) e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-on-dark-muted)' }}>
          {view === 'login' ? (
            <>
              Don't have an account?{' '}
              <button type="button" onClick={() => { setView('signup'); setError(null); setMessage(null); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600', padding: 0 }}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => { setView('login'); setError(null); setMessage(null); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600', padding: 0 }}>
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
