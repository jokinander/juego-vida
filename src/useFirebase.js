import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

const DOC_REF = doc(db, 'juego', 'jokin');

// Load from localStorage as initial fast cache
const loadLocal = (key, fallback) => {
  try {
    const v = localStorage.getItem('jdmv_' + key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};

const saveLocal = (key, val) => {
  try { localStorage.setItem('jdmv_' + key, JSON.stringify(val)); } catch {}
};

// Default state
const DEFAULT_GRATITUDES = [
  'Mi salud', 'Mi familia', 'Mis proyectos', 'Un buen café',
  'El gimnasio', 'Tener trabajo', 'Aprender algo nuevo',
  'Un día más', 'Mis amigos', 'Mi progreso',
];

const DEFAULT_PROJECTS = [
  { id: 1, name: 'Distribución Fármacos Animales', icon: '💊', ideas: [] },
  { id: 2, name: 'Proyecto Inmobiliario San Martín', icon: '🏗️', ideas: [] },
];

const DEFAULTS = {
  xp: 0,
  achs: [],
  checkins: {},
  grats: DEFAULT_GRATITUDES,
  cq: [],
  gym: {},
  run: {},
  work: {},
  edu: {},
  courses: [],
  twitter: {},
  tasks: { super: [], houseShop: [], houseTasks: [], life: [] },
  projects: DEFAULT_PROJECTS,
  family: {},
  habits: { comer: {}, alcohol: {}, fumar: {} },
  meditate: {},
  journal: {},
};

export function useFirebaseState() {
  // Initialize all state from localStorage (fast load)
  const [xp, setXp] = useState(() => loadLocal('xp', DEFAULTS.xp));
  const [achs, setAchs] = useState(() => loadLocal('achs', DEFAULTS.achs));
  const [checkins, setCheckins] = useState(() => loadLocal('checkins', DEFAULTS.checkins));
  const [gratitudes, setGratitudes] = useState(() => loadLocal('grats', DEFAULTS.grats));
  const [customQuotes, setCustomQuotes] = useState(() => loadLocal('cq', DEFAULTS.cq));
  const [gym, setGym] = useState(() => loadLocal('gym', DEFAULTS.gym));
  const [run, setRun] = useState(() => loadLocal('run', DEFAULTS.run));
  const [workLog, setWorkLog] = useState(() => loadLocal('work', DEFAULTS.work));
  const [edu, setEdu] = useState(() => loadLocal('edu', DEFAULTS.edu));
  const [courses, setCourses] = useState(() => loadLocal('courses', DEFAULTS.courses));
  const [twitter, setTwitter] = useState(() => loadLocal('twitter', DEFAULTS.twitter));
  const [taskLists, setTaskLists] = useState(() => loadLocal('tasks', DEFAULTS.tasks));
  const [projects, setProjects] = useState(() => loadLocal('projects', DEFAULTS.projects));
  const [family, setFamily] = useState(() => loadLocal('family', DEFAULTS.family));
  const [habits, setHabits] = useState(() => loadLocal('habits', DEFAULTS.habits));
  const [meditate, setMeditate] = useState(() => loadLocal('meditate', DEFAULTS.meditate));
  const [journal, setJournal] = useState(() => loadLocal('journal', DEFAULTS.journal));

  const [loaded, setLoaded] = useState(false);
  const skipNextSync = useRef(false);

  // Load from Firebase on mount
  useEffect(() => {
    const unsub = onSnapshot(DOC_REF, (snap) => {
      if (snap.exists() && !skipNextSync.current) {
        const d = snap.data();
        if (d.xp !== undefined) { setXp(d.xp); saveLocal('xp', d.xp); }
        if (d.achs) { setAchs(d.achs); saveLocal('achs', d.achs); }
        if (d.checkins) { setCheckins(d.checkins); saveLocal('checkins', d.checkins); }
        if (d.grats) { setGratitudes(d.grats); saveLocal('grats', d.grats); }
        if (d.cq) { setCustomQuotes(d.cq); saveLocal('cq', d.cq); }
        if (d.gym) { setGym(d.gym); saveLocal('gym', d.gym); }
        if (d.run) { setRun(d.run); saveLocal('run', d.run); }
        if (d.work) { setWorkLog(d.work); saveLocal('work', d.work); }
        if (d.edu) { setEdu(d.edu); saveLocal('edu', d.edu); }
        if (d.courses) { setCourses(d.courses); saveLocal('courses', d.courses); }
        if (d.twitter) { setTwitter(d.twitter); saveLocal('twitter', d.twitter); }
        if (d.tasks) { setTaskLists(d.tasks); saveLocal('tasks', d.tasks); }
        if (d.projects) { setProjects(d.projects); saveLocal('projects', d.projects); }
        if (d.family) { setFamily(d.family); saveLocal('family', d.family); }
        if (d.habits) { setHabits(d.habits); saveLocal('habits', d.habits); }
        if (d.meditate) { setMeditate(d.meditate); saveLocal('meditate', d.meditate); }
        if (d.journal) { setJournal(d.journal); saveLocal('journal', d.journal); }
      }
      skipNextSync.current = false;
      setLoaded(true);
    });
    return () => unsub();
  }, []);

  // Save to Firebase + localStorage on any change
  const saveTimer = useRef(null);
  useEffect(() => {
    if (!loaded) return;

    // Save to localStorage immediately
    const data = {
      xp, achs, checkins, grats: gratitudes, cq: customQuotes,
      gym, run, work: workLog, edu, courses, twitter, tasks: taskLists,
      projects, family, habits, meditate, journal,
    };
    Object.entries(data).forEach(([k, v]) => saveLocal(k, v));

    // Debounce Firebase save (500ms)
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      skipNextSync.current = true;
      setDoc(DOC_REF, data, { merge: true }).catch(console.error);
    }, 500);
  }, [xp, achs, checkins, gratitudes, customQuotes, gym, run, workLog, edu, courses, twitter, taskLists, projects, family, habits, meditate, journal, loaded]);

  return {
    xp, setXp, achs, setAchs, checkins, setCheckins,
    gratitudes, setGratitudes, customQuotes, setCustomQuotes,
    gym, setGym, run, setRun, workLog, setWorkLog,
    edu, setEdu, courses, setCourses, twitter, setTwitter,
    taskLists, setTaskLists, projects, setProjects,
    family, setFamily, habits, setHabits,
    meditate, setMeditate, journal, setJournal,
    loaded,
  };
}
