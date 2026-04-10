import { useState, useEffect, useRef } from 'react';
import { Card, Section, Toggle, WeekDots, AddInput, CheckItem } from './UI';
import { calcHabitStreak, getWeekKey, CALM_TIPS, startRain, stopRain } from '../utils';

// ─── FÍSICO ─────────────────────────────────────────────────────────
export function FisicoTab({ gym, run, today, weekGym, weekRun, streak, onLogGym, onLogRun, fasting, wk, onLogFast }) {
  const weekFast = Object.keys(fasting || {}).filter(d => {
    const start = new Date(wk);
    const end = new Date(wk); end.setDate(end.getDate() + 7);
    const day = new Date(d);
    return day >= start && day < end;
  }).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Card><Section icon="🏋️" text="Gimnasio" color="var(--c1)">
        <WeekDots current={weekGym} max={3} color="var(--c1)" icon="🏋️" />
        <div style={{ marginTop: 12 }}><Toggle label={gym[today] ? "Gym ✓" : "Fui al gym"} active={!!gym[today]} color="var(--c1)" onToggle={onLogGym} icon="🏋️" /></div>
      </Section></Card>

      <Card><Section icon="🏃" text="Corrida" color="var(--c2)">
        <WeekDots current={weekRun} max={3} color="var(--c2)" icon="🏃" />
        <div style={{ marginTop: 12 }}><Toggle label={run[today] ? "Corrida ✓" : "Corrí hoy"} active={!!run[today]} color="var(--c2)" onToggle={onLogRun} icon="🏃" /></div>
      </Section></Card>

      <Card><Section icon="⚡" text="Ayuno Semanal" color="var(--c3)">
        <div style={{ fontFamily: 'var(--mf)', fontSize: 10, color: 'var(--t2)', marginBottom: 10 }}>
          Esta semana: <span style={{ color: 'var(--c3)', fontWeight: 700 }}>{weekFast}</span> ayuno{weekFast !== 1 ? 's' : ''}
        </div>
        <Toggle
          label={(fasting || {})[today] ? "Ayuno ✓" : "Hice ayuno hoy"}
          active={!!(fasting || {})[today]}
          color="var(--c3)"
          onToggle={onLogFast}
          icon="⚡"
        />
        <div style={{ fontFamily: 'var(--mf)', fontSize: 10, color: 'var(--t2)', marginTop: 8 }}>
          Total: {Object.keys(fasting || {}).length} ayunos
        </div>
      </Section></Card>

      <Card style={{ background: 'linear-gradient(135deg, var(--sf), #2d1b1b)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: 32 }}>🔥</div><div style={{ fontWeight: 900, fontSize: 28, color: 'var(--c5)' }}>{streak}</div><div style={{ fontFamily: 'var(--mf)', fontSize: 10, color: 'var(--t2)' }}>racha</div></div>
          <div style={{ width: 1, background: 'var(--bd)' }} />
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: 32 }}>📈</div><div style={{ fontWeight: 900, fontSize: 28, color: 'var(--c6)' }}>{Object.keys(gym).length + Object.keys(run).length}</div><div style={{ fontFamily: 'var(--mf)', fontSize: 10, color: 'var(--t2)' }}>total</div></div>
        </div>
      </Card>
    </div>
  );
}

// ─── WORK ────────────────────────────────────────────────────────────
export function WorkTab({ workLog, today, onLogWork }) {
  return (
    <Card><Section icon="💼" text="Agile — Hoy" color="var(--c6)">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Toggle label="Planifiqué" active={(workLog[today] || {}).planned} color="var(--c6)" onToggle={() => onLogWork('planned')} icon="📋" />
        <Toggle label="Coordinación" active={(workLog[today] || {}).coordinated} color="var(--c4)" onToggle={() => onLogWork('coordinated')} icon="📞" />
      </div>
    </Section></Card>
  );
}

