// src/lib/api.js
// Simple fetch wrappers for backend endpoints

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export async function fetchTeams(tournamentId) {
  const res = await fetch(
    `${BASE_URL}/api/organizer/fixtures/${tournamentId}/teams`,
    {
      credentials: 'include',
    }
  );
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch teams');
  }
  // data.teams is array of team objects with .name
  return data.teams;
}
