import { Card, Section, WeekDots } from './UI';
import { getLevel, calcHabitStreak, XP } from '../utils';

export default function HomeTab({ state }) {
  const { xp, checkins, today, quote, gym, run, edu, twitter, workLog,
    weekGym, weekRun, weekEdu, weekFam, streak, habits, achs, ACHS_LIST,
    plank, pushups, weekPlank } = state;

  const level = getLevel(xp);
  const xpPct = Math.min(((xp - level.min) / (level.next - level.min)) * 100, 100);

  const doneIcons = [
    gym[today] && '🏋️', run[today] && '🏃',
    plank[today] && '🧱', pushups[today] && '💪',
    Object.values(edu[today] || {}).some(Boolean) && '📚',
    twitter[today] && '🐦',
    (workLog[today] || {}).planned && '📋',
  ].filter(Boolean);

  const objs = [
    { l: 'Gym 3/sem', d: weekGym >= 3 },
    { l: 'Corrida 3/sem', d: weekRun >= 3 },
    { l: 'Plancha 3/sem', d: weekPlank >= 3 },
    { l: 'Edu 3/sem', d: weekEdu >= 3 },
    { l: 'Llamar padres', d: !!weekFam.calledParents },
    { l: 'Ver Aitziber', d: !!weekFam.sawAitziber },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Checkin */}
      <Card style={{ background: 'var(--c4)08', border: '1px solid var(--c4)33' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 26 }}>{checkins[today]?.mood?.emoji}</span>
          <div>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--c4)' }}>{checkins[today]?.mood?.label}</span>
            {checkins[today]?.grat && <div style={{ fontFamily: 'var(--mf)', fontSize: 10, color: 'var(--t2)' }}>Agradecido: {checkins[today].grat}</div>}
          </div>
        </div>
      </Card>

      {/* Quote */}
      <Card style={{ background: 'linear-gradient(135deg, #1a1528, #0f1a2e)', border: '1px solid var(--c5)33' }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--tx)', lineHeight: 1.4 }}>"{quote}"</div>
      </Card>

      {/* XP */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 20 }}>{level.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mf)', fontSize: 11, marginBottom: 4 }}>
              <span style={{ color: level.color, fontWeight: 700 }}>Lvl {level.num}: {level.name}</span>
              <span style={{ color: 'var(--t2)' }}>{xp} / {level.next}</span>
            </div>
            <div style={{ height: 8, background: 'var(--s2)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${xpPct}%`, background: level.color, borderRadius: 4, transition: 'width .8s' }} />
            </div>
          </div>
        </div>
        {streak > 0 && <div style={{ fontFamily: 'var(--mf)', fontSize: 11, color: 'var(--c5)' }}>🔥 {streak} días</div>}
        <div style={{ fontFamily: 'var(--mf)', fontSize: 9, color: 'var(--t2)', marginTop: 4 }}>
          ⚠️ No entrar = -{Math.abs(XP.missedDay)} XP/día
        </div>
      </Card>

      {/* Weekly Objectives */}
      <Card>
        <Section icon="🎯" text="Objetivos Semanales" color="var(--c3)"
          right={<span style={{ fontFamily: 'var(--mf)', fontSize: 10, color: objs.every(o => o.d) ? 'var(--c3)' : 'var(--t2)' }}>{objs.filter(o => o.d).length}/{objs.length}</span>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {objs.map(o => (
              <div key={o.l} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8, background: o.d ? 'var(--c3)08' : 'transparent' }}>
                <span style={{ fontSize: 14 }}>{o.d ? '✅' : '⬜'}</span>
                <span style={{ fontSize: 13, color: o.d ? 'var(--c3)' : 'var(--t2)' }}>{o.l}</span>
              </div>
            ))}
          </div>
        </Section>
      </Card>

      {/* Week progress */}
      <Card>
        <Section icon="📊" text="Semana" color="var(--c6)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <WeekDots current={weekGym} max={3} color="var(--c1)" icon="🏋️" />
            <WeekDots current={weekRun} max={3} color="var(--c2)" icon="🏃" />
            <WeekDots current={weekPlank} max={3} color="var(--c5)" icon="🧱" />
          </div>
        </Section>
      </Card>

      {/* Habits */}
      <Card>
        <Section icon="🛡️" text="Hábitos" color="var(--grn)">
          <div style={{ display: 'flex', gap: 10 }}>
            {[{ k: 'comer', i: '🍽️', l: 'Comer' }, { k: 'alcohol', i: '🍺', l: 'Alcohol' }, { k: 'fumar', i: '🚬', l: 'Fumar' }].map(h => (
              <div key={h.k} style={{ flex: 1, textAlign: 'center', padding: 8, background: 'var(--s2)', borderRadius: 10 }}>
                <div style={{ fontSize: 20 }}>{h.i}</div>
                <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--grn)' }}>{calcHabitStreak(habits[h.k])}</div>
                <div style={{ fontFamily: 'var(--mf)', fontSize: 8, color: 'var(--t2)' }}>{h.l}</div>
              </div>
            ))}
          </div>
        </Section>
      </Card>

      {/* Finanzas */}
      <Card style={{ border: '1px solid var(--c3)33' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>💰</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--c3)' }}>Mis Finanzas</div>
          </div>
          <a href="https://mis-finanzas-app.vercel.app" target="_blank" rel="noopener noreferrer" style={{
            padding: '6px 12px', background: 'var(--c3)22', border: '1px solid var(--c3)44',
            borderRadius: 8, fontSize: 12, color: 'var(--c3)', fontWeight: 700, textDecoration: 'none',
          }}>Abrir →</a>
        </div>
      </Card>

      {/* Today done */}
      {doneIcons.length > 0 && (
        <Card>
          <div style={{ fontFamily: 'var(--mf)', fontSize: 10, color: 'var(--t2)', marginBottom: 6 }}>HOY:</div>
          <div style={{ display: 'flex', gap: 8 }}>{doneIcons.map((d, i) => <span key={i} style={{ fontSize: 22 }}>{d}</span>)}</div>
        </Card>
      )}
    </div>
  );
}
