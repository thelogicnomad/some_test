import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchFixtures, updateFixture } from '../../lib/api.js';

const StatusBadge = ({ status }) => {
  const color = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    inprogress: 'bg-yellow-100 text-yellow-800',
  }[status] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>{status}</span>
  );
};

const FixturesBackend = () => {
  const { id: tournamentId, tournamentId: tidParam } = useParams();
  const tid = tournamentId || tidParam;

  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState({}); // {fixtureId: {scoreA, scoreB, winner}}

  useEffect(() => {
    if (!tid) return;
    setLoading(true);
    fetchFixtures(tid)
      .then((f) => setFixtures(f))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [tid]);

  const handleInputChange = (fixtureId, field, value) => {
    setEditData((prev) => ({
      ...prev,
      [fixtureId]: {
        ...prev[fixtureId],
        [field]: value,
      },
    }));
  };

  const handleSave = async (fixture) => {
    const payload = editData[fixture._id] || {};
    if (Object.keys(payload).length === 0) return;
    try {
      const updated = await updateFixture(fixture._id, payload);
      setFixtures((prev) => prev.map((fx) => (fx._id === updated._id ? updated : fx)));
      setEditData((prev) => {
        const copy = { ...prev };
        delete copy[fixture._id];
        return copy;
      });
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div>Loading fixtures...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="p-4 bg-white rounded shadow overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">Round</th>
            <th className="px-4 py-2">Match</th>
            <th className="px-4 py-2">Team A</th>
            <th className="px-4 py-2">Team B</th>
            <th className="px-4 py-2">Score A</th>
            <th className="px-4 py-2">Score B</th>
            <th className="px-4 py-2">Winner</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {fixtures.map((fx) => {
            const edit = editData[fx._id] || {};
            return (
              <tr key={fx._id} className="border-b last:border-0">
                <td className="px-4 py-2">{fx.roundName}</td>
                <td className="px-4 py-2">{fx.matchIndex + 1}</td>
                <td className="px-4 py-2 font-medium">{fx.teamA?.name}</td>
                <td className="px-4 py-2 font-medium">{fx.teamB?.name}</td>
                <td className="px-2">
                  <input
                    type="number"
                    className="border px-2 py-1 w-16"
                    value={edit.scoreA ?? fx.scoreA ?? ''}
                    onChange={(e) => handleInputChange(fx._id, 'scoreA', Number(e.target.value))}
                  />
                </td>
                <td className="px-2">
                  <input
                    type="number"
                    className="border px-2 py-1 w-16"
                    value={edit.scoreB ?? fx.scoreB ?? ''}
                    onChange={(e) => handleInputChange(fx._id, 'scoreB', Number(e.target.value))}
                  />
                </td>
                <td className="px-4 py-2">
                  <select
                    className="border px-2 py-1"
                    value={edit.winner ?? fx.winner ?? ''}
                    onChange={(e) => handleInputChange(fx._id, 'winner', e.target.value || null)}
                  >
                    <option value="">--select--</option>
                    <option value={fx.teamA?._id}>{fx.teamA?.name}</option>
                    <option value={fx.teamB?._id}>{fx.teamB?.name}</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <StatusBadge status={fx.status} />
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleSave(fx)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                  >
                    Save
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FixturesBackend;
