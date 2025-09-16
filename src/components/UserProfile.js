import React, { useState } from 'react';
import AvatarSelector from './AvatarSelector';
import AchievementSystem from './AchievementSystem';

const UserProfile = ({ userProfile, gameMode, onProfileUpdate }) => {
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  const handleAvatarChange = (newAvatar) => {
    onProfileUpdate({ ...userProfile, avatar: newAvatar });
    setShowAvatarSelector(false);
  };

  const handleAchievementUnlock = (newAchievements, updatedAchievements) => {
    onProfileUpdate({ ...userProfile, achievements: updatedAchievements });
  };
  const getRankColor = (rank) => {
    switch (rank) {
      case 'Novice': return '#4dabf7';
      case 'Explorer': return '#00ff88';
      case 'Navigator': return '#ff6b6b';
      case 'Geo-Nerd': return '#ffd700';
      case 'World Master': return '#ff6b6b';
      default: return '#4dabf7';
    }
  };

  const getNextRankXP = (currentLevel) => {
    return currentLevel * 1000;
  };

  const progressToNextLevel = (currentXP, currentLevel) => {
    const nextLevelXP = getNextRankXP(currentLevel);
    const currentLevelXP = getNextRankXP(currentLevel - 1);
    return ((currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="avatar-section">
          <button 
            className="avatar-button"
            onClick={() => setShowAvatarSelector(!showAvatarSelector)}
            title="Change Avatar"
          >
            <div className="current-avatar">
              {userProfile.avatar === 'compass' && '🧭'}
              {userProfile.avatar === 'mountain' && '🏔️'}
              {userProfile.avatar === 'desert' && '🏜️'}
              {userProfile.avatar === 'lighthouse' && '🗼'}
              {userProfile.avatar === 'volcano' && '🌋'}
              {userProfile.avatar === 'glacier' && '🧊'}
              {userProfile.avatar === 'forest' && '🌲'}
              {userProfile.avatar === 'city' && '🏙️'}
            </div>
          </button>
          {showAvatarSelector && (
            <AvatarSelector 
              currentAvatar={userProfile.avatar}
              onAvatarChange={handleAvatarChange}
            />
          )}
        </div>
        
        <div className="rank-badge" style={{ borderColor: getRankColor(userProfile.expertiseRank) }}>
          <span className="rank-text">{userProfile.expertiseRank}</span>
        </div>
        
        <div className="level-info">
          <h3>Level {userProfile.level}</h3>
          <div className="xp-bar">
            <div 
              className="xp-progress" 
              style={{ width: `${progressToNextLevel(userProfile.xp, userProfile.level)}%` }}
            ></div>
          </div>
          <p className="xp-text">{userProfile.xp} XP</p>
        </div>
      </div>
      
      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-label">Total Score</span>
          <span className="stat-value">{userProfile.totalScore.toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Games Played</span>
          <span className="stat-value">{userProfile.gamesPlayed}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Current Mode</span>
          <span className="stat-value mode-badge">{gameMode}</span>
        </div>
      </div>
      
      <div className="achievements">
        <div className="achievements-header">
          <h4>🏆 Achievements</h4>
          <button 
            className="btn-toggle-achievements"
            onClick={() => setShowAchievements(!showAchievements)}
          >
            {showAchievements ? 'Hide' : 'View All'}
          </button>
        </div>
        
        {showAchievements ? (
          <AchievementSystem 
            userProfile={userProfile}
            onAchievementUnlock={handleAchievementUnlock}
          />
        ) : (
          <div className="achievement-list">
            {userProfile.achievements.slice(-3).map((achievement, index) => (
              <div key={index} className="achievement-item">
                <span className="achievement-icon">{achievement.icon}</span>
                <span className="achievement-text">{achievement.name}</span>
              </div>
            ))}
            {userProfile.achievements.length === 0 && (
              <p className="no-achievements">No achievements yet. Keep playing!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
