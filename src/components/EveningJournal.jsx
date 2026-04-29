import { useState } from 'react';
import { DAY_RATING } from '../utils';

export default function EveningJournal({ prompt, value, dayRating, onChangeText, onChangeRating, onSave, onSkip }) {
  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(180deg, #0c0c18, #0c1220, #0c0c18)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ fontSize: 48, marginBottom: 8 }}>🌙</div>
      <h1 style={{ fontWeight: 900, fontSize: 22, color: 'var(--tx)', marginBottom: 4 }}>Buenas noches, Jok</h1>
      
      {/* Day rating */}
      <p style={{ fontSize: 14, color: 'var(--c6)', marginBottom: 12, marginTop: 16 }}>¿Cómo estuvo tu día?</p>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {DAY_RATING.map((r, i) => (
          <button key={i} onClick={() => onChangeRating(r)} style={{
            padding: '10px 8px', background: dayRating?.label === r.label ? r.color + '22' : 'var(--sf)',
            border: `2px solid ${dayRating?.label === r.label ? r.color : 'var(--bd)'}`,
            borderRadius: 12, cursor: 'pointer', width: 56, textAlign: 'center',
          }}>
            <div style={{ fontSize: 24 }}>{r.emoji}</div>
            <div style={{ fontFamily: 'var(--mf)', fontSize: 8, color: dayRating?.label === r.label ? r.color : 'var(--t2)', marginTop: 3 }}>{r.label}</div>
          </button>
        ))}
      </div>

      <p style={{ fontSize: 15, color: 'var(--c4)', marginBottom: 12, textAlign: 'center' }}>{prompt}</p>
      <textarea
        placeholder="Algo lindo que me pasó hoy..."
        value={value || ''}
        onChange={e => onChangeText(e.target.value)}
        onFocus={e => e.stopPropagation()}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 380, minHeight: 100, background: 'var(--sf)',
          border: '1px solid var(--bd)', borderRadius: 12, padding: 14,
          color: 'var(--tx)', fontSize: 15, outline: 'none', resize: 'vertical', marginBottom: 16,
          WebkitAppearance: 'none',
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
