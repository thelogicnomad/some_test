import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Trash2, RotateCcw, Trophy, Users, User } from 'lucide-react';

const TournamentBracket = () => {
  const [competitionType, setCompetitionType] = useState('teams');
  const [teams, setTeams] = useState([
    'The Leons', 'Team Alpha', 'Team Beta', 'Team Gamma', 
    'Team Delta', 'Team Epsilon', 'Team Zeta', 'Team Theta'
  ]);
  const [playerPairs, setPlayerPairs] = useState([
    { player1: 'John Smith', player2: 'Jane Doe' },
    { player1: 'Mike Johnson', player2: 'Sarah Wilson' },
    { player1: 'David Brown', player2: 'Lisa Davis' },
    { player1: 'Tom Anderson', player2: 'Emma Taylor' }
  ]);
  
  const [bracket, setBracket] = useState([]);
  const [winners, setWinners] = useState({});
  const [newTeamName, setNewTeamName] = useState('');
  const [newPlayer1, setNewPlayer1] = useState('');
  const [newPlayer2, setNewPlayer2] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Get current participants based on competition type
  const currentParticipants = useMemo(() => {
    if (competitionType === 'teams') {
      return teams;
    } else {
      return playerPairs.map(pair => 
        pair.player2 ? `${pair.player1} & ${pair.player2}` : `${pair.player1} (Solo)`
      );
    }
  }, [competitionType, teams, playerPairs]);

  // Generate tournament bracket
  const generateBracket = useCallback((participants) => {
    if (participants.length < 2) return [];
    
    // Calculate next power of 2
    const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(participants.length)));
    const paddedParticipants = [...participants];
    
    // Add bye slots if needed
    while (paddedParticipants.length < nextPowerOf2) {
      paddedParticipants.push(null);
    }

    const rounds = [];
    let currentRoundParticipants = paddedParticipants;
    let roundNumber = 0;
    
    // Generate all rounds until final
    while (currentRoundParticipants.length > 1) {
      const matches = [];
      
      for (let i = 0; i < currentRoundParticipants.length; i += 2) {
        matches.push({
          id: `round${roundNumber}_match${i/2}`,
          participant1: currentRoundParticipants[i],
          participant2: currentRoundParticipants[i + 1],
          round: roundNumber,
          matchIndex: i/2
        });
      }
      
      rounds.push({
        roundNumber,
        roundName: getRoundName(roundNumber, Math.log2(nextPowerOf2)),
        matches
      });
      
      currentRoundParticipants = new Array(currentRoundParticipants.length / 2).fill(null);
      roundNumber++;
    }
    
    return rounds;
  }, []);

  // Get round names
  const getRoundName = (roundNum, totalRounds) => {
    const roundsFromEnd = totalRounds - 1 - roundNum;
    if (roundsFromEnd === 0) return 'Final';
    if (roundsFromEnd === 1) return 'Semi-Final';
    if (roundsFromEnd === 2) return 'Quarter-Final';
    if (roundsFromEnd === 3) return 'Round of 1';
    return `Round ${roundNum + 1}`;
  };

  // Generate bracket when participants change
  useEffect(() => {
    const newBracket = generateBracket(currentParticipants);
    setBracket(newBracket);
    setWinners({});
  }, [currentParticipants, generateBracket]);

  // Handle winner selection
  const selectWinner = useCallback((matchId, winner, match) => {
    const newWinners = { ...winners };
    
    // If clicking same winner, deselect
    if (newWinners[matchId] === winner) {
      delete newWinners[matchId];
      clearSubsequentWinners(match, newWinners);
    } else {
      // Clear any subsequent winners if changing selection
      if (newWinners[matchId]) {
        clearSubsequentWinners(match, newWinners);
      }
      newWinners[matchId] = winner;
    }
    
    setWinners(newWinners);
    updateNextRound(match, newWinners[matchId] || null);
  }, [winners]);

  // Clear winners in subsequent rounds
  const clearSubsequentWinners = (match, winnersObj) => {
    const { round, matchIndex } = match;
    for (let r = round + 1; r < bracket.length; r++) {
      const nextMatchId = `round${r}_match${Math.floor(matchIndex / Math.pow(2, r - round))}`;
      if (winnersObj[nextMatchId]) {
        delete winnersObj[nextMatchId];
        const nextMatch = bracket[r]?.matches.find(m => m.id === nextMatchId);
        if (nextMatch) {
          clearSubsequentWinners(nextMatch, winnersObj);
        }
      }
    }
  };

  // Update next round with winner
  const updateNextRound = (match, winner) => {
    if (match.round >= bracket.length - 1) return;
    
    setBracket(prevBracket => {
      const newBracket = [...prevBracket];
      const nextRoundIndex = match.round + 1;
      const nextMatchIndex = Math.floor(match.matchIndex / 2);
      const isFirstSlot = match.matchIndex % 2 === 0;
      
      if (newBracket[nextRoundIndex]?.matches[nextMatchIndex]) {
        const nextMatch = newBracket[nextRoundIndex].matches[nextMatchIndex];
        if (isFirstSlot) {
          nextMatch.participant1 = winner;
        } else {
          nextMatch.participant2 = winner;
        }
      }
      
      return newBracket;
    });
  };

  // Add new team
  const addTeam = () => {
    if (newTeamName.trim()) {
      setTeams(prev => [...prev, newTeamName.trim()]);
      setNewTeamName('');
      setShowAddForm(false);
    }
  };

  // Add new player pair
  const addPlayerPair = () => {
    if (newPlayer1.trim()) {
      setPlayerPairs(prev => [...prev, {
        player1: newPlayer1.trim(),
        player2: newPlayer2.trim() || null
      }]);
      setNewPlayer1('');
      setNewPlayer2('');
      setShowAddForm(false);
    }
  };

  // Remove team
  const removeTeam = (index) => {
    setTeams(prev => prev.filter((_, i) => i !== index));
  };

  // Remove player pair
  const removePlayerPair = (index) => {
    setPlayerPairs(prev => prev.filter((_, i) => i !== index));
  };

  // Reset tournament
  const resetTournament = () => {
    setWinners({});
    setBracket(generateBracket(currentParticipants));
  };

  // Switch competition type
  const switchCompetitionType = (type) => {
    setCompetitionType(type);
    setWinners({});
    setShowAddForm(false);
  };

  // Truncate long names
  const truncateName = (name, maxLength = 15) => {
    if (!name) return 'TBD';
    return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
  };

  // Parse player pair display
  const parsePlayerDisplay = (participantName) => {
    if (competitionType === 'players' && participantName) {
      if (participantName.includes(' & ')) {
        const [player1, player2] = participantName.split(' & ');
        return { player1: player1.trim(), player2: player2.trim() };
      } else if (participantName.includes(' (Solo)')) {
        return { player1: participantName.replace(' (Solo)', ''), player2: null };
      }
    }
    return null;
  };

  // Participant Display Component
  const ParticipantDisplay = ({ name, isWinner, onClick, className = '' }) => {
    const playerInfo = parsePlayerDisplay(name);
    
    if (competitionType === 'players' && playerInfo) {
      return (
        <div 
          className={`${className} cursor-pointer transition-all duration-200 p-3 rounded-lg border-2 ${
            isWinner 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500 shadow-lg transform scale-105' 
              : 'bg-white border-blue-200 hover:border-blue-400 hover:shadow-md'
          }`}
          onClick={onClick}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-gray-500">
                {isWinner ? '🏆 WINNER' : 'PAIR'}
              </div>
              {isWinner && <Trophy size={16} className="text-yellow-300" />}
            </div>
            <div className="space-y-1">
              <div className="bg-blue-50 px-2 py-1 rounded text-sm font-medium">
                {truncateName(playerInfo.player1, 12)}
              </div>
              {playerInfo.player2 && (
                <div className="bg-blue-50 px-2 py-1 rounded text-sm font-medium">
                  {truncateName(playerInfo.player2, 12)}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div 
        className={`${className} cursor-pointer transition-all duration-200 p-3 rounded-lg border-2 flex items-center justify-between ${
          isWinner 
            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500 shadow-lg transform scale-105' 
            : 'bg-white border-blue-200 hover:border-blue-400 hover:shadow-md'
        }`}
        onClick={onClick}
      >
        <span className="font-medium" title={name}>
          {truncateName(name)}
        </span>
        {isWinner && <Trophy size={16} className="text-yellow-300" />}
      </div>
    );
  };

  // Match Component
  const MatchComponent = ({ match }) => {
    const { id, participant1, participant2 } = match;
    const winner = winners[id];
    const isWinner1 = winner === participant1;
    const isWinner2 = winner === participant2;
    
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4 mb-6 transition-all duration-300 hover:shadow-xl">
        <div className="text-center mb-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            Match {match.matchIndex + 1}
          </span>
        </div>
        
        {/* Participant 1 */}
        {participant1 ? (
          <ParticipantDisplay
            name={participant1}
            isWinner={isWinner1}
            onClick={() => selectWinner(id, participant1, match)}
            className="mb-3"
          />
        ) : (
          <div className="p-3 mb-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <span className="text-gray-400">Waiting...</span>
          </div>
        )}
        
        <div className="text-center py-2">
          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold">
            VS
          </span>
        </div>
        
        {/* Participant 2 */}
        {participant2 ? (
          <ParticipantDisplay
            name={participant2}
            isWinner={isWinner2}
            onClick={() => selectWinner(id, participant2, match)}
          />
        ) : participant1 ? (
          <div 
            className="p-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg text-center cursor-pointer hover:from-yellow-500 hover:to-orange-500 transition-all"
            onClick={() => selectWinner(id, participant1, match)}
          >
            <span className="font-bold">AUTO ADVANCE</span>
          </div>
        ) : (
          <div className="p-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <span className="text-gray-400">Waiting...</span>
          </div>
        )}
      </div>
    );
  };

  const finalWinner = bracket.length > 0 ? winners[`round${bracket.length - 1}_match0`] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🏆 Tournament Bracket</h1>
          <p className="text-gray-600">Manage your tournament with ease</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {/* Competition Type Toggle */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => switchCompetitionType('teams')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                competitionType === 'teams' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Users size={20} />
              Teams ({teams.length})
            </button>
            <button
              onClick={() => switchCompetitionType('players')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                competitionType === 'players' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <User size={20} />
              Players ({playerPairs.length} pairs)
            </button>
          </div>

          {/* Participants List */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Current {competitionType === 'teams' ? 'Teams' : 'Player Pairs'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-40 overflow-y-auto">
              {competitionType === 'teams' ? (
                teams.map((team, index) => (
                  <div key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                    <span className="font-medium">{team}</span>
                    <button
                      onClick={() => removeTeam(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                playerPairs.map((pair, index) => (
                  <div key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                    <span className="font-medium">
                      {pair.player2 ? `${pair.player1} & ${pair.player2}` : `${pair.player1} (Solo)`}
                    </span>
                    <button
                      onClick={() => removePlayerPair(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add Form */}
          {showAddForm ? (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              {competitionType === 'teams' ? (
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter team name..."
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTeam()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <button
                    onClick={addTeam}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Add Team
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Player 1 name..."
                      value={newPlayer1}
                      onChange={(e) => setNewPlayer1(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Player 2 name (optional)..."
                      value={newPlayer2}
                      onChange={(e) => setNewPlayer2(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addPlayerPair()}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={addPlayerPair}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Add Players
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Plus size={20} />
                Add {competitionType === 'teams' ? 'Team' : 'Players'}
              </button>
              <button
                onClick={resetTournament}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <RotateCcw size={20} />
                Reset Bracket
              </button>
            </div>
          )}
        </div>

        {/* Tournament Bracket */}
        {bracket.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="overflow-x-auto">
              <div className="flex gap-12 min-w-max py-4">
                {bracket.map((round, roundIndex) => (
                  <div key={roundIndex} className="min-w-[300px]">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-blue-600 mb-2">
                        {round.roundName}
                      </h3>
                      <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"></div>
                    </div>
                    
                    <div className="space-y-4">
                      {round.matches.map((match) => (
                        <MatchComponent key={match.id} match={match} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold mb-2 text-gray-800">Ready to Start?</h3>
            <p className="text-gray-600">Add at least 2 {competitionType} to generate the tournament bracket</p>
          </div>
        )}

        {/* Champion Display */}
        {finalWinner && (
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white px-8 py-6 rounded-2xl inline-block shadow-2xl transform hover:scale-105 transition-transform">
              <div className="text-4xl mb-2">🏆</div>
              <h2 className="text-2xl font-bold mb-2">TOURNAMENT CHAMPION</h2>
              <p className="text-xl font-semibold">{finalWinner}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentBracket;