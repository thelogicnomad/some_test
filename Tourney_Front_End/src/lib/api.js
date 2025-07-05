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

export async function fetchFixtures(tournamentId) {
  const res = await fetch(`${BASE_URL}/api/organizer/fixtures/${tournamentId}`, {
    credentials: 'include',
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch fixtures');
  }
  return data.fixtures;
}

export async function updateFixture(fixtureId, payload) {
  const res = await fetch(`${BASE_URL}/api/organizer/fixtures/fixture/${fixtureId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || 'Failed to update fixture');
  }
  return data.fixture;
}

export async function generateFixtures(tournamentId) {
  const res = await fetch(`${BASE_URL}/api/organizer/fixtures/${tournamentId}/generate`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || 'Failed to generate fixtures');
  }
  return data.fixtures;
}
