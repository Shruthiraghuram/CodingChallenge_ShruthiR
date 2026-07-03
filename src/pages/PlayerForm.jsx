import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ROLES = ['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper'];

const EMPTY = {
  playerName: '',
  jerseyNumber: '',
  role: '',
  totalMatches: '',
  teamName: '',
  countryStateName: '',
  description: '',
};

function validate(data) {
  const errors = {};

  if (!data.playerName.trim()) {
    errors.playerName = 'Player name is required.';
  }

  const jersey = data.jerseyNumber.toString().trim();
  if (!jersey) {
    errors.jerseyNumber = 'Jersey number is required.';
  } else {
    const n = Number(jersey);
    if (!Number.isInteger(n) || n < 0 || n > 99) {
      errors.jerseyNumber = 'Must be a whole number between 0 and 99.';
    }
  }

  if (!data.role) {
    errors.role = 'Please select a role.';
  }

  if (!data.teamName.trim()) {
    errors.teamName = 'Team name is required.';
  }

  if (data.totalMatches !== '' && data.totalMatches !== null) {
    const m = Number(data.totalMatches);
    if (!Number.isInteger(m) || m < 0) {
      errors.totalMatches = 'Total matches must be a non-negative integer.';
    }
  }

  return errors;
}

function PlayerForm({ title, initialData, onSubmit, submitting }) {
  const navigate = useNavigate();
  const [data, setData] = useState(initialData || EMPTY);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (initialData) setData(initialData);
  }, [initialData]);

  const change = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setApiError('');
    const errs = validate(data);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const dto = {
      playerName: data.playerName.trim(),
      jerseyNumber: parseInt(data.jerseyNumber, 10),
      role: data.role,
      totalMatches: data.totalMatches !== '' ? parseInt(data.totalMatches, 10) : null,
      teamName: data.teamName.trim(),
      countryStateName: data.countryStateName.trim() || null,
      description: data.description.trim() || null,
    };
    try {
      await onSubmit(dto);
      navigate('/players');
    } catch {
      setApiError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '600px' }}>
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/players">Players</Link></li>
          <li className="breadcrumb-item active">{title}</li>
        </ol>
      </nav>

      <div className="card">
        <div className="card-header bg-white">
          <h5 className="mb-0">{title}</h5>
        </div>
        <div className="card-body">
          {apiError && <div className="alert alert-danger py-2 mb-3">{apiError}</div>}

          <form onSubmit={submit} noValidate>
            {/* Player Name */}
            <div className="mb-3">
              <label htmlFor="playerName" className="form-label">
                Player Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="playerName"
                name="playerName"
                className={`form-control form-control-sm ${errors.playerName ? 'is-invalid' : ''}`}
                placeholder="e.g. Virat Kohli"
                value={data.playerName}
                onChange={change}
                disabled={submitting}
              />
              {errors.playerName && <div className="invalid-feedback">{errors.playerName}</div>}
            </div>

            <div className="row g-3 mb-3">
              {/* Jersey Number */}
              <div className="col-md-6">
                <label htmlFor="jerseyNumber" className="form-label">
                  Jersey Number <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  id="jerseyNumber"
                  name="jerseyNumber"
                  className={`form-control form-control-sm ${errors.jerseyNumber ? 'is-invalid' : ''}`}
                  placeholder="0–99"
                  value={data.jerseyNumber}
                  onChange={change}
                  disabled={submitting}
                />
                {errors.jerseyNumber && <div className="invalid-feedback">{errors.jerseyNumber}</div>}
              </div>

              {/* Role */}
              <div className="col-md-6">
                <label htmlFor="role" className="form-label">
                  Role <span className="text-danger">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  className={`form-select form-select-sm ${errors.role ? 'is-invalid' : ''}`}
                  value={data.role}
                  onChange={change}
                  disabled={submitting}
                >
                  <option value="">Select role</option>
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
                {errors.role && <div className="invalid-feedback">{errors.role}</div>}
              </div>
            </div>

            <div className="row g-3 mb-3">
              {/* Team Name */}
              <div className="col-md-6">
                <label htmlFor="teamName" className="form-label">
                  Team Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="teamName"
                  name="teamName"
                  className={`form-control form-control-sm ${errors.teamName ? 'is-invalid' : ''}`}
                  placeholder="e.g. India"
                  value={data.teamName}
                  onChange={change}
                  disabled={submitting}
                />
                {errors.teamName && <div className="invalid-feedback">{errors.teamName}</div>}
              </div>

              {/* Total Matches */}
              <div className="col-md-6">
                <label htmlFor="totalMatches" className="form-label">
                  Total Matches <span className="text-muted">(optional)</span>
                </label>
                <input
                  type="number"
                  id="totalMatches"
                  name="totalMatches"
                  className={`form-control form-control-sm ${errors.totalMatches ? 'is-invalid' : ''}`}
                  placeholder="e.g. 150"
                  value={data.totalMatches}
                  onChange={change}
                  disabled={submitting}
                />
                {errors.totalMatches && <div className="invalid-feedback">{errors.totalMatches}</div>}
              </div>
            </div>

            {/* Country / State */}
            <div className="mb-3">
              <label htmlFor="countryStateName" className="form-label">
                Country / State <span className="text-muted">(optional)</span>
              </label>
              <input
                type="text"
                id="countryStateName"
                name="countryStateName"
                className="form-control form-control-sm"
                placeholder="e.g. Karnataka, India"
                value={data.countryStateName}
                onChange={change}
                disabled={submitting}
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description <span className="text-muted">(optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="form-control form-control-sm"
                placeholder="Brief description of the player..."
                value={data.description}
                onChange={change}
                disabled={submitting}
              />
            </div>

            <hr />
            <div className="d-flex gap-2 justify-content-end">
              <Link to="/players" className="btn btn-secondary btn-sm">Cancel</Link>
              <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PlayerForm;
