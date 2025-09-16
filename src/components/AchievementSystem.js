import React, { useState, useEffect } from 'react';

const AchievementSystem = ({ userProfile, onAchievementUnlock }) => {
  const [achievements, setAchievements] = useState([]);
  const [recentUnlocks, setRecentUnlocks] = useState([]);

  const achievementDefinitions = [
    {
      id: 'first_guess',
      title: 'First Steps',
      description: 'Make your first guess',
      icon: '🎯',
      condition: (profile) => profile.gamesPlayed >= 1,
      category: 'milestone'
    },
    {
      id: 'perfect_score',
      title: 'Bullseye',
      description: 'Score 100 points in a single round',
      icon: '🎯',
      condition: (profile) => profile.bestScore >= 100,
      category: 'accuracy'
    },
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      description: 'Complete 10 rounds in under 30 seconds each',
      icon: '⚡',
      condition: (profile) => profile.fastGuesses >= 10,
      category: 'speed'
    },
    {
      id: 'continent_explorer',
      title: 'Continental Explorer',
      description: 'Guess locations on all 7 continents',
      icon: '🌍',
      condition: (profile) => profile.continentsVisited >= 7,
      category: 'exploration'
    },
    {
      id: 'cultural_expert',
      title: 'Cultural Expert',
      description: 'Score cultural bonus points 20 times',
      icon: '🏛️',
      condition: (profile) => profile.culturalBonuses >= 20,
      category: 'knowledge'
    },
    {
      id: 'streak_master',
      title: 'Streak Master',
      description: 'Achieve a 10-round accuracy streak',
      icon: '🔥',
      condition: (profile) => profile.currentStreak >= 10,
      category: 'consistency'
    },
    {
      id: 'hint_master',
      title: 'Hint Master',
      description: 'Complete 50 rounds without using hints',
      icon: '🧠',
      condition: (profile) => profile.noHintRounds >= 50,
      category: 'skill'
    },
    {
      id: 'level_up',
      title: 'Level Up',
      description: 'Reach level 10',
      icon: '⭐',
      condition: (profile) => profile.level >= 10,
      category: 'progression'
    }
  ];

  useEffect(() => {
    checkAchievements();
  }, [userProfile]);

  const checkAchievements = () => {
    const unlockedAchievements = achievementDefinitions.filter(achievement => 
      achievement.condition(userProfile) && 
      !userProfile.achievements.includes(achievement.id)
    );

    if (unlockedAchievements.length > 0) {
      const newAchievements = [...userProfile.achievements, ...unlockedAchievements.map(a => a.id)];
      onAchievementUnlock(unlockedAchievements, newAchievements);
      
      // Show recent unlocks
      setRecentUnlocks(unlockedAchievements);
      setTimeout(() => setRecentUnlocks([]), 5000);
    }
  };

  const getAchievementIcon = (achievementId) => {
    const achievement = achievementDefinitions.find(a => a.id === achievementId);
    return achievement ? achievement.icon : '🏆';
  };

  const getAchievementTitle = (achievementId) => {
    const achievement = achievementDefinitions.find(a => a.id === achievementId);
    return achievement ? achievement.title : 'Unknown Achievement';
  };

  return (
    <div className="achievement-system">
      <div className="achievement-header">
        <h4>🏆 Achievements</h4>
        <div className="achievement-count">
          {userProfile.achievements.length}/{achievementDefinitions.length}
        </div>
      </div>

      {/* Recent Unlocks */}
      {recentUnlocks.length > 0 && (
        <div className="recent-unlocks">
          {recentUnlocks.map((achievement) => (
            <div key={achievement.id} className="achievement-unlock">
              <div className="unlock-icon">{achievement.icon}</div>
              <div className="unlock-text">
                <div className="unlock-title">Achievement Unlocked!</div>
                <div className="unlock-name">{achievement.title}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Achievement Grid */}
      <div className="achievement-grid">
        {achievementDefinitions.map((achievement) => {
          const isUnlocked = userProfile.achievements.includes(achievement.id);
          return (
            <div
              key={achievement.id}
              className={`achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">
                {isUnlocked ? achievement.icon : '🔒'}
              </div>
              <div className="achievement-info">
                <div className="achievement-title">{achievement.title}</div>
                <div className="achievement-description">{achievement.description}</div>
                <div className={`achievement-category ${achievement.category}`}>
                  {achievement.category}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementSystem;
