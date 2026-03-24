import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Cloud storage via Express API (replaces localStorage polyfill)
window.storage = {
  async get(key) {
    const res = await fetch(`/api/storage/${encodeURIComponent(key)}`);
    if (!res.ok) throw new Error('Key not found');
    return res.json();
  },
  async set(key, value) {
    const res = await fetch(`/api/storage/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
    if (!res.ok) return null;
    return res.json();
  },
  async delete(key) {
    const res = await fetch(`/api/storage/${encodeURIComponent(key)}`, { method: 'DELETE' });
    if (!res.ok) return null;
    return res.json();
  },
  async list(prefix = '') {
    const res = await fetch(`/api/storage?prefix=${encodeURIComponent(prefix)}`);
    return res.json();
  }
};

// Seed: migrar datos de localStorage a la nube (una sola vez)
async function seedIfNeeded() {
  for (const key of ['belectric-v4', 'kiki-v4']) {
    const local = localStorage.getItem(key);
    if (!local) continue;
    try {
      await window.storage.get(key); // ya existe en la nube? skip
    } catch {
      await window.storage.set(key, local); // subir desde localStorage
      console.log(`Seeded ${key} to cloud`);
    }
  }
}

seedIfNeeded().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode><App /></React.StrictMode>
  );
});
