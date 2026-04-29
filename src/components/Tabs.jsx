import { useState, useEffect, useRef } from 'react';
import { Card, Section, Toggle, WeekDots, AddInput, CheckItem } from './UI';
import { calcHabitStreak, getWeekKey, XP } from '../utils';

// ─── FÍSICO ─────────────────────────────────────────────────────────
export function FisicoTab({ gym, run, plank, pushups, today, weekGym, weekRun, weekPlank, streak, onLogGym, onLogRun, onLogPlank, onLogPushups }) {
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
      <Card><Section icon="🧱" text="Plancha" color="var(--c5)">
        <WeekDots current={weekPlank} max={3} color="var(--c5)" icon="🧱" />
        <div style={{ marginTop: 12 }}><Toggle label={plank[today] ? "Plancha ✓" : "Hice plancha"} active={!!plank[today]} color="var(--c5)" onToggle={onLogPlank} icon="🧱" /></div>
      </Section></Card>
      <Card><Section icon="💪" text="Flexiones (diario)" color="var(--c4)">
        <Toggle label={pushups[today] ? "Flexiones ✓" : "Hice flexiones"} active={!!pushups[today]} color="var(--c4)" onToggle={onLogPushups} icon="💪" />
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

// ─── WORK (with notes) ──────────────────────────────────────────────
export function WorkTab({ workLog, workNotes, setWorkNotes, today, onLogWork, addXP }) {
  const [noteText, setNoteText] = useState('');
  const addNote = () => {
    if (!noteText.trim()) return;
    setWorkNotes(p => [{ id: Date.now(), text: noteText.trim(), date: today }, ...p]);
    setNoteText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Card><Section icon="💼" text="Agile — Hoy" color="var(--c6)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Toggle label="Planifiqué" active={(workLog[today] || {}).planned} color="var(--c6)" onToggle={() => onLogWork('planned')} icon="📋" />
          <Toggle label="Coordinación" active={(workLog[today] || {}).coordinated} color="var(--c4)" onToggle={() => onLogWork('coordinated')} icon="📞" />
        </div>
      </Section></Card>
      <Card><Section icon="📝" text="Notas / Ideas / Planificación" color="var(--c3)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {workNotes.length === 0 && <p style={{ fontSize: 13, color: 'var(--t2)' }}>Anotá planificaciones, ideas, lo que necesites...</p>}
          {workNotes.map(note => (
            <div key={note.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 12px', background: 'var(--s2)', borderRadius: 8, border: '1px solid var(--bd)' }}>
              <span style={{ color: 'var(--c3)', fontSize: 14 }}>📝</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: 'var(--tx)', whiteSpace: 'pre-wrap' }}>{note.text}</div>
                <div style={{ fontFamily: 'var(--mf)', fontSize: 9, color: 'var(--t2)' }}>{note.date}</div>
              </div>
              <button onClick={() => setWorkNotes(p => p.filter(n => n.id !== note.id))} style={{ background: 'none', border: 'none', color: 'var(--t2)', cursor: 'pointer', fontSize: 14, opacity: .4 }}>×</button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addNote(); } }}
            placeholder="Nueva nota..." rows={2}
            style={{ flex: 1, background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 8, padding: '8px 12px', color: 'var(--tx)', fontFamily: 'var(--hf)', fontSize: 13, outline: 'none', resize: 'vertical' }} />
          <button onClick={addNote} style={{ background: 'var(--c3)', border: 'none', borderRadius: 8, padding: '8px 14px', color: '#000', fontWeight: 700, cursor: 'pointer', fontSize: 16, alignSelf: 'flex-end' }}>+</button>
        </div>
      </Section></Card>
    </div>
  );
}

// ─── EDUCACIÓN (with Twitter) ────────────────────────────────────────
export function EduTab({ edu, courses, twitter, today, weekEdu, onLogEdu, onLogTwitter, setCourses, addXP }) {
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
        <AddInput placeholder="Nuevo curso..." onAdd={t => { setCourses(p => [...p, { id: Date.now(), name: t, done: false }]); addXP(3); }} color="var(--c3)" />
      </Section></Card>
      <Card><Section icon="🐦" text="Twitter" color="var(--c6)">
        <Toggle label={twitter[today] ? "Estuve en Twitter ✓" : "Estuve en Twitter"} active={!!twitter[today]} color="var(--c6)" onToggle={onLogTwitter} icon="🐦" />
        <div style={{ fontFamily: 'var(--mf)', fontSize: 10, color: 'var(--t2)', marginTop: 8 }}>Total: {Object.keys(twitter).length} días</div>
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

  const toggle = (id) => setTaskLists(p => ({ ...p, [cur.id]: p[cur.id].map(t => { if (t.id === id) { if (!t.done) addXP(XP.taskComplete); return { ...t, done: !t.done }; } return t; }) }));
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

// ─── PROYECTOS ───────────────────────────────────────────────────────
export function ProjectsTab({ projects, setProjects, addXP, today }) {
  const addIdea = (pId, text) => { if (!text.trim()) return; setProjects(p => p.map(pr => pr.id === pId ? { ...pr, ideas: [...pr.ideas, { id: Date.now(), text: text.trim(), date: today }] } : pr)); addXP(XP.idea); };
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
                      {todayH === 'clean' ? `✓ +${XP.habitClean} XP` : `✗ ${h.pen ? XP.habitBadSmoke : XP.habitBadEat} XP`}
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
