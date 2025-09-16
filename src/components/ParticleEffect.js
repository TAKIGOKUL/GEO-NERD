import React, { useEffect, useState } from 'react';

const ParticleEffect = ({ active = true, intensity = 'medium' }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) return;

    const particleCount = intensity === 'high' ? 50 : intensity === 'medium' ? 30 : 15;
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        delay: Math.random() * 6,
        color: ['#fe4a56', '#00ff88', '#4dabf7'][Math.floor(Math.random() * 3)]
      });
    }

    setParticles(newParticles);
  }, [active, intensity]);

  if (!active) return null;

  return (
    <div className="particle-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${6 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};

export default ParticleEffect;
