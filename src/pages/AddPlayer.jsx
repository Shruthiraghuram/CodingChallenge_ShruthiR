import React, { useState, useEffect } from 'react';
import { playerService } from '../services/playerService';
import PlayerForm from './PlayerForm';

function AddPlayer() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (dto) => {
    setSubmitting(true);
    try {
      await playerService.addPlayer(dto);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PlayerForm
      title="Add Player"
      onSubmit={handleSubmit}
      submitting={submitting}
    />
  );
}

export default AddPlayer;