// ─── EDUCACIÓN ───────────────────────────────────────────────────────
export function EduTab({ edu, courses, today, weekEdu, onLogEdu, setCourses, addXP }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Card><Section icon="📚" text="Hoy aprendí" color="var(--c4)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Toggle label="Lectura autoayuda" active={(edu[today] || {}).reading} color="var(--c4)" onToggle={() => onLogEdu('reading')} icon="📖" />
          <Toggle label="Podcast" active={(edu[today] || {}).podcast} color="var(--pink)" onToggle={() => onLogEdu('podcast')} icon="🎙️" />
          <Toggle label="Video educativo" active={(edu[today] || {}).video} color="var(--c6)" onToggle={() => onLogEdu('video')} icon="🎬" />
        </div>
        <div style={{ fontFamily: 'var(--mf)', fontSize: 10, color: 'var(--t2)', marginTop: 10 }}>Semana: {weekEdu}</div>
      </Section></Card>
      <Card><Section icon="🎓" text="Cursos (no kinesio)" color="var(--c3)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {courses.length === 0 && <p style={{ fontSize: 13, color: 'var(--t2)' }}>¿Arrancás algún curso?</p>}
          {courses.map(c => <CheckItem key={c.id} text={c.name} done={c.done}
            onToggle={() => setCourses(p => p.map(x => x.id === c.id ? { ...x, done: !x.done } : x))}
            onDelete={() => setCourses(p => p.filter(x => x.id !== c.id))} color="var(--c3)" />)}
        </div>
        <AddInput placeholder="Nuevo curso..." onAdd={t => { setCourses(p => [...p, { id: Date.now(), name: t, done: false }]); addXP(5); }} color="var(--c3)" />
      </Section></Card>
    </div>
  );
}

// ─── TAREAS ──────────────────────────────────────────────────────────
export function TareasTab({ taskLists, setTaskLists, addXP }) {
  const [sub, setSub] = useState('super');
  const tabs = [
    { id: 'super', icon: '🛒', label: 'Súper', color: 'var(--c3)' },
    { id: 'houseShop', icon: '🛋️', label: 'Compras', color: 'var(--c5)' },
    { id: 'houseTasks', icon: '🏠', label: 'Casa', color: 'var(--c2)' },
    { id: 'life', icon: '📌', label: 'Vida', color: 'var(--c4)' },
  ];
  const cur = tabs.find(t => t.id === sub) || tabs[0];
  const list = taskLists[cur.id] || [];

  const toggle = (id) => setTaskLists(p => ({ ...p, [cur.id]: p[cur.id].map(t => { if (t.id === id) { if (!t.done) addXP(5); return { ...t, done: !t.done }; } return t; }) }));
  const del = (id) => setTaskLists(p => ({ ...p, [cur.id]: p[cur.id].filter(t => t.id !== id) }));
  const add = (text) => setTaskLists(p => ({ ...p, [cur.id]: [...p[cur.id], { id: Date.now() + Math.random(), text, done: false }] }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 4, overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={{
            padding: '8px 10px', borderRadius: 10, fontSize: 11, whiteSpace: 'nowrap', cursor: 'pointer',
            fontWeight: sub === t.id ? 700 : 400,
            background: sub === t.id ? t.color + '22' : 'var(--s2)',
            color: sub === t.id ? t.color : 'var(--t2)',
            border: `1.5px solid ${sub === t.id ? t.color + '55' : 'var(--bd)'}`,
          }}>{t.icon} {t.label} ({(taskLists[t.id] || []).filter(x => !x.done).length})</button>
        ))}
      </div>
      <Card>
        <Section icon={cur.icon} text={cur.label} color={cur.color}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {list.length === 0 && <p style={{ fontSize: 13, color: 'var(--t2)' }}>Lista vacía</p>}
            {list.map(t => <CheckItem key={t.id} text={t.text} done={t.done} onToggle={() => toggle(t.id)} onDelete={() => del(t.id)} color={cur.color} />)}
          </div>
          <AddInput placeholder="Agregar..." onAdd={add} color={cur.color} />
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {list.some(t => t.done) && <button onClick={() => setTaskLists(p => ({ ...p, [cur.id]: p[cur.id].filter(t => !t.done) }))} style={{ background: 'none', border: '1px solid var(--bd)', borderRadius: 8, padding: '5px 10px', color: 'var(--t2)', fontFamily: 'var(--mf)', fontSize: 10, cursor: 'pointer' }}>Limpiar ✓</button>}
            {list.length > 0 && <button onClick={() => { if (window.confirm('¿Borrar toda la lista?')) setTaskLists(p => ({ ...p, [cur.id]: [] })); }} style={{ background: 'none', border: '1px solid #ff6b6b44', borderRadius: 8, padding: '5px 10px', color: '#ff6b6b', fontFamily: 'var(--mf)', fontSize: 10, cursor: 'pointer' }}>Vaciar</button>}
          </div>
        </Section>
      </Card>
    </div>
  );
}

