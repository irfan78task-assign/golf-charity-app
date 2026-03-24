import React, { useState } from 'react';
import { supabase } from './lib/supabase';
import './Signup.css';

function Signup({ onSignupSuccess, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (signupError) {
        setError(signupError.message);
      } else if (data.user) {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        onSignupSuccess();
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
        <h2 className="auth-subtitle">Sign Up</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSignup} className="auth-form">
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
            placeholder="At least 6 characters"
            className="auth-input"
            required
          />

          <label className="auth-label">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="auth-input"
            required
          />

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'SIGNING UP...' : 'SIGN UP'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account?</p>
          <button type="button" onClick={onSwitchToLogin} className="auth-link-button">
            Login here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
