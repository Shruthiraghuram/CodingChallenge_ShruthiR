import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { playerService } from '../services/playerService';

function Home() {
  const [stats, setStats] = useState({
    total: 0,
    batsmen: 0,
    bowlers: 0,
    allrounders: 0,
    wicketkeepers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    playerService.getPlayers()
      .then((response) => {
        const players = response.data || [];
        const s = players.reduce(
          (acc, p) => {
            acc.total += 1;
            const role = (p.role || '').toLowerCase();
            if (role === 'batsman') acc.batsmen += 1;
            else if (role === 'bowler') acc.bowlers += 1;
            else if (role === 'all-rounder') acc.allrounders += 1;
            else if (role === 'wicketkeeper') acc.wicketkeepers += 1;
            return acc;
          },
          { total: 0, batsmen: 0, bowlers: 0, allrounders: 0, wicketkeepers: 0 }
        );
        setStats(s);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const StatCard = ({ label, value, color }) => (
    <div className="col-6 col-md-4 col-lg-2">
      <div className="card stat-card h-100 text-center p-3">
        <div className="stat-value" style={{ color }}>{loading ? '—' : value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );

  return (
    <div className="container py-4">

      {/* Page header */}
      <div className="mb-4">
        <h1 className="page-title">Cricket Team Management</h1>
        <p className="page-subtitle">Manage your squad roster, roles, and player details.</p>
      </div>

      {/* Quick actions */}
      <div className="mb-4 d-flex gap-2">
        <Link to="/players" className="btn btn-primary btn-sm">View Players</Link>
        <Link to="/add-player" className="btn btn-outline-primary btn-sm">Add Player</Link>
      </div>

      {/* Stats */}
      <h2 className="h6 text-muted text-uppercase mb-3" style={{ letterSpacing: '0.05em' }}>
        Squad Summary
      </h2>
      <div className="row g-3">
        <StatCard label="Total Players" value={stats.total} color="#0d47a1" />
        <StatCard label="Batsmen" value={stats.batsmen} color="#0288d1" />
        <StatCard label="Bowlers" value={stats.bowlers} color="#388e3c" />
        <StatCard label="All-rounders" value={stats.allrounders} color="#7b1fa2" />
        <StatCard label="Wicketkeepers" value={stats.wicketkeepers} color="#f57c00" />
      </div>
    </div>
  );
}

export default Home;
