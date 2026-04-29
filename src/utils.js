// Date helpers
export const getToday = () => new Date().toISOString().split('T')[0];

export const getWeekKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.toISOString().split('T')[0];
};

export const inWeek = (date, wk) => {
  const d = new Date(date), w = new Date(wk);
  return d >= w && d < new Date(w.getTime() + 7 * 864e5);
};

export const isEvening = () => new Date().getHours() >= 20;

export const formatDate = () =>
  new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

// LocalStorage
const PREFIX = 'jdmv_';
export const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(PREFIX + key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};
export const save = (key, val) => {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(val)); } catch {}
};

// XP & Levels - MORE SEVERE SYSTEM
export const BASE_XP = 150; // harder to level up
export const getLevel = (xp) => {
  if (xp < 0) return { name: 'Rookie', num: 0, color: '#94a3b8', icon: '🌱', min: 0, next: BASE_XP };
  const lv = Math.floor(xp / BASE_XP);
  const names = ['Rookie', 'Constante', 'Enfocado', 'Guerrero', 'Máquina', 'Bestia', 'Leyenda'];
  const colors = ['#94a3b8', '#22d3ee', '#34d399', '#a78bfa', '#f97316', '#ef4444', '#fbbf24'];
  const icons = ['🌱', '💧', '🎯', '⚔️', '⚙️', '🦁', '👑'];
  const tier = Math.min(lv, 6);
  const suffix = lv >= 7 ? ` ${lv - 5}` : '';
  return {
    name: names[tier] + suffix, num: lv, color: colors[tier], icon: icons[tier],
    min: lv * BASE_XP, next: (lv + 1) * BASE_XP
  };
};

// Streak calculators
export const calcWorkoutStreak = (gym, run) => {
  let s = 0;
  const d = new Date();
  while (true) {
    const k = d.toISOString().split('T')[0];
    if (gym[k] || run[k]) { s++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return s;
};

export const calcHabitStreak = (log) => {
  let s = 0;
  const d = new Date();
  while (true) {
    const k = d.toISOString().split('T')[0];
    if (log[k] === 'clean') { s++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return s;
};

// Check if user entered today (for penalty system)
export const getLastEntry = () => load('lastEntry', null);
export const setLastEntry = (date) => save('lastEntry', date);

// Constants
export const MOODS = [
  { emoji: '😤', label: 'Mal', color: '#ef4444' },
  { emoji: '😐', label: 'Meh', color: '#94a3b8' },
  { emoji: '🙂', label: 'Bien', color: '#4ecdc4' },
  { emoji: '😁', label: 'Muy bien', color: '#22d3ee' },
  { emoji: '🔥', label: 'Imparable', color: '#fbbf24' },
];

export const BASE_QUOTES = [
  'Ya estuviste ahí arriba. Volvé.',
  'Hoy es el día que tu yo del futuro te va a agradecer.',
  'No pares hasta que estés orgulloso.',
  'La disciplina le gana a la motivación.',
  'Tu mejor versión te está esperando.',
  'Leé, entrená, crecé. Repetí.',
  'Las ideas sin acción son solo sueños.',
  'Menos scroll, más crecimiento.',
  'Un día a la vez. Hoy contás vos.',
  'El que no arriesga no gana.',
  'Cada día que elegís bien, te acercás más.',
  'Hacé algo hoy que tu yo de ayer no se animó.',
];

export const DEFAULT_GRATITUDES = [
  'Mi salud', 'Mi familia', 'Mis proyectos', 'Un buen café',
  'El gimnasio', 'Tener trabajo', 'Aprender algo nuevo',
  'Un día más', 'Mis amigos', 'Mi progreso',
];

export const EVENING_PROMPTS = [
  '¿Qué fue lo mejor que te pasó hoy?',
  '¿Qué momento del día te hizo sonreír?',
  'Contame algo lindo del día.',
  '¿Por qué cosa de hoy estás agradecido?',
  '¿Qué aprendiste hoy que valga la pena recordar?',
];

export const DAY_RATING = [
  { emoji: '😫', label: 'Malo', color: '#ef4444' },
  { emoji: '😐', label: 'Regular', color: '#94a3b8' },
  { emoji: '🙂', label: 'Bueno', color: '#4ecdc4' },
  { emoji: '😁', label: 'Muy bueno', color: '#22d3ee' },
  { emoji: '🤩', label: 'Increíble', color: '#fbbf24' },
];

export const ACHIEVEMENTS = [
  { id: 'gym1', name: 'Primera Pesa', desc: 'Primer gym', icon: '🏋️', xp: 10, check: s => s.gymTotal >= 1 },
  { id: 'run1', name: 'Primer Km', desc: 'Primera corrida', icon: '🏃', xp: 10, check: s => s.runTotal >= 1 },
  { id: 'wkfull', name: 'Semana Completa', desc: '3 gym + 3 corridas', icon: '⚔️', xp: 30, check: s => s.weekGym >= 3 && s.weekRun >= 3 },
  { id: 'str5', name: 'Racha x5', desc: '5 días entreno', icon: '🔥', xp: 20, check: s => s.streak >= 5 },
  { id: 'str14', name: 'Racha x14', desc: '14 días seguidos', icon: '💥', xp: 40, check: s => s.streak >= 14 },
  { id: 'edu1', name: 'Lector', desc: 'Primera educación', icon: '📖', xp: 10, check: s => s.eduTotal >= 1 },
  { id: 'fam1', name: 'Buen Hijo', desc: 'Llamar a papá y mamá', icon: '📞', xp: 15, check: s => s.calledParents >= 1 },
  { id: 'fam2', name: 'Hermano del Año', desc: 'Ver a Aitziber', icon: '👫', xp: 15, check: s => s.sawSister >= 1 },
  { id: 'proj5', name: 'Ideador', desc: '5 ideas de proyecto', icon: '💡', xp: 20, check: s => s.ideasTotal >= 5 },
  { id: 'hab7', name: '7 Días Limpio', desc: 'Racha 7 en un hábito', icon: '🛡️', xp: 30, check: s => s.bestHabit >= 7 },
  { id: 'hab30', name: 'Mes Limpio', desc: '30 días en un hábito', icon: '💎', xp: 60, check: s => s.bestHabit >= 30 },
  { id: 'wkperf', name: 'Semana Perfecta', desc: 'Todos los objetivos', icon: '🌟', xp: 50, check: s => s.weekPerfect },
];

// XP VALUES - more severe
export const XP = {
  checkin: 3,
  gym: 8,
  run: 6,
  plank: 5,
  pushups: 4,
  workPlan: 4,
  workCoord: 4,
  eduReading: 5,
  eduPodcast: 5,
  eduVideo: 5,
  twitter: 2,
  familyCall: 8,
  familySister: 8,
  taskComplete: 2,
  idea: 3,
  journal: 3,
  habitClean: 4,
  // PENALTIES
  habitBadSmoke: -25,
  habitBadEat: -15,
  habitBadAlcohol: -15,
  missedDay: -30, // not entering app for a day
  missedSecondEntry: -15, // not entering twice
};
