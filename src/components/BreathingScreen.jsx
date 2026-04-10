import { useState, useEffect, useRef } from 'react';
import { GUIDED_STEPS, startRain, stopRain } from '../utils';

export default function BreathingScreen({ onDone, onSkip }) {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState(null); // inhale, hold, exhale
  const [count, setCount] = useState(0);
  const [timer, setTimer] = useState(4);
  const [rainActive, setRainActive] = useState(false);
  const ref = useRef(null);

  const colors = { inhale: '#22d3ee', hold: '#a78bfa', exhale: '#34d399' };
  const labels = { inhale: 'INHALÁ', hold: 'MANTENÉ', exhale: 'EXHALÁ' };
  const scales = { inhale: 1.4, hold: 1.4, exhale: 1 };

  const start = () => {
    startRain(); setRainActive(true);
    setPhase('inhale'); setCount(0); setTimer(4);
    let ph = 'inhale', cnt = 0, tm = 4;
    ref.current = setInterval(() => {
      tm--;
      if (tm <= 0) {
        if (ph === 'inhale') { ph = 'hold'; tm = 4; }
        else if (ph === 'hold') { ph = 'exhale'; tm = 4; }
        else { cnt++; if (cnt >= 5) { clearInterval(ref.current); setPhase(null); setCount(5); stopRain(); setRainActive(false); return; } ph = 'inhale'; tm = 4; }
      }
      setPhase(ph); setCount(cnt); setTimer(tm);
    }, 1000);
  };

  const skip = () => { clearInterval(ref.current); stopRain(); setRainActive(false); onSkip(); };
  const done = () => { stopRain(); setRainActive(false); onDone(); };

  useEffect(() => () => { clearInterval(ref.current); stopRain(); }, []);

  // Guided meditation steps
  if (step < GUIDED_STEPS.length) {
    return (
      <div style={{
        minHeight: '100vh', background: 'linear-gradient(180deg, #0c0c18, #0c1525, #0c0c18)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32,
      }}>
        <div style={{ fontSize: 42, marginBottom: 20 }}>🧘</div>
        <p style={{ fontSize: 17, color: 'var(--tx)', textAlign: 'center', lineHeight: 1.6, maxWidth: 340, marginBottom: 28 }}>
          {GUIDED_STEPS[step]}
        </p>
        <button onClick={() => setStep(s => s + 1)} style={{
          padding: '12px 32px', background: '#22d3ee22', border: '1.5px solid #22d3ee55',
          borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: 15, color: '#22d3ee',
        }}>Siguiente →</button>
        <button onClick={skip} style={{ marginTop: 12, background: 'none', border: 'none', color: 'var(--t2)', cursor: 'pointer', fontFamily: 'var(--mf)', fontSize: 11 }}>Saltar</button>
      </div>
    );
  }

  // Breathing exercise
  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(180deg, #0c0c18, #0c1525, #0c0c18)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32,
    }}>
      {rainActive && <div style={{ position: 'fixed', top: 16, right: 16, fontFamily: 'var(--mf)', fontSize: 10, color: '#22d3ee', opacity: 0.6 }}>🌧️ lluvia</div>}

      <div style={{
        width: 140, height: 140, borderRadius: '50%',
        background: phase ? `radial-gradient(circle, ${colors[phase]}33, transparent)` : 'var(--s2)',
        border: `3px solid ${phase ? colors[phase] : 'var(--bd)'}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        transition: 'all 1s ease', transform: `scale(${phase ? scales[phase] : 1})`, marginBottom: 20,
      }}>
        {phase ? (
          <>
            <div style={{ fontWeight: 800, fontSize: 14, color: colors[phase] }}>{labels[phase]}</div>
            <div style={{ fontFamily: 'var(--mf)', fontSize: 28, color: 'var(--tx)' }}>{timer}</div>
          </>
        ) : count >= 5 ? (
          <div style={{ fontWeight: 700, fontSize: 14, color: '#22d3ee' }}>✓ Listo</div>
        ) : (
          <div style={{ fontFamily: 'var(--mf)', fontSize: 11, color: 'var(--t2)', textAlign: 'center' }}>
            5 ciclos<br />4-4-4<br />🌧️ con lluvia
          </div>
        )}
      </div>

      {count > 0 && phase && <div style={{ fontFamily: 'var(--mf)', fontSize: 10, color: 'var(--t2)', marginBottom: 12 }}>Ciclo {count + 1}/5</div>}

      {!phase && count < 5 && (
        <button onClick={start} style={{
          padding: '12px 28px', background: '#22d3ee22', border: '1.5px solid #22d3ee55',
          borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: 15, color: '#22d3ee', marginBottom: 8,
        }}>🌧️ Empezar con Lluvia</button>
      )}

      {count >= 5 && !phase && (
        <button onClick={done} style={{
          padding: '12px 28px', background: '#22d3ee22', border: '1.5px solid #22d3ee55',
          borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: 15, color: '#22d3ee', marginBottom: 8,
        }}>Continuar →</button>
      )}

      <button onClick={skip} style={{ background: 'none', border: 'none', color: 'var(--t2)', cursor: 'pointer', fontFamily: 'var(--mf)', fontSize: 11 }}>Saltar</button>
    </div>
  );
}
