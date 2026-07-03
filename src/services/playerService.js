import axios from 'axios';

// Set to false when connecting to a live backend
const USE_MOCK = false;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/players';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Seed data matching backend Player entity fields
const SEED_PLAYERS = [
  {
    playerId: 1,
    playerName: 'Virat Kohli',
    jerseyNumber: 18,
    role: 'Batsman',
    totalMatches: 275,
    teamName: 'India',
    countryStateName: 'India',
    description: 'One of the greatest batsmen of the modern era.',
  },
  {
    playerId: 2,
    playerName: 'Jasprit Bumrah',
    jerseyNumber: 93,
    role: 'Bowler',
    totalMatches: 140,
    teamName: 'India',
    countryStateName: 'India',
    description: 'Premier fast bowler with unorthodox action.',
  },
  {
    playerId: 3,
    playerName: 'Ben Stokes',
    jerseyNumber: 55,
    role: 'All-rounder',
    totalMatches: 180,
    teamName: 'England',
    countryStateName: 'England',
    description: 'Match-winning all-rounder and England Test captain.',
  },
  {
    playerId: 4,
    playerName: 'Rishabh Pant',
    jerseyNumber: 17,
    role: 'Wicketkeeper',
    totalMatches: 95,
    teamName: 'India',
    countryStateName: 'India',
    description: 'Aggressive wicketkeeper-batsman.',
  },
];

const getLocalPlayers = () => {
  const data = localStorage.getItem('cricket_players');
  if (!data) {
    localStorage.setItem('cricket_players', JSON.stringify(SEED_PLAYERS));
    return SEED_PLAYERS;
  }
  return JSON.parse(data);
};

const saveLocalPlayers = (players) => {
  localStorage.setItem('cricket_players', JSON.stringify(players));
};

const simulateNetwork = (data) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), 400));

export const playerService = {
  getPlayers: async () => {
    if (USE_MOCK) return simulateNetwork(getLocalPlayers());
    return apiClient.get('');
  },

  getPlayerById: async (id) => {
    const numericId = parseInt(id, 10);
    if (USE_MOCK) {
      const player = getLocalPlayers().find((p) => p.playerId === numericId);
      if (!player) return Promise.reject(new Error('Player not found'));
      return simulateNetwork(player);
    }
    return apiClient.get(`/${numericId}`);
  },

  addPlayer: async (dto) => {
    if (USE_MOCK) {
      const players = getLocalPlayers();
      const newId =
        players.length > 0 ? Math.max(...players.map((p) => p.playerId)) + 1 : 1;
      const newPlayer = { playerId: newId, ...dto };
      players.push(newPlayer);
      saveLocalPlayers(players);
      return simulateNetwork(newPlayer);
    }
    return apiClient.post('', dto);
  },

  updatePlayer: async (id, dto) => {
    const numericId = parseInt(id, 10);
    if (USE_MOCK) {
      const players = getLocalPlayers();
      const index = players.findIndex((p) => p.playerId === numericId);
      if (index === -1) return Promise.reject(new Error('Player not found'));
      players[index] = { ...players[index], ...dto };
      saveLocalPlayers(players);
      return simulateNetwork(players[index]);
    }
    return apiClient.put(`/${numericId}`, dto);
  },

  deletePlayer: async (id) => {
    const numericId = parseInt(id, 10);
    if (USE_MOCK) {
      const players = getLocalPlayers();
      const updated = players.filter((p) => p.playerId !== numericId);
      if (updated.length === players.length)
        return Promise.reject(new Error('Player not found'));
      saveLocalPlayers(updated);
      return simulateNetwork('Player deleted successfully');
    }
    return apiClient.delete(`/${numericId}`);
  },
};
