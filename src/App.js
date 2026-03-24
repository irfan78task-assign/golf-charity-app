import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

function App() {
  const [score, setScore] = useState('');
  const [selectedCharity, setSelectedCharity] = useState('Red Cross'); // Default charity
  const [scoresList, setScoresList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Predefined list of charities as per assignment
  const charities = ["Red Cross", "Save the Children", "Cancer Research", "Greenpeace"];

  const fetchScores = async () => {
    const { data } = await supabase
      .from('scores')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    if (data) setScoresList(data);
  };

  useEffect(() => {
    fetchScores();
  }, []);

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
    <div style={{ minHeight: '100vh', backgroundColor: '#111827', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#4ade80', marginBottom: '30px' }}>GOLF CHARITY</h1>
      
      <div style={{ backgroundColor: '#1f2937', padding: '30px', borderRadius: '15px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* NEW: Charity Selection Dropdown */}
          <label style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Select Your Charity</label>
          <select 
            value={selectedCharity} 
            onChange={(e) => setSelectedCharity(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#374151', color: 'white', border: '1px solid #4b5563' }}
          >
            {charities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <label style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Enter Golf Score (1-45)</label>
          <input 
            type="number" value={score} onChange={(e) => setScore(e.target.value)}
            placeholder="e.g. 24"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#374151', color: 'white', fontSize: '1.2rem', textAlign: 'center' }}
          />
          
          <button 
            type="submit" disabled={loading}
            style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#059669', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {loading ? 'SAVING...' : 'SAVE SCORE & DONATE'}
          </button>
        </form>

        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #374151', paddingBottom: '10px', marginBottom: '15px' }}>LATEST 5 SCORES</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {scoresList.map((s, idx) => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#374151', padding: '12px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Score #{idx + 1}</span>
                  <span style={{ fontSize: '0.7rem', color: '#60a5fa' }}>{s.charity_name || 'General'}</span>
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4ade80' }}>{s.score_value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;