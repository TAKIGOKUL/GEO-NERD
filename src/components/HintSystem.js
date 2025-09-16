import React from 'react';
import { getDynamicHint } from '../data/locations';

const HintSystem = ({ location, hintLevel, onRequestHint, maxHints = 4 }) => {
  // Don't render if location is not available
  if (!location) return null;

  const hints = [
    getDynamicHint(location, 1, true),
    getDynamicHint(location, 2, true),
    getDynamicHint(location, 3, true),
    getDynamicHint(location, 4, true)
  ].filter(hint => hint !== null);

  return (
    <div className="hint-system">
      <div className="hint-header">
        <h4>🧠 Smart Hints</h4>
        <p>Request hints to help your guess (each hint reduces your score)</p>
      </div>
      
      <div className="hint-levels">
        {hints.map((hint, index) => (
          <div key={index} className={`hint-level ${hintLevel >= hint.level ? 'revealed' : 'hidden'}`}>
            <div className="hint-content">
              <span className="hint-number">{hint.level}</span>
              <span className="hint-text">
                {hintLevel >= hint.level ? hint.text : 'Hidden'}
              </span>
              <span className="hint-penalty">-{hint.penalty} pts</span>
            </div>
            
            {hintLevel < hint.level && hintLevel < maxHints && (
              <button 
                className="btn btn-hint"
                onClick={() => onRequestHint(hint.level)}
              >
                Request Hint
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="hint-summary">
        <p>Current hint penalty: -{hintLevel * 10} points</p>
        <p>Maximum possible score: {100 - (hintLevel * 10)} points</p>
      </div>
    </div>
  );
};

export default HintSystem;
