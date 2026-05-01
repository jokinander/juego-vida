import { useState, useEffect, useCallback } from 'react';
import {
  getToday, getWeekKey, inWeek, isEvening, formatDate, load, save,
  getLevel, calcWorkoutStreak, calcHabitStreak,
  BASE_QUOTES, EVENING_PROMPTS, ACHIEVEMENTS, XP,
  getLastEntry, setLastEntry,
} from './utils';
import { useFirebaseState } from './useFirebase';
import MorningCheckin from './components/MorningCheckin';
import EveningJournal from './components/EveningJournal';
import HomeTab from './components/HomeTab';
import { FisicoTab, WorkTab, EduTab, TareasTab, ProjectsTab, FamilyTab, HabitsTab } from './components/Tabs';

export default function App() {
  const today = getToday();
  const wk = getWeekKey();

  const [phase, setPhase] = useState('init');
  const [tab, setTab] = useState('home');
  const [newAch, setNewAch] = useState(null);
  const [levelUp, setLevelUp] = useState(null);
  const [prevLevel, setPrevLevel] = useState(null);

  // All state from Firebase
  const {
    xp, setXp, achs, setAchs, checkins, setCheckins,
    gratitudes, setGratitudes, customQuotes, setCustomQuotes,
    gym, setGym, run, setRun, workLog, setWorkLog,
    edu, setEdu, courses, setCourses, twitter, setTwitter,
    taskLists, setTaskLists, projects, setProjects,
    family, setFamily, habits, setHabits,
    meditate, setMeditate, journal, setJournal,
    // New state
    plank, setPlank, pushups, setPushups, workNotes, setWorkNotes,
    dayRatings, setDayRatings, entryLog, setEntryLog,
    loaded,
  } = useFirebaseState();

  // Quote
    const allQuotes = [...BASE_QUOTES, ...customQuotes];
  const [quote] = useState(() => allQuotes[Math.floor(Math.random() * Math.max(allQuotes.length, 1))] || BASE_QUOTES[0]);
  const [eveningPrompt] = useState(() => EVENING_PROMPTS[Math.floor(Math.random() * EVENING_PROMPTS.length)]);

  // Phase management - NO MORE BREATHING
  useEffect(() => {
    if (!checkins[today]) setPhase('init');
    else if (isEvening() && !journal[today]) setPhase('journal');
    else setPhase('app');
  }, [checkins, journal, today]);

  // PENALTY: Check missed days
  useEffect(() => {
    if (!loaded) return;
    const lastEntry = load('lastEntry', null);
    if (lastEntry && lastEntry !== today) {
      const last = new Date(lastEntry);
      const now = new Date(today);
      const diffDays = Math.floor((now - last) / 864e5);
      if (diffDays > 1) {
        // Missed days penalty
        const penalty = (diffDays - 1) * Math.abs(XP.missedDay);
        setXp(p => Math.max(0, p - penalty));
      }
    }
    save('lastEntry', today);

    // Track entries per day for double-entry bonus/penalty
    const todayEntries = load('entries_' + today, 0);
    save('entries_' + today, todayEntries + 1);
  }, [loaded, today]);

  // Calculations
  const weekGym = Object.keys(gym).filter(d => inWeek(d, wk)).length;
  const weekRun = Object.keys(run).filter(d => inWeek(d, wk)).length;
  const weekPlank = Object.keys(plank || {}).filter(d => inWeek(d, wk)).length;
  const weekEdu = Object.entries(edu).filter(([d]) => inWeek(d, wk)).reduce((s, [, v]) => s + Object.values(v).filter(Boolean).length, 0);
  const weekFam = family[wk] || {};
  const streak = calcWorkoutStreak(gym, run);
  const bestHabit = Math.max(calcHabitStreak(habits.comer), calcHabitStreak(habits.alcohol), calcHabitStreak(habits.fumar));
  const weekPerfect = weekGym >= 3 && weekRun >= 3 && weekEdu >= 3 && weekFam.calledParents && weekFam.sawAitziber;
  const level = getLevel(xp);

  // Level up detection
  useEffect(() => {
    if (prevLevel !== null && level.num > prevLevel) {
      setLevelUp(level);
      setTimeout(() => setLevelUp(null), 5000);
    }
    setPrevLevel(level.num);
  }, [level.num]);

  // XP helpers
  const addXP = (n) => setXp(p => p + n);
  const penXP = (n) => setXp(p => Math.max(0, p - n));

  // Achievement checking
  const getStats = useCallback(() => ({
    gymTotal: Object.keys(gym).length, runTotal: Object.keys(run).length,
    weekGym, weekRun, streak, xp,
    eduTotal: Object.values(edu).reduce((s, v) => s + Object.values(v).filter(Boolean).length, 0),
    weekEdu, twitterTotal: Object.keys(twitter).length,
    calledParents: Object.values(family).filter(w => w.calledParents).length,
    sawSister: Object.values(family).filter(w => w.sawAitziber).length,
    meditateTotal: 0,
    checkinTotal: Object.keys(checkins).length,
    ideasTotal: projects.reduce((s, p) => s + p.ideas.length, 0),
    workPlanned: Object.values(workLog).filter(w => w.planned).length,
    bestHabit, weekPerfect, customQuotes: customQuotes.length,
  }), [gym, run, edu, twitter, family, checkins, projects, workLog, habits, xp, customQuotes, wk, weekPerfect]);

  useEffect(() => {
    const stats = getStats();
    ACHIEVEMENTS.forEach(a => {
      if (!achs.includes(a.id) && a.check(stats)) {
        setAchs(p => [...p, a.id]);
        setNewAch(a);
        addXP(a.xp);
        setTimeout(() => setNewAch(null), 3500);
      }
    });
  }, [gym, run, edu, twitter, family, checkins, projects, workLog, habits, xp, customQuotes]);

  // Handlers
  const doCheckin = (mood, grat) => { setCheckins(p => ({ ...p, [today]: { mood, grat } })); addXP(XP.checkin); };
  const logGym = () => { if (!gym[today]) { setGym(p => ({ ...p, [today]: true })); addXP(XP.gym); } };
  const logRun = () => { if (!run[today]) { setRun(p => ({ ...p, [today]: true })); addXP(XP.run); } };
  const logPlank = () => { if (!(plank || {})[today]) { setPlank(p => ({ ...(p || {}), [today]: true })); addXP(XP.plank); } };
  const logPushups = () => { if (!(pushups || {})[today]) { setPushups(p => ({ ...(p || {}), [today]: true })); addXP(XP.pushups); } };
  const logWork = (k) => { const was = (workLog[today] || {})[k]; setWorkLog(p => ({ ...p, [today]: { ...(p[today] || {}), [k]: !was } })); if (!was) addXP(XP.workPlan); };
  const logEdu = (k) => { const was = (edu[today] || {})[k]; setEdu(p => ({ ...p, [today]: { ...(p[today] || {}), [k]: !was } })); if (!was) addXP(XP.eduReading); };
  const logTwitter = () => { if (!twitter[today]) { setTwitter(p => ({ ...p, [today]: true })); addXP(XP.twitter); } };
  const logFamily = (k) => { const was = (family[wk] || {})[k]; setFamily(p => ({ ...p, [wk]: { ...(p[wk] || {}), [k]: !was } })); if (!was) addXP(XP.familyCall); };
  const logHabit = (h, st) => {
    setHabits(p => ({ ...p, [h]: { ...p[h], [today]: st } }));
    if (st === 'clean') addXP(XP.habitClean);
    if (st === 'bad') {
      if (h === 'fumar') penXP(Math.abs(XP.habitBadSmoke));
      else penXP(Math.abs(XP.habitBadEat));
    }
  };

  // Loading
  if (!loaded) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎮</div>
          <div style={{ fontFamily: 'var(--hf)', fontSize: 16, color: 'var(--t2)' }}>Cargando...</div>
        </div>
      </div>
    );
  }

  // ═══ PHASE RENDERS ═══
  if (phase === 'init') {
    return <MorningCheckin gratitudes={gratitudes} setGratitudes={setGratitudes} onDone={doCheckin} />;
  }

  if (phase === 'journal') {
    return <EveningJournal
      prompt={eveningPrompt}
      value={journal[today]}
      dayRating={(dayRatings || {})[today]}
      onChangeText={v => setJournal(p => ({ ...p, [today]: v }))}
      onChangeRating={r => setDayRatings(p => ({ ...(p || {}), [today]: r }))}
      onSave={() => { if (journal[today]) addXP(XP.journal); setPhase('app'); }}
      onSkip={() => setPhase('app')}
    />;
  }

  // ═══ MAIN APP ═══
  const homeState = {
    xp, checkins, today, quote, gym, run, edu, twitter, workLog,
    weekGym, weekRun, weekEdu, weekFam, streak, habits, achs, ACHS_LIST: ACHIEVEMENTS,
    plank: plank || {}, pushups: pushups || {}, weekPlank,
  };

  // Reduced nav tabs - NO calma, digital, logros
  const navTabs = [
    { id: 'home', icon: '🏠', label: 'INICIO', color: 'var(--c4)' },
    { id: 'fisico', icon: '💪', label: 'FÍSICO', color: 'var(--c1)' },
    { id: 'work', icon: '💼', label: 'WORK', color: 'var(--c6)' },
    { id: 'edu', icon: '📚', label: 'EDUCA', color: 'var(--c4)' },
    { id: 'tareas', icon: '📋', label: 'TAREAS', color: 'var(--c2)' },
    { id: 'projects', icon: '🚀', label: 'PROY', color: 'var(--grn)' },
    { id: 'family', icon: '❤️', label: 'FAMILIA', color: 'var(--c1)' },
    { id: 'habits', icon: '🛡️', label: 'HÁBITOS', color: 'var(--grn)' },
  ];

  const renderTab = () => {
    switch (tab) {
      case 'home': return <HomeTab state={homeState} />;
      case 'fisico': return <FisicoTab gym={gym} run={run} plank={plank || {}} pushups={pushups || {}} today={today} weekGym={weekGym} weekRun={weekRun} weekPlank={weekPlank} streak={streak} onLogGym={logGym} onLogRun={logRun} onLogPlank={logPlank} onLogPushups={logPushups} />;
      case 'work': return <WorkTab workLog={workLog} workNotes={workNotes || []} setWorkNotes={setWorkNotes} today={today} onLogWork={logWork} addXP={addXP} />;
      case 'edu': return <EduTab edu={edu} courses={courses} twitter={twitter} today={today} weekEdu={weekEdu} onLogEdu={logEdu} onLogTwitter={logTwitter} setCourses={setCourses} addXP={addXP} />;
      case 'tareas': return <TareasTab taskLists={taskLists} setTaskLists={setTaskLists} addXP={addXP} />;
      case 'projects': return <ProjectsTab projects={projects} setProjects={setProjects} addXP={addXP} today={today} />;
      case 'family': return <FamilyTab family={family} weekFam={weekFam} onLogFamily={logFamily} />;
      case 'habits': return <HabitsTab habits={habits} today={today} onLogHabit={logHabit} />;
      default: return <HomeTab state={homeState} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)', fontFamily: 'var(--hf)', maxWidth: 480, margin: '0 auto', paddingBottom: 68 }}>

      {/* Level up popup */}
      {levelUp && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setLevelUp(null)}>
          <div style={{
            background: 'linear-gradient(135deg, #161628, #2a1f40)', border: `3px solid ${levelUp.color}`,
            borderRadius: 20, padding: '32px 40px', textAlign: 'center',
            boxShadow: `0 0 60px ${levelUp.color}44`, animation: 'slideIn .5s ease',
          }}>
            <div style={{ fontSize: 60, marginBottom: 12 }}>{levelUp.icon}</div>
            <div style={{ fontFamily: 'var(--mf)', fontSize: 12, color: levelUp.color, letterSpacing: 3, marginBottom: 8 }}>¡SUBISTE DE NIVEL!</div>
            <div style={{ fontWeight: 900, fontSize: 28, color: '#fff', marginBottom: 8 }}>Lvl {levelUp.num}: {levelUp.name}</div>
            <div style={{ fontSize: 16, color: 'var(--c3)', marginBottom: 16 }}>🎁 ¡Te ganaste una compra!</div>
            <div style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.5 }}>
              Comprá lo que quieras como premio<br />por tu esfuerzo. ¡Te lo merecés!
            </div>
            <button onClick={() => setLevelUp(null)} style={{
              marginTop: 16, padding: '10px 28px', background: levelUp.color + '22',
              border: `2px solid ${levelUp.color}`, borderRadius: 12, cursor: 'pointer',
              fontWeight: 700, fontSize: 15, color: levelUp.color,
            }}>¡Genial! 🎉</button>
          </div>
        </div>
      )}

      {/* Achievement popup */}
      {newAch && (
        <div style={{
          position: 'fixed', top: 14, left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #161628, #2a1f40)', border: '2px solid var(--c3)',
          borderRadius: 14, padding: '12px 18px', zIndex: 1000,
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 32px rgba(255,230,109,.25)', animation: 'slideIn .4s ease',
        }}>
          <span style={{ fontSize: 28 }}>{newAch.icon}</span>
          <div>
            <div style={{ fontFamily: 'var(--mf)', fontSize: 9, color: 'var(--c3)', letterSpacing: 2 }}>🎮 LOGRO DESBLOQUEADO</div>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#fff' }}>{newAch.name} <span style={{ fontSize: 11, color: 'var(--c2)' }}>+{newAch.xp} XP</span></div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ padding: '16px 16px 12px', background: 'linear-gradient(180deg, var(--sf), var(--bg))', borderBottom: '1px solid var(--bd)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontWeight: 900, fontSize: 18, background: 'linear-gradient(135deg, var(--c1), var(--c3), var(--c2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              EL JUEGO DE MI VIDA
            </h1>
            <div style={{ fontFamily: 'var(--mf)', fontSize: 10, color: 'var(--t2)' }}>{formatDate()}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>{level.icon}</span>
            <span style={{ fontFamily: 'var(--mf)', fontSize: 11, color: level.color, fontWeight: 700 }}>Lvl {level.num}</span>
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div style={{ padding: '12px 12px 0' }}>{renderTab()}</div>

      {/* Bottom nav - 8 tabs instead of 11 */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, background: 'var(--sf)',
        borderTop: '1px solid var(--bd)', display: 'flex',
        padding: '4px 4px', gap: 2, zIndex: 100,
      }}>
        {navTabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: tab === t.id ? t.color + '15' : 'transparent',
            border: tab === t.id ? `1.5px solid ${t.color}55` : '1.5px solid transparent',
            borderRadius: 10, padding: '6px 2px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 2, cursor: 'pointer', flex: 1,
            position: 'relative',
          }}>
            {tab === t.id && <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 12, height: 2, background: t.color, borderRadius: '0 0 2px 2px' }} />}
            <span style={{ fontSize: 17 }}>{t.icon}</span>
            <span style={{ fontFamily: 'var(--mf)', fontSize: 8, color: tab === t.id ? t.color : 'var(--t2)', fontWeight: tab === t.id ? 700 : 400, whiteSpace: 'nowrap' }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
