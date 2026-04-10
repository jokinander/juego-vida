import { useState } from 'react';
import { MOODS, formatDate } from '../utils';

export default function MorningCheckin({ gratitudes, setGratitudes, onDone }) {
  const [mood, setMood] = useState(null);
  const [gIdx, setGIdx] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newG, setNewG] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (!mood) { setError('Elegí cómo arrancás hoy 👆'); return; }
    if (gIdx === null) { setError('Elegí algo por lo que estés agradecido 🙏'); return; }
    setError('');
    onDone(mood, gratitudes[gIdx]);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0c0c18, #1a1030, #0c0c18)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 24,
    }}>
      <div style={{ fontSize: 48, marginBottom: 8 }}>🎮</div>
      <h1 style={{ fontWeight: 900, fontSize: 24, color: 'var(--tx)', marginBottom: 2 }}>
        Buenos días, Jok
      </h1>
      <p style={{ fontWeight: 300, fontSize: 13, color: 'var(--c3)', marginBottom: 4, letterSpacing: 1 }}>
        EL JUEGO DE MI VIDA
      </p>
      <p style={{ fontFamily: 'var(--mf)', fontSize: 11, color: 'var(--t2)', marginBottom: 24 }}>
        {formatDate()}
      </p>

      <p style={{ fontSize: 15, color: 'var(--c4)', marginBottom: 16 }}>¿Cómo arrancás hoy?</p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
        {MOODS.map((m, i) => (
          <button key={i} onClick={() => { setMood(m); setError(''); }} style={{
            padding: '14px 10px', background: mood === m ? m.color + '25' : 'var(--sf)',
            border: `2px solid ${mood === m ? m.color : 'var(--bd)'}`,
            borderRadius: 14, cursor: 'pointer', width: 60, textAlign: 'center',
            transition: 'all .15s',
          }}>
            <div style={{ fontSize: 28 }}>{m.emoji}</div>
            <div style={{ fontFamily: 'var(--mf)', fontSize: 9, color: mood === m ? m.color : 'var(--t2)', marginTop: 4 }}>{m.label}</div>
          </button>
        ))}
      </div>

      <p style={{ fontFamily: 'var(--mf)', fontSize: 11, color: 'var(--t2)', marginBottom: 10 }}>
        Agradecido por <span style={{ color: 'var(--c1)' }}>*</span>
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', maxWidth: 400, marginBottom: 12 }}>
        {gratitudes.map((g, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <button onClick={() => { setGIdx(gIdx === i ? null : i); setError(''); }} style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 12,
              background: gIdx === i ? 'var(--c3)22' : 'var(--sf)',
              color: gIdx === i ? 'var(--c3)' : 'var(--t2)',
              border: `1px solid ${gIdx === i ? 'var(--c3)55' : 'var(--bd)'}`,
              cursor: 'pointer',
            }}>{g}</button>
            <button onClick={() => { setGratitudes(p => p.filter((_, j) => j !== i)); if (gIdx === i) setGIdx(null); }} style={{
              background: '#ff6b6b22', border: '1px solid #ff6b6b44', color: '#ff6b6b',
              cursor: 'pointer', fontSize: 12, padding: '2px 6px', borderRadius: 6, fontWeight: 700,
            }}>×</button>
          </div>
        ))}
      </div>

      {!adding ? (
        <button onClick={() => setAdding(true)} style={{
          background: 'none', border: '1px dashed var(--bd)', borderRadius: 8,
          padding: '5px 12px', color: 'var(--t2)', fontFamily: 'var(--mf)',
          fontSize: 10, cursor: 'pointer', marginBottom: 20,
        }}>+ Agregar opción</button>
      ) : (
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          <input value={newG} onChange={e => setNewG(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && newG.trim()) { setGratitudes(p => [...p, newG.trim()]); setNewG(''); setAdding(false); } }}
            placeholder="Nueva opción..." autoFocus
            style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 8, padding: '5px 10px', color: 'var(--tx)', fontSize: 12, outline: 'none', width: 160 }} />
          <button onClick={() => { if (newG.trim()) setGratitudes(p => [...p, newG.trim()]); setNewG(''); setAdding(false); }}
            style={{ background: 'var(--c3)', border: 'none', borderRadius: 8, padding: '5px 10px', color: '#000', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>OK</button>
        </div>
      )}

      {error && (
        <div style={{ marginBottom: 14, padding: '8px 16px', background: '#ff6b6b15', border: '1px solid #ff6b6b44', borderRadius: 10, color: '#ff6b6b', fontSize: 13, fontWeight: 600 }}>
          {error}
        </div>
      )}

      <button onClick={submit} style={{
        padding: '14px 40px', background: 'linear-gradient(135deg, var(--c1), var(--c3))',
        border: 'none', borderRadius: 14, cursor: 'pointer', fontWeight: 900,
        fontSize: 16, color: '#fff', letterSpacing: 1,
      }}>
        ARRANCAR 🎮
      </button>
    </div>
  );
}
