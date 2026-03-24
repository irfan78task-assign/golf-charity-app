import React, { useState } from 'react';
import { supabase } from './lib/supabase';
import './VerifyEmail.css';

function VerifyEmail({ email, onVerifySuccess, onSwitchToLogin }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'signup',
      });

      if (verifyError) {
        setError('Invalid or expired code. ' + verifyError.message);
      } else {
        setMessage('✅ Email verified! Redirecting to login...');
        setTimeout(() => {
          onVerifySuccess();
        }, 1500);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">GOLF CHARITY</h1>
        <h2 className="auth-subtitle">Verify Email</h2>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-message">{message}</div>}

        <form onSubmit={handleVerify} className="auth-form">
          <p className="verify-info">
            📧 Check your email: <strong>{email}</strong>
          </p>

          <label className="auth-label">Verification Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.trim())}
            placeholder="Paste the code from your email"
            className="auth-input"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'VERIFYING...' : 'VERIFY EMAIL'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already verified?</p>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="auth-link-button"
          >
            Go to login
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
