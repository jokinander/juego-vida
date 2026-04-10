import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import {
  getToday, getWeekKey, inWeek, isEvening, formatDate, load, save,
  getLevel, calcWorkoutStreak, calcHabitStreak,
  BASE_QUOTES, DEFAULT_GRATITUDES, EVENING_PROMPTS, ACHIEVEMENTS,
} from './utils';
import MorningCheckin from './components/MorningCheckin';
import BreathingScreen from './components/BreathingScreen';
import EveningJournal from './components/EveningJournal';
import HomeTab from './components/HomeTab';
import { FisicoTab, WorkTab, EduTab, TareasTab, DigitalTab, ProjectsTab, FamilyTab, HabitsTab, CalmaTab, LogrosTab } from './components/Tabs';

const DOC_ID = 'main';
const COL = 'juego-vida';

const DEFAULT_STATE = {
  xp: 0,
  achs: [],
  checkins: {},
  gratitudes: DEFAULT_GRATITUDES,
  customQuotes: [],
  gym: {},
  run: {},
  workLog: {},
  edu: {},
  courses: [],
  twitter: {},
  taskLists: { super: [], houseShop: [], houseTasks: [], life: [] },
  projects: [
    { id: 1, name: 'Distribución Fármacos Animales', icon: '💊', ideas: [] },
    { id: 2, name: 'Proyecto Inmobiliario San Martín', icon: '🏗️', ideas: [] },
  ],
  family: {},
  habits: { comer: {}, alcohol: {}, fumar: {} },
  meditate: {},
  journal: {},
  breathingDone: {},
};

