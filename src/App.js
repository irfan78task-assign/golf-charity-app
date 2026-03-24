import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import './App.css';
import Login from './Login';
import Signup from './Signup';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [score, setScore] = useState('');
  const [selectedCharity, setSelectedCharity] = useState('Red Cross');
  const [scoresList, setScoresList] = useState([]);
  const [loading, setLoading] = useState(false);

  const charities = ["Red Cross", "Save the Children", "Cancer Research", "Greenpeace"];

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setCurrentView('app');
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
          setCurrentView('app');
        } else {
          setUser(null);
          setCurrentView('login');
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);
  const fetchScores = async () => {
    const { data } = await supabase
      .from('scores')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    if (data) setScoresList(data);
  };

  useEffect(() => {
    if (currentView === 'app') {
      fetchScores();
    }
  }, [currentView]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentView('login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = parseInt(score);
    if (isNaN(val) || val < 1 || val > 45) {
      alert("Please enter a score between 1 and 45");
      return;
    }

    setLoading(true);
    // Saving score with the selected charity name
    const { error } = await supabase
      .from('scores')
      .insert([{ score_value: val, charity_name: selectedCharity }]); 

    if (!error) {
      setScore('');
      fetchScores();
      alert(`Saved! 10% of your entry goes to ${selectedCharity}`);
    } else {
      alert("Error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <>
      {currentView === 'login' && (
        <Login 
          onLoginSuccess={() => setCurrentView('app')}
          onSwitchToSignup={() => setCurrentView('signup')}
        />
      )}

      {currentView === 'signup' && (
        <Signup 
          onSignupSuccess={() => setCurrentView('login')}
          onSwitchToLogin={() => setCurrentView('login')}
        />
      )}

      {currentView === 'app' && (
        <div className="app-container">
          <div className="app-header">
            <h1 className="app-title">GOLF CHARITY</h1>
            <button onClick={handleLogout} className="logout-button">
              LOGOUT
            </button>
          </div>
          
          <div className="form-container">
            <form onSubmit={handleSubmit} className="form">
              
              <label className="form-label">Select Your Charity</label>
              <select 
                value={selectedCharity} 
                onChange={(e) => setSelectedCharity(e.target.value)}
                className="form-select"
              >
                {charities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <label className="form-label">Enter Golf Score (1-45)</label>
              <input 
                type="number" value={score} onChange={(e) => setScore(e.target.value)}
                placeholder="e.g. 24"
                className="form-input"
              />
              
              <button 
                type="submit" disabled={loading}
                className="form-button"
              >
                {loading ? 'SAVING...' : 'SAVE SCORE & DONATE'}
              </button>
            </form>

            <div className="scores-section">
              <h2 className="scores-title">LATEST 5 SCORES</h2>
              <div className="scores-list">
                {scoresList.map((s, idx) => (
                  <div key={s.id} className="score-item">
                    <div className="score-details">
                      <span className="score-number">Score #{idx + 1}</span>
                      <span className="score-charity">{s.charity_name || 'General'}</span>
                    </div>
                    <span className="score-value">{s.score_value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;