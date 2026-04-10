import { useState } from 'react';

export default function EveningJournal({ prompt, value, onChange, onSave, onSkip }) {
  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(180deg, #0c0c18, #0c1220, #0c0c18)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ fontSize: 48, marginBottom: 8 }}>🌙</div>
      <h1 style={{ fontWeight: 900, fontSize: 22, color: 'var(--tx)', marginBottom: 4 }}>Buenas noches, Jok</h1>
      <p style={{ fontSize: 15, color: 'var(--c4)', marginBottom: 20, textAlign: 'center' }}>{prompt}</p>
      <textarea
        placeholder="Algo lindo que me pasó hoy..."
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', maxWidth: 380, minHeight: 80, background: 'var(--sf)',
          border: '1px solid var(--bd)', borderRadius: 12, padding: 14,
          color: 'var(--tx)', fontSize: 15, outline: 'none', resize: 'vertical', marginBottom: 16,
        }}
      />
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onSave} style={{
          padding: '12px 28px', background: '#a78bfa22', border: '1.5px solid #a78bfa55',
          borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: 15, color: '#a78bfa',
        }}>Guardar ✨</button>
        <button onClick={onSkip} style={{
          padding: '12px 20px', background: 'var(--s2)', border: '1px solid var(--bd)',
          borderRadius: 12, cursor: 'pointer', fontSize: 13, color: 'var(--t2)',
        }}>Saltar</button>
      </div>
    </div>
  );
}
