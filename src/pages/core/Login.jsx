import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';
import '../../styles/index.css';

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
      background: 'transparent',
    }}>
      {/* Login Card */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        padding: '2.75rem 2.5rem',
        borderRadius: '18px',
        boxShadow: '0 8px 40px rgba(30, 41, 59, 0.13), 0 0 0 1px rgba(226,232,240,0.9)',
        textAlign: 'center',
        maxWidth: '420px',
        width: '90%',
        position: 'relative',
      }}>

        {/* Top teal accent bar */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #2cc9b8, #3b82f6)',
          borderRadius: '18px 18px 0 0',
        }} />

        {/* Logo / Icon */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '54px',
          height: '54px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #2cc9b8, #158f81)',
          marginBottom: '1rem',
          boxShadow: '0 4px 16px rgba(26,173,156,0.35)',
          fontSize: '1.4rem',
          fontWeight: 900,
          color: '#fff',
          letterSpacing: '-1px',
        }}>
          PWD
        </div>

        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 900,
          marginBottom: '0.35rem',
          background: 'linear-gradient(135deg, #1aad9c, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.04em',
        }}>
          PWD Manager
        </h1>
        <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 500 }}>
          {view === 'login' && 'Sign in to your account'}
          {view === 'signup' && 'Create a new account'}
          {view === 'forgot' && 'Reset your password'}
        </p>

        {error && (
          <div style={{
            background: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            fontSize: '0.875rem',
            textAlign: 'left',
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            fontSize: '0.875rem',
            textAlign: 'left',
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.45rem', color: '#475569', letterSpacing: '0.01em' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '0.7rem 0.9rem',
                borderRadius: '10px',
                border: '1.5px solid #e2e8f0',
                background: '#f8fafc',
                color: '#1e293b',
                outline: 'none',
                fontSize: '0.9rem',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#1aad9c'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              required
            />
          </div>

          {view !== 'forgot' && (
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.45rem', color: '#475569' }}>
                <span>Password</span>
                {view === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setView('forgot'); setError(null); setMessage(null); }}
                    style={{ background: 'none', border: 'none', color: '#1aad9c', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, padding: 0, minHeight: 'auto', boxShadow: 'none' }}
                    onMouseOver={e => { e.currentTarget.style.textDecoration = 'underline'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                    onMouseOut={e => { e.currentTarget.style.textDecoration = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                  >
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
                  padding: '0.7rem 0.9rem',
                  borderRadius: '10px',
                  border: '1.5px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#1e293b',
                  outline: 'none',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = '#1aad9c'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.85rem',
              background: isLoading ? '#94a3b8' : 'linear-gradient(135deg, #1aad9c, #158f81)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '0.25rem',
              boxShadow: isLoading ? 'none' : '0 4px 14px rgba(26,173,156,0.35)',
              transition: 'all 0.2s ease',
              letterSpacing: '0.01em',
            }}
            onMouseOver={e => { if (!isLoading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseOut={e => { if (!isLoading) e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {isLoading ? 'Processing…' : (
              view === 'login' ? 'Sign In' : view === 'signup' ? 'Create Account' : 'Send Reset Link'
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          <span style={{ padding: '0 1rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        </div>

        {/* Google Sign-In */}
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
            padding: '0.8rem',
            backgroundColor: '#ffffff',
            color: '#1e293b',
            border: '1.5px solid #e2e8f0',
            borderRadius: '10px',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(30,41,59,0.07)',
            opacity: isLoading ? 0.7 : 1,
          }}
          onMouseOver={e => { if (!isLoading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(30,41,59,0.12)'; } }}
          onMouseOut={e => { if (!isLoading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(30,41,59,0.07)'; } }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        {/* Switch view link */}
        <div style={{ marginTop: '1.75rem', fontSize: '0.875rem', color: '#64748b' }}>
          {view === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setView('signup'); setError(null); setMessage(null); }}
                style={{ background: 'none', border: 'none', color: '#1aad9c', cursor: 'pointer', fontWeight: 700, padding: 0, fontSize: '0.875rem', minHeight: 'auto', boxShadow: 'none' }}
                onMouseOver={e => { e.currentTarget.style.textDecoration = 'underline'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                onMouseOut={e => { e.currentTarget.style.textDecoration = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setView('login'); setError(null); setMessage(null); }}
                style={{ background: 'none', border: 'none', color: '#1aad9c', cursor: 'pointer', fontWeight: 700, padding: 0, fontSize: '0.875rem', minHeight: 'auto', boxShadow: 'none' }}
                onMouseOver={e => { e.currentTarget.style.textDecoration = 'underline'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                onMouseOut={e => { e.currentTarget.style.textDecoration = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
