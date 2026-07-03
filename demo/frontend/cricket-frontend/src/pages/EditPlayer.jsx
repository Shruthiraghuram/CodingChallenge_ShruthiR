import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { playerService } from '../services/playerService';
import PlayerForm from './PlayerForm';

function EditPlayer() {
  const { id } = useParams();
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    playerService.getPlayerById(id)
      .then((r) => {
        const p = r.data;
        setInitial({
          playerName: p.playerName || '',
          jerseyNumber: p.jerseyNumber ?? '',
          role: p.role || '',
          totalMatches: p.totalMatches ?? '',
          teamName: p.teamName || '',
          countryStateName: p.countryStateName || '',
          description: p.description || '',
        });
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (dto) => {
    setSubmitting(true);
    try {
      await playerService.updatePlayer(id, dto);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container py-5 text-center text-muted">Loading...</div>;

  if (notFound) {
    return (
      <div className="container py-5 text-center">
        <p className="text-danger">Player not found.</p>
        <Link to="/players" className="btn btn-secondary btn-sm">Back to Players</Link>
      </div>
    );
  }

  return (
    <PlayerForm
      title="Edit Player"
      initialData={initial}
      onSubmit={handleSubmit}
      submitting={submitting}
    />
  );
}

export default EditPlayer;