// ─── DIGITAL ─────────────────────────────────────────────────────────
export function DigitalTab({ twitter, today, onLogTwitter }) {
  return (
    <Card><Section icon="🐦" text="Twitter" color="var(--c6)">
      <Toggle label={twitter[today] ? "Twitter ✓" : "Estuve en Twitter"} active={!!twitter[today]} color="var(--c6)" onToggle={onLogTwitter} icon="🐦" />
      <div style={{ fontFamily: 'var(--mf)', fontSize: 10, color: 'var(--t2)', marginTop: 10 }}>Total: {Object.keys(twitter).length} días</div>
    </Section></Card>
  );
}

// ─── PROYECTOS ───────────────────────────────────────────────────────
export function ProjectsTab({ projects, setProjects, addXP, today }) {
  const addIdea = (pId, text) => { if (!text.trim()) return; setProjects(p => p.map(pr => pr.id === pId ? { ...pr, ideas: [...pr.ideas, { id: Date.now(), text: text.trim(), date: today }] } : pr)); addXP(5); };
  const delIdea = (pId, iId) => setProjects(p => p.map(pr => pr.id === pId ? { ...pr, ideas: pr.ideas.filter(i => i.id !== iId) } : pr));
  const addProject = (name) => { if (!name.trim()) return; setProjects(p => [...p, { id: Date.now(), name: name.trim(), icon: '📁', ideas: [] }]); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {projects.map(p => (
        <Card key={p.id}>
          <Section icon={p.icon} text={p.name} color={p.id === 1 ? 'var(--grn)' : 'var(--c5)'}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {p.ideas.length === 0 && <p style={{ fontSize: 13, color: 'var(--t2)' }}>Anotá ideas para desarrollar juntos</p>}
              {p.ideas.map(idea => (
                <div key={idea.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 12px', background: 'var(--s2)', borderRadius: 8, border: '1px solid var(--bd)' }}>
                  <span style={{ color: 'var(--c3)', fontSize: 14 }}>💡</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: 'var(--tx)' }}>{idea.text}</div>
                    <div style={{ fontFamily: 'var(--mf)', fontSize: 9, color: 'var(--t2)' }}>{idea.date}</div>
                  </div>
                  <button onClick={() => delIdea(p.id, idea.id)} style={{ background: 'none', border: 'none', color: 'var(--t2)', cursor: 'pointer', fontSize: 14, opacity: .4 }}>×</button>
                </div>
              ))}
            </div>
            <AddInput placeholder="Nueva idea..." onAdd={t => addIdea(p.id, t)} color={p.id === 1 ? 'var(--grn)' : 'var(--c5)'} />
          </Section>
        </Card>
      ))}
      <Card><Section icon="➕" text="Agregar Proyecto" color="var(--c6)"><AddInput placeholder="Nombre..." onAdd={addProject} color="var(--c6)" /></Section></Card>
    </div>
  );
}

// ─── FAMILIA ─────────────────────────────────────────────────────────
export function FamilyTab({ family, weekFam, onLogFamily }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Card style={{ background: 'linear-gradient(135deg, var(--sf), #2d1a1a)', border: '1px solid var(--c1)33' }}>
        <Section icon="❤️" text="Esta Semana" color="var(--c1)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Toggle label="Llamé a papá y mamá" active={weekFam.calledParents} color="var(--c1)" onToggle={() => onLogFamily('calledParents')} icon="📞" />
            <Toggle label="Vi a Aitziber" active={weekFam.sawAitziber} color="var(--pink)" onToggle={() => onLogFamily('sawAitziber')} icon="👫" />
          </div>
        </Section>
      </Card>
      <Card>
        <div style={{ fontFamily: 'var(--mf)', fontSize: 11, color: 'var(--t2)' }}>
          Llamadas: {Object.values(family).filter(w => w.calledParents).length} sem · Aitziber: {Object.values(family).filter(w => w.sawAitziber).length} sem
        </div>
      </Card>
    </div>
  );
}

