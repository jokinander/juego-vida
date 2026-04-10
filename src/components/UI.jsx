import { useState } from 'react';

export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--sf)', border: '1px solid var(--bd)',
      borderRadius: 14, padding: 16, ...style
    }}>{children}</div>
  );
}

export function Section({ icon, text, color = 'var(--c2)', right, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontFamily: 'var(--hf)', fontWeight: 800, fontSize: 16, color: 'var(--tx)' }}>{text}</span>
        <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${color}88, transparent)` }} />
        {right}
      </div>
      {children}
    </div>
  );
}

export function Toggle({ label, active, color, onToggle, icon }) {
  return (
    <button onClick={onToggle} style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
      borderRadius: 10, width: '100%', cursor: 'pointer', textAlign: 'left',
      background: active ? color + '15' : 'var(--s2)',
      border: `1.5px solid ${active ? color + '55' : 'var(--bd)'}`,
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
        border: `2px solid ${active ? color : 'var(--bd)'}`,
        background: active ? color : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{active && <span style={{ color: '#fff', fontSize: 13 }}>✓</span>}</div>
      {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
      <span style={{
        fontFamily: 'var(--hf)', fontSize: 14,
        color: active ? color : 'var(--tx)', fontWeight: active ? 600 : 400
      }}>{label}</span>
    </button>
  );
}

export function WeekDots({ current, max, color, icon }) {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
      {[...Array(max)].map((_, i) => (
        <div key={i} style={{
          width: 26, height: 26, borderRadius: 7, fontSize: 12,
          background: i < current ? color + '30' : 'var(--s2)',
          border: `2px solid ${i < current ? color : 'var(--bd)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{i < current ? icon : ''}</div>
      ))}
      <span style={{ fontFamily: 'var(--mf)', fontSize: 10, color: 'var(--t2)', marginLeft: 4 }}>
        {current}/{max}
      </span>
    </div>
  );
}

export function AddInput({ placeholder, onAdd, color = 'var(--c2)' }) {
  const [val, setVal] = useState('');
  const go = () => { if (val.trim()) { onAdd(val.trim()); setVal(''); } };
  return (
    <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
      <input value={val} onChange={e => setVal(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && go()} placeholder={placeholder}
        style={{
          flex: 1, background: 'var(--s2)', border: '1px solid var(--bd)',
          borderRadius: 8, padding: '8px 12px', color: 'var(--tx)',
          fontFamily: 'var(--hf)', fontSize: 13, outline: 'none',
        }} />
      <button onClick={go} style={{
        background: color, border: 'none', borderRadius: 8, padding: '8px 14px',
        color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 16,
      }}>+</button>
    </div>
  );
}

export function CheckItem({ text, done, onToggle, onDelete, color = 'var(--c2)' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
      background: done ? color + '11' : 'var(--s2)', borderRadius: 8,
      border: `1px solid ${done ? color + '33' : 'var(--bd)'}`,
    }}>
      <button onClick={onToggle} style={{
        width: 20, height: 20, borderRadius: 5, flexShrink: 0, cursor: 'pointer',
        border: `2px solid ${done ? color : 'var(--bd)'}`,
        background: done ? color : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{done && <span style={{ color: '#fff', fontSize: 12 }}>✓</span>}</button>
      <span style={{
        flex: 1, fontFamily: 'var(--hf)', fontSize: 13,
        color: done ? 'var(--t2)' : 'var(--tx)',
        textDecoration: done ? 'line-through' : 'none',
      }}>{text}</span>
      <button onClick={onDelete} style={{
        background: 'none', border: 'none', color: 'var(--t2)',
        cursor: 'pointer', fontSize: 14, opacity: 0.4,
      }}>×</button>
    </div>
  );
}
