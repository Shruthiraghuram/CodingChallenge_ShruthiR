import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { playerService } from '../services/playerService';

const ROLE_BADGE = {
  batsman: 'bg-info text-dark',
  bowler: 'bg-success',
  'all-rounder': 'bg-primary',
  wicketkeeper: 'bg-warning text-dark',
};

function Players() {
  const [players, setPlayers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const load = () => {
    setLoading(true);
    playerService.getPlayers()
      .then((r) => { setPlayers(r.data || []); setLoading(false); })
      .catch(() => { setError('Failed to load players.'); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let list = [...players];
    if (search.trim())
      list = list.filter((p) => p.playerName.toLowerCase().includes(search.toLowerCase()));
    if (roleFilter)
      list = list.filter((p) => p.role === roleFilter);
    setFiltered(list);
  }, [players, search, roleFilter]);

  const confirmDelete = () => {
    setDeleting(true);
    playerService.deletePlayer(deleteTarget.playerId)
      .then(() => {
        setPlayers((prev) => prev.filter((p) => p.playerId !== deleteTarget.playerId));
        setSuccessMsg(`${deleteTarget.playerName} removed successfully.`);
        setDeleteTarget(null);
        setDeleting(false);
        setTimeout(() => setSuccessMsg(''), 3000);
      })
      .catch(() => { setError('Delete failed.'); setDeleting(false); });
  };

  const roleBadge = (role = '') => {
    const cls = ROLE_BADGE[role.toLowerCase()] || 'bg-secondary';
    return <span className={`badge role-badge ${cls}`}>{role || '—'}</span>;
  };

  return (
    <div className="container py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h1 className="page-title">Players</h1>
          <p className="page-subtitle">Full squad roster</p>
        </div>
        <Link to="/add-player" className="btn btn-primary btn-sm">+ Add Player</Link>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="alert alert-success alert-dismissible py-2" role="alert">
          {successMsg}
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}
      {error && (
        <div className="alert alert-danger alert-dismissible py-2" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-3">
        <div className="card-body py-2">
          <div className="row g-2">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search by player name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select form-select-sm"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option>Batsman</option>
                <option>Bowler</option>
                <option>All-rounder</option>
                <option>Wicketkeeper</option>
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary btn-sm w-100"
                onClick={() => { setSearch(''); setRoleFilter(''); }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5 text-muted">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No players found.{' '}
              <Link to="/add-player">Add one?</Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover player-table mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Jersey #</th>
                    <th>Role</th>
                    <th>Team</th>
                    <th>Matches</th>
                    <th>Country/State</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((player) => (
                    <tr key={player.playerId}>
                      <td className="text-muted">{player.playerId}</td>
                      <td className="fw-semibold">{player.playerName}</td>
                      <td>{player.jerseyNumber}</td>
                      <td>{roleBadge(player.role)}</td>
                      <td>{player.teamName || '—'}</td>
                      <td>{player.totalMatches ?? '—'}</td>
                      <td>{player.countryStateName || '—'}</td>
                      <td className="text-center">
                        <Link
                          to={`/edit-player/${player.playerId}`}
                          className="btn btn-warning btn-sm me-1"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleteTarget(player)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete <strong>{deleteTarget.playerName}</strong> (Jersey #{deleteTarget.jerseyNumber})?
                <br />
                <small className="text-danger">This action cannot be undone.</small>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={confirmDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Players;
