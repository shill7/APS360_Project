import { useState } from 'react';
import './App.css';
import SemiCircle from './semiCircle';


function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      const isAI = data.prediction === 1;
      const prediction = isAI ? 'AI-generated' : 'Human-written';
      const confidence = parseFloat(data.confidence);
      const aiConfidence = isAI ? confidence : (1 - confidence);
      
      setResult({ prediction, aiConfidence });
    } catch (err) {
      setResult({ prediction: 'Error', confidence: 'N/A' });
    }

    setLoading(false);
  };

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const wordCount = getWordCount(text);
  const MIN_WORDS = 50; 


  return (
    <div className="app">
      <h1>AI Writing Detector</h1>
      <textarea
        placeholder="Paste or type text here..."
        rows="10"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <p style={{ fontStyle: 'italic' }}>
        Word count: {wordCount} {wordCount < MIN_WORDS && `(minimum ${MIN_WORDS} words required)`}
      </p>
      <button 
        onClick={handleCheck} 
        disabled={loading || wordCount < MIN_WORDS}
      >
        {loading ? 'Checking...' : 'Check'}
      </button>

      {result && (
        <div className="result">
          <p><strong>Your Text is {result.prediction}</strong></p>
          <p style={{ marginTop: 4 }}>
            Confidence: 
              Human {Math.round((1-result.aiConfidence) * 100)}% | 
              AI {Math.round(result.aiConfidence * 100)}%
          </p>
          <div style={{ width: 200, height: 100, margin: 'auto' }}>
            <SemiCircle points={(result.aiConfidence * 100).toFixed(0)} maxPoints={100} />
            <div style={{ textAlign: 'center', marginTop: '-60px', fontSize: '24px' }}> AI likelihood
            </div>
          </div>
        </div>
      )}



    </div>
  );
}

export default App;
