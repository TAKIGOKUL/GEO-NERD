// Leaderboard Service for storing and managing player scores
export interface PlayerScore {
  playerId: string;
  totalPoints: number;
  calculatedScore: number; // totalPoints / 50
  roundsPlayed: number;
  averageDistance: number;
  timestamp: string;
  gameMode: string;
  wikipediaLink?: string;
  locationName?: string;
}

export class LeaderboardService {
  private static readonly STORAGE_KEY = 'geonerd_leaderboard';
  private static readonly TXT_HEADER = 'Geo-Nerd Leaderboard Results\n================================\n\n';

  // Save player score to localStorage and TXT file
  static saveScore(playerScore: PlayerScore): void {
    // Get existing scores
    const existingScores = this.getScores();
    
    // Check if player already exists and update their best score
    const existingPlayerIndex = existingScores.findIndex(score => score.playerId === playerScore.playerId);
    
    if (existingPlayerIndex >= 0) {
      // Update existing player's best score if new score is better
      if (playerScore.calculatedScore > existingScores[existingPlayerIndex].calculatedScore) {
        existingScores[existingPlayerIndex] = playerScore;
        console.log(`🔄 Updated best score for ${playerScore.playerId}`);
      } else {
        console.log(`📊 New score for ${playerScore.playerId} is not better than existing best`);
        // Still add the new attempt for tracking
        existingScores.push(playerScore);
      }
    } else {
      // Add new player
      existingScores.push(playerScore);
      console.log(`🆕 New player added: ${playerScore.playerId}`);
    }
    
    // Sort by calculated score (descending) - best scores first
    existingScores.sort((a, b) => b.calculatedScore - a.calculatedScore);
    
    // Keep only top 100 scores
    const topScores = existingScores.slice(0, 100);
    
    // Save to localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(topScores));
    
    // Update local TXT file
    this.updateLocalTXT(topScores);
    
    // Print to console
    console.log(`🎯 Player Score: ${playerScore.playerId}`);
    console.log(`📊 Total Points: ${playerScore.totalPoints}`);
    console.log(`🏆 Calculated Score: ${playerScore.calculatedScore.toFixed(2)}`);
    console.log(`🎮 Rounds Played: ${playerScore.roundsPlayed}`);
    console.log(`📏 Average Distance: ${playerScore.averageDistance.toFixed(2)} km`);
    console.log(`⏰ Timestamp: ${playerScore.timestamp}`);
  }

  // Get all scores from localStorage
  static getScores(): PlayerScore[] {
    try {
      const scores = localStorage.getItem(this.STORAGE_KEY);
      return scores ? JSON.parse(scores) : [];
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      return [];
    }
  }

  // Get top N scores
  static getTopScores(limit: number = 10): PlayerScore[] {
    const scores = this.getScores();
    return scores.slice(0, limit);
  }

  // Update local TXT file with current scores
  private static updateLocalTXT(scores: PlayerScore[]): void {
    let txtContent = this.TXT_HEADER;
    txtContent += `Last Updated: ${new Date().toLocaleString()}\n\n`;
    txtContent += `Total Players: ${scores.length}\n\n`;
    txtContent += `LEADERBOARD RANKINGS:\n`;
    txtContent += `===================\n\n`;
    txtContent += `Rank | Player ID | Total Points | Calculated Score | Rounds | Avg Distance | Game Mode | Timestamp\n`;
    txtContent += `-----|-----------|--------------|------------------|--------|--------------|-----------|----------\n`;
    
    scores.forEach((score, index) => {
      const rank = index + 1;
      const timestamp = new Date(score.timestamp).toLocaleString();
      txtContent += `${rank.toString().padStart(4)} | ${score.playerId.padEnd(9)} | ${score.totalPoints.toString().padStart(12)} | ${score.calculatedScore.toFixed(2).padStart(16)} | ${score.roundsPlayed.toString().padStart(6)} | ${score.averageDistance.toFixed(2).padStart(12)} km | ${score.gameMode.padEnd(9)} | ${timestamp}\n`;
    });


    // Store TXT content in localStorage for persistence
    localStorage.setItem('geonerd_leaderboard_txt', txtContent);
    
    // Also create downloadable TXT file
    this.downloadTXT(txtContent);
    
    console.log(`📁 Local TXT file updated with ${scores.length} entries`);
  }

  // Download TXT file
  private static downloadTXT(txtContent: string): void {
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `georesult_${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Get local TXT content
  static getLocalTXT(): string {
    return localStorage.getItem('geonerd_leaderboard_txt') || this.TXT_HEADER;
  }

  // Calculate player score (total points / 50)
  static calculateScore(totalPoints: number): number {
    return totalPoints / 50;
  }

  // Get player's rank
  static getPlayerRank(playerId: string): number {
    const scores = this.getScores();
    const playerIndex = scores.findIndex(score => score.playerId === playerId);
    return playerIndex >= 0 ? playerIndex + 1 : -1;
  }

  // Get player's best score
  static getPlayerBestScore(playerId: string): PlayerScore | null {
    const scores = this.getScores();
    const playerScores = scores.filter(score => score.playerId === playerId);
    return playerScores.length > 0 ? playerScores[0] : null;
  }

  // Get all scores for a specific player (sorted by points)
  static getPlayerScores(playerId: string): PlayerScore[] {
    const scores = this.getScores();
    return scores
      .filter(score => score.playerId === playerId)
      .sort((a, b) => b.calculatedScore - a.calculatedScore);
  }

  // Get player statistics
  static getPlayerStats(playerId: string): {
    totalGames: number;
    bestScore: number;
    averageScore: number;
    totalPoints: number;
    averageDistance: number;
    rank: number;
  } | null {
    const playerScores = this.getPlayerScores(playerId);
    if (playerScores.length === 0) return null;

    const totalGames = playerScores.length;
    const bestScore = playerScores[0].calculatedScore;
    const averageScore = playerScores.reduce((sum, score) => sum + score.calculatedScore, 0) / totalGames;
    const totalPoints = playerScores.reduce((sum, score) => sum + score.totalPoints, 0);
    const averageDistance = playerScores.reduce((sum, score) => sum + score.averageDistance, 0) / totalGames;
    const rank = this.getPlayerRank(playerId);

    return {
      totalGames,
      bestScore,
      averageScore,
      totalPoints,
      averageDistance,
      rank
    };
  }

  // Export current leaderboard as TXT
  static exportLeaderboard(): void {
    const txtContent = this.getLocalTXT();
    this.downloadTXT(txtContent);
  }

  // Clear all scores (for testing)
  static clearScores(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem('geonerd_leaderboard_txt');
    console.log('Leaderboard and TXT file cleared');
  }
}