export default function App() {
  const today = getToday();
  const wk = getWeekKey();

  const [loaded, setLoaded] = useState(false);
  const [phase, setPhase] = useState('init');
  const [tab, setTab] = useState('home');

  const [xp, setXp] = useState(0);
  const [achs, setAchs] = useState([]);
  const [newAch, setNewAch] = useState(null);
  const [checkins, setCheckins] = useState({});
  const [gratitudes, setGratitudes] = useState(DEFAULT_GRATITUDES);
  const [customQuotes, setCustomQuotes] = useState([]);
  const [gym, setGym] = useState({});
  const [run, setRun] = useState({});
  const [workLog, setWorkLog] = useState({});
  const [edu, setEdu] = useState({});
  const [courses, setCourses] = useState([]);
  const [twitter, setTwitter] = useState({});
  const [taskLists, setTaskLists] = useState({ super: [], houseShop: [], houseTasks: [], life: [] });
  const [projects, setProjects] = useState([
    { id: 1, name: 'Distribución Fármacos Animales', icon: '💊', ideas: [] },
    { id: 2, name: 'Proyecto Inmobiliario San Martín', icon: '🏗️', ideas: [] },
  ]);
  const [family, setFamily] = useState({});
  const [habits, setHabits] = useState({ comer: {}, alcohol: {}, fumar: {} });
  const [meditate, setMeditate] = useState({});
  const [journal, setJournal] = useState({});
  const [breathingDone, setBreathingDone] = useState({});
  const [fasting, setFasting] = useState({});

  const allQuotes = [...BASE_QUOTES, ...customQuotes];
  const [quote] = useState(() => allQuotes[Math.floor(Math.random() * Math.max(allQuotes.length, 1))] || BASE_QUOTES[0]);
  const [eveningPrompt] = useState(() => EVENING_PROMPTS[Math.floor(Math.random() * EVENING_PROMPTS.length)]);

  // ── LOAD FROM FIREBASE ──
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ref = doc(db, COL, DOC_ID);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const d = snap.data();
          if (d.xp !== undefined) setXp(d.xp);
          if (d.achs) setAchs(d.achs);
          if (d.checkins) setCheckins(d.checkins);
          if (d.gratitudes) setGratitudes(d.gratitudes);
          if (d.customQuotes) setCustomQuotes(d.customQuotes);
          if (d.gym) setGym(d.gym);
          if (d.run) setRun(d.run);
          if (d.workLog) setWorkLog(d.workLog);
          if (d.edu) setEdu(d.edu);
          if (d.courses) setCourses(d.courses);
          if (d.twitter) setTwitter(d.twitter);
          if (d.taskLists) setTaskLists(d.taskLists);
          if (d.projects) setProjects(d.projects);
          if (d.family) setFamily(d.family);
          if (d.habits) setHabits(d.habits);
          if (d.meditate) setMeditate(d.meditate);
          if (d.journal) setJournal(d.journal);
          if (d.breathingDone) setBreathingDone(d.breathingDone);
          if (d.fasting) setFasting(d.fasting);
        }
      } catch (e) {
        console.error('Firebase load error:', e);
      }
      setLoaded(true);
    };
    fetchData();
  }, []);

  // ── SAVE TO FIREBASE (debounced) ──
  const saveTimer = useRef(null);
  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        const ref = doc(db, COL, DOC_ID);
        await setDoc(ref, {
          xp, achs, checkins, gratitudes, customQuotes,
          gym, run, workLog, edu, courses, twitter,
          taskLists, projects, family, habits, meditate, journal, breathingDone, fasting,
        });
      } catch (e) {
        console.error('Firebase save error:', e);
      }
    }, 1000);
  }, [xp, achs, checkins, gratitudes, customQuotes, gym, run, workLog, edu,
    courses, twitter, taskLists, projects, family, habits, meditate, journal, breathingDone, fasting, loaded]);

  // ── PHASE MANAGEMENT ──
  useEffect(() => {
    if (!loaded) return;
    if (!checkins[today]) setPhase('init');
    else if (!breathingDone[today]) setPhase('breathing');
    else if (isEvening() && !journal[today]) setPhase('journal');
    else setPhase('app');
  }, [checkins, journal, breathingDone, today, loaded]);

  // ── CALCULATIONS ──
  const weekGym = Object.keys(gym).filter(d => inWeek(d, wk)).length;
  const weekRun = Object.keys(run).filter(d => inWeek(d, wk)).length;
  const weekEdu = Object.entries(edu).filter(([d]) => inWeek(d, wk)).reduce((s, [, v]) => s + Object.values(v).filter(Boolean).length, 0);
  const weekFam = family[wk] || {};
  const streak = calcWorkoutStreak(gym, run);
  const bestHabit = Math.max(calcHabitStreak(habits.comer), calcHabitStreak(habits.alcohol), calcHabitStreak(habits.fumar));
  const weekPerfect = weekGym >= 3 && weekRun >= 3 && weekEdu >= 3 && weekFam.calledParents && weekFam.sawAitziber;
  const level = getLevel(xp);

  const addXP = (n) => setXp(p => p + n);
  const penXP = (n) => setXp(p => Math.max(0, p - n));

  // ── ACHIEVEMENTS ──
  const getStats = useCallback(() => ({
    gymTotal: Object.keys(gym).length, runTotal: Object.keys(run).length,
    weekGym, weekRun, streak, xp,
    eduTotal: Object.values(edu).reduce((s, v) => s + Object.values(v).filter(Boolean).length, 0),
    weekEdu, twitterTotal: Object.keys(twitter).length,
    calledParents: Object.values(family).filter(w => w.calledParents).length,
    sawSister: Object.values(family).filter(w => w.sawAitziber).length,
    meditateTotal: Object.keys(meditate).length,
    checkinTotal: Object.keys(checkins).length,
    ideasTotal: projects.reduce((s, p) => s + p.ideas.length, 0),
    workPlanned: Object.values(workLog).filter(w => w.planned).length,
    bestHabit, weekPerfect, customQuotes: customQuotes.length,
  }), [gym, run, edu, twitter, family, meditate, checkins, projects, workLog, habits, xp, customQuotes, wk, weekPerfect]);

  useEffect(() => {
    if (!loaded) return;
    const stats = getStats();
    ACHIEVEMENTS.forEach(a => {
      if (!achs.includes(a.id) && a.check(stats)) {
        setAchs(p => [...p, a.id]);
        setNewAch(a);
        addXP(a.xp);
        setTimeout(() => setNewAch(null), 3500);
      }
    });
  }, [gym, run, edu, twitter, family, meditate, checkins, projects, workLog, habits, xp, customQuotes]);

  // ── HANDLERS ──
  const doCheckin = (mood, grat) => { setCheckins(p => ({ ...p, [today]: { mood, grat } })); addXP(8); };
  const logGym = () => { const was = !!gym[today]; setGym(p => ({ ...p, [today]: !was })); if (!was) addXP(15); else penXP(15); };
  const logRun = () => { const was = !!run[today]; setRun(p => ({ ...p, [today]: !was })); if (!was) addXP(12); else penXP(12); };
  const logWork = (k) => { const was = (workLog[today] || {})[k]; setWorkLog(p => ({ ...p, [today]: { ...(p[today] || {}), [k]: !was } })); if (!was) addXP(8); else penXP(8); };
  const logEdu = (k) => { const was = (edu[today] || {})[k]; setEdu(p => ({ ...p, [today]: { ...(p[today] || {}), [k]: !was } })); if (!was) addXP(10); else penXP(10); };
  const logTwitter = () => { const was = !!twitter[today]; setTwitter(p => ({ ...p, [today]: !was })); if (!was) addXP(5); else penXP(5); };
  const logFamily = (k) => { const was = (family[wk] || {})[k]; setFamily(p => ({ ...p, [wk]: { ...(p[wk] || {}), [k]: !was } })); if (!was) addXP(15); };
  const logMed = () => { if (!meditate[today]) { setMeditate(p => ({ ...p, [today]: true })); addXP(10); } };
  const logHabit = (h, st) => {
    const prev = (habits[h] || {})[today];
    if (prev === st) return; // mismo estado, no hacer nada
    setHabits(p => ({ ...p, [h]: { ...p[h], [today]: st } }));
    // revertir XP anterior
    if (prev === 'clean') penXP(8);
    if (prev === 'bad') addXP(h === 'fumar' ? 15 : 10);
    // aplicar nuevo XP
    if (st === 'clean') addXP(8);
    if (st === 'bad') penXP(h === 'fumar' ? 15 : 10);
  };
  const logFast = () => { if (!fasting[today]) { setFasting(p => ({ ...p, [today]: true })); addXP(10); } };

  // ── LOADING SCREEN ──
  if (!loaded) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 40 }}>🎮</div>
        <div style={{ fontFamily: 'var(--mf)', fontSize: 12, color: 'var(--t2)', letterSpacing: 2 }}>CARGANDO...</div>
      </div>
    );
  }

  // ── PHASE RENDERS ──
  if (phase === 'init') {
    return <MorningCheckin gratitudes={gratitudes} setGratitudes={setGratitudes} onDone={doCheckin} />;
  }

  if (phase === 'breathing') {
    return <BreathingScreen
      onDone={() => { setBreathingDone(p => ({ ...p, [today]: true })); logMed(); setPhase('app'); }}
      onSkip={() => { setBreathingDone(p => ({ ...p, [today]: true })); setPhase('app'); }}
    />;
  }

  if (phase === 'journal') {
    return <EveningJournal
      prompt={eveningPrompt}
      value={journal[today]}
      onChange={v => setJournal(p => ({ ...p, [today]: v }))}
      onSave={() => { if (journal[today]) addXP(5); setPhase('app'); }}
      onSkip={() => setPhase('app')}
    />;
  }

  // ── MAIN APP ──
  const homeState = {
    xp, checkins, today, quote, gym, run, edu, twitter, meditate, workLog,
    weekGym, weekRun, weekEdu, weekFam, streak, habits, achs, ACHS_LIST: ACHIEVEMENTS,
  };

  const navTabs = [
    { id: 'home', icon: '🏠', label: 'INICIO', color: 'var(--c4)' },
    { id: 'fisico', icon: '💪', label: 'FÍSICO', color: 'var(--c1)' },
    { id: 'work', icon: '💼', label: 'WORK', color: 'var(--c6)' },
    { id: 'edu', icon: '📚', label: 'EDUCA', color: 'var(--c4)' },
    { id: 'tareas', icon: '📋', label: 'TAREAS', color: 'var(--c2)' },
    { id: 'digital', icon: '🐦', label: 'DIGITAL', color: 'var(--c6)' },
    { id: 'projects', icon: '🚀', label: 'PROY', color: 'var(--grn)' },
    { id: 'family', icon: '❤️', label: 'FAMILIA', color: 'var(--c1)' },
    { id: 'habits', icon: '🛡️', label: 'HÁBITOS', color: 'var(--grn)' },
    { id: 'calma', icon: '🧘', label: 'CALMA', color: 'var(--c6)' },
    { id: 'logros', icon: '🏆', label: 'LOGROS', color: 'var(--c3)' },
  ];

  const renderTab = () => {
    switch (tab) {
      case 'home': return <HomeTab state={homeState} />;
      case 'fisico': return <FisicoTab gym={gym} run={run} today={today} weekGym={weekGym} weekRun={weekRun} streak={streak} onLogGym={logGym} onLogRun={logRun} fasting={fasting} wk={wk} onLogFast={logFast} />;
      case 'work': return <WorkTab workLog={workLog} today={today} onLogWork={logWork} />;
      case 'edu': return <EduTab edu={edu} courses={courses} today={today} weekEdu={weekEdu} onLogEdu={logEdu} setCourses={setCourses} addXP={addXP} />;
      case 'tareas': return <TareasTab taskLists={taskLists} setTaskLists={setTaskLists} addXP={addXP} />;
      case 'digital': return <DigitalTab twitter={twitter} today={today} onLogTwitter={logTwitter} />;
      case 'projects': return <ProjectsTab projects={projects} setProjects={setProjects} addXP={addXP} today={today} />;
      case 'family': return <FamilyTab family={family} weekFam={weekFam} onLogFamily={logFamily} />;
      case 'habits': return <HabitsTab habits={habits} today={today} onLogHabit={logHabit} />;
      case 'calma': return <CalmaTab meditate={meditate} today={today} customQuotes={customQuotes} setCustomQuotes={setCustomQuotes} onStartBreathing={() => setPhase('breathing')} onLogMed={logMed} />;
      case 'logros': return <LogrosTab achs={achs} ACHS_LIST={ACHIEVEMENTS} />;
      default: return <HomeTab state={homeState} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)', fontFamily: 'var(--hf)', maxWidth: 480, margin: '0 auto', paddingBottom: 68 }}>

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

      <div style={{ padding: '12px 12px 0' }}>{renderTab()}</div>

      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, background: 'var(--sf)',
        borderTop: '1px solid var(--bd)', display: 'flex',
        overflowX: 'auto', padding: '4px 2px', gap: 1, zIndex: 100,
      }}>
        {navTabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: tab === t.id ? t.color + '15' : 'transparent',
            border: tab === t.id ? `1.5px solid ${t.color}55` : '1.5px solid transparent',
            borderRadius: 10, padding: '6px 2px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 2, cursor: 'pointer', minWidth: 42, flexShrink: 0,
            position: 'relative',
          }}>
            {tab === t.id && <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 12, height: 2, background: t.color, borderRadius: '0 0 2px 2px' }} />}
            <span style={{ fontSize: 15 }}>{t.icon}</span>
            <span style={{ fontFamily: 'var(--mf)', fontSize: 7, color: tab === t.id ? t.color : 'var(--t2)', fontWeight: tab === t.id ? 700 : 400, whiteSpace: 'nowrap' }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
