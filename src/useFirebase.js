import { useState, useEffect, useRef } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

const DOC_REF = doc(db, 'juego', 'jokin');

const loadLocal = (key, fallback) => {
  try { const v = localStorage.getItem('jdmv_' + key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
};
const saveLocal = (key, val) => {
  try { localStorage.setItem('jdmv_' + key, JSON.stringify(val)); } catch {}
};

const DEFAULT_GRATITUDES = ['Mi salud', 'Mi familia', 'Mis proyectos', 'Un buen café', 'El gimnasio', 'Tener trabajo', 'Aprender algo nuevo', 'Un día más', 'Mis amigos', 'Mi progreso'];
const DEFAULT_PROJECTS = [
  { id: 1, name: 'Distribución Fármacos Animales', icon: '💊', ideas: [] },
  { id: 2, name: 'Proyecto Inmobiliario San Martín', icon: '🏗️', ideas: [] },
];

export function useFirebaseState() {
  const [xp, setXp] = useState(() => loadLocal('xp', 0));
  const [achs, setAchs] = useState(() => loadLocal('achs', []));
  const [checkins, setCheckins] = useState(() => loadLocal('checkins', {}));
  const [gratitudes, setGratitudes] = useState(() => loadLocal('grats', DEFAULT_GRATITUDES));
  const [customQuotes, setCustomQuotes] = useState(() => loadLocal('cq', []));
  const [gym, setGym] = useState(() => loadLocal('gym', {}));
  const [run, setRun] = useState(() => loadLocal('run', {}));
  const [plank, setPlank] = useState(() => loadLocal('plank', {}));
  const [pushups, setPushups] = useState(() => loadLocal('pushups', {}));
  const [workLog, setWorkLog] = useState(() => loadLocal('work', {}));
  const [workNotes, setWorkNotes] = useState(() => loadLocal('workNotes', []));
  const [edu, setEdu] = useState(() => loadLocal('edu', {}));
  const [courses, setCourses] = useState(() => loadLocal('courses', []));
  const [twitter, setTwitter] = useState(() => loadLocal('twitter', {}));
  const [taskLists, setTaskLists] = useState(() => loadLocal('tasks', { super: [], houseShop: [], houseTasks: [], life: [] }));
  const [projects, setProjects] = useState(() => loadLocal('projects', DEFAULT_PROJECTS));
  const [family, setFamily] = useState(() => loadLocal('family', {}));
  const [habits, setHabits] = useState(() => loadLocal('habits', { comer: {}, alcohol: {}, fumar: {} }));
  const [meditate, setMeditate] = useState(() => loadLocal('meditate', {}));
  const [journal, setJournal] = useState(() => loadLocal('journal', {}));
  const [dayRatings, setDayRatings] = useState(() => loadLocal('dayRatings', {}));
  const [entryLog, setEntryLog] = useState(() => loadLocal('entryLog', {}));

  const [loaded, setLoaded] = useState(false);
  const skipNextSync = useRef(false);

  // Load from Firebase
  useEffect(() => {
    const unsub = onSnapshot(DOC_REF, (snap) => {
      if (snap.exists() && !skipNextSync.current) {
        const d = snap.data();
        const fields = [
          ['xp', setXp], ['achs', setAchs], ['checkins', setCheckins], ['grats', setGratitudes],
          ['cq', setCustomQuotes], ['gym', setGym], ['run', setRun], ['plank', setPlank],
          ['pushups', setPushups], ['work', setWorkLog], ['workNotes', setWorkNotes],
          ['edu', setEdu], ['courses', setCourses], ['twitter', setTwitter], ['tasks', setTaskLists],
          ['projects', setProjects], ['family', setFamily], ['habits', setHabits],
          ['meditate', setMeditate], ['journal', setJournal], ['dayRatings', setDayRatings],
          ['entryLog', setEntryLog],
        ];
        fields.forEach(([key, setter]) => {
          if (d[key] !== undefined) { setter(d[key]); saveLocal(key, d[key]); }
        });
      }
      skipNextSync.current = false;
      setLoaded(true);
    });
    return () => unsub();
  }, []);

  // Save to Firebase + localStorage
  const saveTimer = useRef(null);
  useEffect(() => {
    if (!loaded) return;
    const data = {
      xp, achs, checkins, grats: gratitudes, cq: customQuotes,
      gym, run, plank, pushups, work: workLog, workNotes, edu, courses,
      twitter, tasks: taskLists, projects, family, habits, meditate,
      journal, dayRatings, entryLog,
    };
    Object.entries(data).forEach(([k, v]) => saveLocal(k, v));
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      skipNextSync.current = true;
      setDoc(DOC_REF, data, { merge: true }).catch(console.error);
    }, 500);
  }, [xp, achs, checkins, gratitudes, customQuotes, gym, run, plank, pushups, workLog, workNotes, edu, courses, twitter, taskLists, projects, family, habits, meditate, journal, dayRatings, entryLog, loaded]);

  return {
    xp, setXp, achs, setAchs, checkins, setCheckins,
    gratitudes, setGratitudes, customQuotes, setCustomQuotes,
    gym, setGym, run, setRun, plank, setPlank, pushups, setPushups,
    workLog, setWorkLog, workNotes, setWorkNotes,
    edu, setEdu, courses, setCourses, twitter, setTwitter,
    taskLists, setTaskLists, projects, setProjects,
    family, setFamily, habits, setHabits,
    meditate, setMeditate, journal, setJournal,
    dayRatings, setDayRatings, entryLog, setEntryLog,
    loaded,
  };
}
