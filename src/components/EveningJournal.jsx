import { useState } from 'react';

export default function EveningJournal({ prompt, value, onChange, onSave, onSkip }) {
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!value || value.trim().length < 3) {
      setError('Escribí algo antes de continuar ✍️');
      return;
    }
    setError('');
    onSave();
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(180deg, #0c0c18, #0c1220, #0c0c18)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ fontSize: 48, marginBottom: 8 }}>🌙</div>
      <h1 style={{ fontWeight: 900, fontSize: 22, color: 'var(--tx)', marginBottom: 4 }}>Buenas noches, Jok</h1>
      <p style={{ fontFamily: 'var(--mf)', fontSize: 11, color: 'var(--c3)', marginBottom: 8, letterSpacing: 1 }}>
        REFLEXIÓN DEL DÍA
      </p>
      <p style={{ fontSize: 15, color: 'var(--c4)', marginBottom: 20, textAlign: 'center', maxWidth: 340 }}>{prompt}</p>
      <textarea
        placeholder="Contá algo de hoy..."
        value={value || ''}
        onChange={e => { onChange(e.target.value); setError(''); }}
        style={{
          width: '100%', maxWidth: 380, minHeight: 120, background: 'var(--sf)',
          border: `1px solid ${error ? '#ff6b6b' : 'var(--bd)'}`, borderRadius: 12, padding: 14,
          color: 'var(--tx)', fontSize: 15, outline: 'none', resize: 'vertical', marginBottom: 12,
        }}
      />
      {error && (
        <div style={{ marginBottom: 12, padding: '8px 16px', background: '#ff6b6b15', border: '1px solid #ff6b6b44', borderRadius: 10, color: '#ff6b6b', fontSize: 13, fontWeight: 600 }}>
          {error}
        </div>
      )}
      <button onClick={handleSave} style={{
        padding: '14px 40px', background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
        border: 'none', borderRadius: 14, cursor: 'pointer', fontWeight: 900,
        fontSize: 16, color: '#fff', letterSpacing: 1,
      }}>
        GUARDAR ✨
      </button>
      <p style={{ marginTop: 14, fontFamily: 'var(--mf)', fontSize: 10, color: 'var(--t2)', textAlign: 'center' }}>
        Este momento es tuyo. Tomá un minuto. 🌙
      </p>
    </div>
  );
}