// ─── HÁBITOS ─────────────────────────────────────────────────────────
export function HabitsTab({ habits, today, onLogHabit }) {
  const wk = getWeekKey();
  const habs = [
    { k: 'comer', i: '🍽️', l: 'Comer controlado', c: 'var(--grn)' },
    { k: 'alcohol', i: '🍺', l: 'Sin alcohol', c: 'var(--c6)' },
    { k: 'fumar', i: '🚬', l: 'Sin fumar', c: 'var(--c4)', pen: true },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {habs.map(h => {
        const todayH = habits[h.k][today];
        const hStreak = calcHabitStreak(habits[h.k]);
        const weekDays = [...Array(7)].map((_, i) => { const d = new Date(wk); d.setDate(d.getDate() + i); return d.toISOString().split('T')[0]; });
        const wClean = weekDays.filter(d => habits[h.k][d] === 'clean').length;
        const wBad = weekDays.filter(d => habits[h.k][d] === 'bad').length;

        return (
          <Card key={h.k}>
            <Section icon={h.i} text={h.l} color={h.c}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ textAlign: 'center', padding: '8px 16px', background: 'var(--s2)', borderRadius: 10 }}>
                  <div style={{ fontWeight: 900, fontSize: 28, color: h.c }}>{hStreak}</div>
                  <div style={{ fontFamily: 'var(--mf)', fontSize: 9, color: 'var(--t2)' }}>racha</div>
                </div>
                <div style={{ flex: 1 }}>
                  {!todayH ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => onLogHabit(h.k, 'clean')} style={{ flex: 1, padding: 10, background: h.c + '22', border: `1.5px solid ${h.c}44`, borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 13, color: h.c }}>✓ Limpio</button>
                      <button onClick={() => onLogHabit(h.k, 'bad')} style={{ padding: '10px 14px', background: '#ff6b6b15', border: '1.5px solid #ff6b6b33', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#ff6b6b' }}>✗ Malo</button>
                    </div>
                  ) : (
                    <div style={{ padding: '10px 14px', background: todayH === 'clean' ? h.c + '11' : '#ff6b6b11', borderRadius: 10, border: `1px solid ${todayH === 'clean' ? h.c + '33' : '#ff6b6b33'}`, fontWeight: 600, fontSize: 13, color: todayH === 'clean' ? h.c : '#ff6b6b' }}>
                      {todayH === 'clean' ? '✓ +8 XP' : `✗ ${h.pen ? '-15' : '-10'} XP`}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
                {weekDays.map(d => { const s = habits[h.k][d]; return <div key={d} style={{ flex: 1, height: 8, borderRadius: 4, background: s === 'clean' ? h.c : s === 'bad' ? '#ff6b6b' : 'var(--s2)' }} />; })}
              </div>
              <div style={{ fontFamily: 'var(--mf)', fontSize: 10, color: 'var(--t2)' }}>
                Sem: <span style={{ color: h.c }}>{wClean}✓</span> · <span style={{ color: '#ff6b6b' }}>{wBad}✗</span>
              </div>
            </Section>
          </Card>
        );
      })}
    </div>
  );
}

