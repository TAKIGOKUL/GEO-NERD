import React, { useState } from 'react';

const AvatarSelector = ({ currentAvatar, onAvatarChange }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || 'compass');

  const avatars = [
    { id: 'compass', icon: '🧭', name: 'Compass', description: 'Navigation Expert' },
    { id: 'mountain', icon: '🏔️', name: 'Mountain Peak', description: 'Nature Explorer' },
    { id: 'desert', icon: '🏜️', name: 'Desert Dune', description: 'Desert Wanderer' },
    { id: 'lighthouse', icon: '🗼', name: 'Lighthouse', description: 'Coastal Guardian' },
    { id: 'volcano', icon: '🌋', name: 'Volcano', description: 'Geological Master' },
    { id: 'glacier', icon: '🧊', name: 'Glacier', description: 'Polar Explorer' },
    { id: 'forest', icon: '🌲', name: 'Forest', description: 'Wilderness Guide' },
    { id: 'city', icon: '🏙️', name: 'City Skyline', description: 'Urban Navigator' }
  ];

  const handleAvatarSelect = (avatarId) => {
    setSelectedAvatar(avatarId);
    onAvatarChange(avatarId);
  };

  return (
    <div className="avatar-selector">
      <h4>Choose Your Avatar</h4>
      <div className="avatar-grid">
        {avatars.map((avatar) => (
          <button
            key={avatar.id}
            className={`avatar-option ${selectedAvatar === avatar.id ? 'selected' : ''}`}
            onClick={() => handleAvatarSelect(avatar.id)}
            title={avatar.description}
          >
            <div className="avatar-icon">{avatar.icon}</div>
            <div className="avatar-name">{avatar.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AvatarSelector;
