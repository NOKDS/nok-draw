import React from "react";

interface PlayerStatsProps {
  username: string;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ username }) => {
  const dummyStats = {
    gamesPlayed: 50,
    wins: 30,
    losses: 20,
    highestScore: 1200,
    averageScore: 1000,
  };

  return (
    <div>
      <h3>Player Stats</h3>
      <p>Games Played: {dummyStats.gamesPlayed}</p>
      <p>Wins: {dummyStats.wins}</p>
      <p>Losses: {dummyStats.losses}</p>
      <p>Highest Score: {dummyStats.highestScore}</p>
      <p>Average Score: {dummyStats.averageScore}</p>
    </div>
  );
};

export default PlayerStats;