// ─── CALMA ───────────────────────────────────────────────────────────
export function CalmaTab({ meditate, today, customQuotes, setCustomQuotes, onStartBreathing, onLogMed }) {
  const [mTm, setMTm] = useState(0);
  const [mRun, setMRun] = useState(false);
  const [mTgt, setMTgt] = useState(300);
  const mRef = useRef(null);

  const startM = () => { setMRun(true); setMTm(mTgt); mRef.current = setInterval(() => { setMTm(p => { if (p <= 1) { clearInterval(mRef.current); setMRun(false); onLogMed(); return 0; } return p - 1; }); }, 1000); };
  const stopM = () => { clearInterval(mRef.current); setMRun(false); if (mTgt - mTm > 30) onLogMed(); };
  useEffect(() => () => clearInterval(mRef.current), []);
  const fmt = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Card>
        <Section icon="🌧️" text="Respiración con Lluvia" color="var(--c6)">
          <button onClick={onStartBreathing} style={{ width: '100%', padding: 14, background: 'var(--c6)22', border: '1.5px solid var(--c6)55', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14, color: 'var(--c6)' }}>🌧️ Iniciar</button>
          {meditate[today] && <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--c6)', marginTop: 8, textAlign: 'center' }}>🧘 Meditaste hoy ✓</div>}
        </Section>
      </Card>

      <Card>
        <Section icon="⏱️" text="Timer" color="var(--c4)">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 8 }}>
            <div style={{ fontFamily: 'var(--mf)', fontSize: 36, color: mRun ? 'var(--c4)' : 'var(--tx)', marginBottom: 12 }}>{fmt(mRun ? mTm : mTgt)}</div>
            {!mRun ? (
              <>
                <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                  {[120, 300, 600].map(s => <button key={s} onClick={() => setMTgt(s)} style={{ padding: '6px 14px', borderRadius: 8, fontFamily: 'var(--mf)', fontSize: 11, background: mTgt === s ? 'var(--c4)22' : 'var(--s2)', color: mTgt === s ? 'var(--c4)' : 'var(--t2)', border: `1px solid ${mTgt === s ? 'var(--c4)44' : 'var(--bd)'}`, cursor: 'pointer' }}>{s / 60}m</button>)}
                </div>
                <button onClick={startM} style={{ padding: '10px 24px', background: 'var(--c4)22', border: '1.5px solid var(--c4)55', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14, color: 'var(--c4)' }}>Empezar</button>
              </>
            ) : <button onClick={stopM} style={{ padding: '10px 24px', background: 'var(--c1)22', border: '1.5px solid var(--c1)44', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14, color: 'var(--c1)' }}>Parar</button>}
          </div>
        </Section>
      </Card>

      <Card>
        <Section icon="✍️" text="Mis Frases" color="var(--c3)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {customQuotes.length === 0 && <p style={{ fontSize: 13, color: 'var(--t2)' }}>Agregá frases motivacionales</p>}
            {customQuotes.map((q, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--s2)', borderRadius: 8, border: '1px solid var(--bd)' }}>
                <span style={{ fontSize: 14 }}>✍️</span>
                <span style={{ flex: 1, fontSize: 13, color: 'var(--tx)' }}>{q}</span>
                <button onClick={() => setCustomQuotes(p => p.filter((_, j) => j !== i))} style={{ background: '#ff6b6b22', border: '1px solid #ff6b6b44', color: '#ff6b6b', cursor: 'pointer', fontSize: 12, padding: '2px 6px', borderRadius: 6, fontWeight: 700 }}>×</button>
              </div>
            ))}
          </div>
          <AddInput placeholder="Nueva frase..." onAdd={t => setCustomQuotes(p => [...p, t])} color="var(--c3)" />
        </Section>
      </Card>

      <Card>
        <Section icon="💡" text="Tips" color="var(--c4)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {CALM_TIPS.map((t, i) => (
              <div key={i} style={{ padding: '8px 12px', background: 'var(--s2)', borderRadius: 8, border: '1px solid var(--bd)' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--c4)' }}>{t.t}</div>
                <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 2 }}>{t.d}</div>
              </div>
            ))}
          </div>
        </Section>
      </Card>
    </div>
  );
}

// ─── LOGROS ──────────────────────────────────────────────────────────
export function LogrosTab({ achs, ACHS_LIST }) {
  return (
    <Card>
      <Section icon="🏆" text="Logros" color="var(--c3)">
        <div style={{ fontFamily: 'var(--mf)', fontSize: 11, color: 'var(--t2)', marginBottom: 12 }}>{achs.length}/{ACHS_LIST.length}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {ACHS_LIST.map(a => {
            const ok = achs.includes(a.id);
            return (
              <div key={a.id} style={{ padding: 12, borderRadius: 10, background: ok ? 'var(--s2)' : 'var(--sf)', border: `1px solid ${ok ? 'var(--c3)44' : 'var(--bd)'}`, opacity: ok ? 1 : .4 }}>
                <div style={{ fontSize: 22, marginBottom: 3, filter: ok ? 'none' : 'grayscale(1)' }}>{a.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 11, color: ok ? 'var(--c3)' : 'var(--t2)' }}>{a.name}</div>
                <div style={{ fontFamily: 'var(--mf)', fontSize: 8, color: 'var(--t2)' }}>{a.desc}</div>
                {ok && <div style={{ fontFamily: 'var(--mf)', fontSize: 8, color: 'var(--c2)', marginTop: 2 }}>+{a.xp}</div>}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 16, padding: 12, background: 'var(--s2)', borderRadius: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--c1)', marginBottom: 4 }}>⚠️ Penalizaciones</div>
          <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.6 }}>Fumar: <b style={{ color: '#ff6b6b' }}>-15 XP</b> · Comer/Alcohol: <b style={{ color: '#ff6b6b' }}>-10 XP</b></div>
        </div>
      </Section>
    </Card>
  );
}
