import React, { useState } from 'react';
import { supabase } from './lib/supabase';
import './Login.css';

function Login({ onLoginSuccess, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) {
        setError(loginError.message);
      } else if (data.user) {
        setEmail('');
        setPassword('');
        onLoginSuccess();
      }
    } catch (err) {
      setError('Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">GOLF CHARITY</h1>
        <h2 className="auth-subtitle">Login</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <label className="auth-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="auth-input"
            required
          />

          <label className="auth-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="auth-input"
            required
          />

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account?</p>
          <button type="button" onClick={onSwitchToSignup} className="auth-link-button">
            Sign up here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
