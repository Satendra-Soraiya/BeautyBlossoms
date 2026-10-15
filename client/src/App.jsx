import { useState, useEffect } from 'react';
import './App.css';
import { isSupabaseConfigured } from './config/supabase';
import { checkServerHealth } from './services/api';

function App() {
  const [serverStatus, setServerStatus] = useState({ loading: true, data: null, error: null });
  const clientSupabaseReady = isSupabaseConfigured();

  const fetchStatus = async () => {
    setServerStatus({ loading: true, data: null, error: null });
    const result = await checkServerHealth();
    if (result.ok) {
      setServerStatus({ loading: false, data: result.data, error: null });
    } else {
      setServerStatus({ loading: false, data: null, error: result.error });
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <div className="badge">MERN + Supabase Stack</div>
        <h1>BeautyBlossoms Environment</h1>
        <p className="subtitle">Developer environment and services status dashboard</p>
      </header>

      <section className="cards-grid">
        {/* Frontend Status */}
        <div className="card">
          <div className="card-header">
            <h3>Frontend (Client)</h3>
            <span className="status-pill status-online">Active</span>
          </div>
          <p className="card-desc">React 19 + Vite 6 Modern Client</p>
          <ul className="details-list">
            <li><strong>Port:</strong> 5173</li>
            <li><strong>Vite Proxy:</strong> Enabled (/api &rarr; :5000)</li>
            <li>
              <strong>Client Supabase:</strong>{' '}
              {clientSupabaseReady ? (
                <span className="text-success">Configured</span>
              ) : (
                <span className="text-muted">Pending keys in client/.env</span>
              )}
            </li>
          </ul>
        </div>

        {/* Backend Status */}
        <div className="card">
          <div className="card-header">
            <h3>Backend (Server)</h3>
            {serverStatus.loading ? (
              <span className="status-pill status-pending">Checking...</span>
            ) : serverStatus.data ? (
              <span className="status-pill status-online">Connected</span>
            ) : (
              <span className="status-pill status-offline">Offline</span>
            )}
          </div>
          <p className="card-desc">Node.js + Express.js API</p>
          <ul className="details-list">
            <li><strong>Port:</strong> 5000</li>
            <li>
              <strong>Status:</strong>{' '}
              {serverStatus.loading ? (
                'Connecting...'
              ) : serverStatus.data ? (
                `Online (Uptime: ${serverStatus.data.uptimeSeconds}s)`
              ) : (
                <span className="text-danger">Not responding</span>
              )}
            </li>
            <li>
              <strong>Server Supabase:</strong>{' '}
              {serverStatus.data?.supabase?.configured ? (
                <span className="text-success">Configured</span>
              ) : (
                <span className="text-muted">Pending keys in server/.env</span>
              )}
            </li>
          </ul>
          <button className="btn-secondary" onClick={fetchStatus}>
            Refresh Status
          </button>
        </div>

        {/* Supabase Database Status */}
        <div className="card">
          <div className="card-header">
            <h3>Supabase Database</h3>
            {serverStatus.data?.supabase?.configured || clientSupabaseReady ? (
              <span className="status-pill status-online">Configured</span>
            ) : (
              <span className="status-pill status-pending">Setup Required</span>
            )}
          </div>
          <p className="card-desc">PostgreSQL Database, Auth & Realtime</p>
          <ul className="details-list">
            <li><strong>Client config:</strong> <code>client/.env</code></li>
            <li><strong>Server config:</strong> <code>server/.env</code></li>
            <li>
              <strong>Status:</strong>{' '}
              {serverStatus.data?.supabase?.connected
                ? 'Connected to DB'
                : 'Awaiting credentials'}
            </li>
          </ul>
        </div>
      </section>

      <section className="instructions-section">
        <h2>Quick Start Guide</h2>
        <div className="instructions-card">
          <ol>
            <li>
              <strong>Configure Supabase:</strong>
              <p>Add your project URL and keys in <code>server/.env</code> and <code>client/.env</code>.</p>
            </li>
            <li>
              <strong>Start the Backend:</strong>
              <p>Run <code>cd server &amp;&amp; npm run dev</code> to launch Express on port 5000.</p>
            </li>
            <li>
              <strong>Start the Frontend:</strong>
              <p>Run <code>cd client &amp;&amp; npm run dev</code> to launch Vite on port 5173.</p>
            </li>
            <li>
              <strong>Or Run Both Concurrently:</strong>
              <p>From the project root, run <code>npm run dev</code>.</p>
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}

export default App;
