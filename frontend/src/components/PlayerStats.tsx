import React from "react";

interface Game {
  id: number;
  isWon: boolean;
  top3Predications: string;
  image: string;
  createdAt: string;
}

interface PlayerStatsProps {
  games: Game[];
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ games }) => {
  const stats = games.reduce(
    (acc, game) => {
      if (game.isWon) {
        acc.wins++;
      } else {
        acc.losses++;
      }
      return acc;
    },
    { wins: 0, losses: 0 } as { wins: number; losses: number }
  );

  return (
    <div>
      <h3>Player Stats</h3>
      <p>Games Played: {games.length}</p>
      <p>Wins: {stats.wins}</p>
      <p>Losses: {stats.losses}</p>
    </div>
  );
};

export default PlayerStats;
