// Date helpers
export const getToday = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };

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

// XP & Levels
export const BASE_XP = 100;
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

export const GUIDED_STEPS = [
  'Cerrá los ojos. Sentí tus pies en el piso. Estás acá, estás vivo.',
  'Inhalá profundo... 1... 2... 3... 4... Exhalá lento...',
  'Pensá en UNA cosa que te haga bien hoy. Puede ser chiquita.',
  'Hoy no necesitás ser perfecto. Solo un paso más que ayer.',
  'Abrí los ojos despacio. Tu día empieza ahora. Vos elegís cómo.',
];

export const CALM_TIPS = [
  { t: 'Respiración 4-4-4', d: 'Inhalá 4 seg, mantené 4, exhalá 4. Repetí 5 veces.' },
  { t: 'Estiramiento matutino', d: '2 min de elongación apenas te levantás.' },
  { t: 'No agarres el celu', d: 'Los primeros 15 min sin redes.' },
  { t: 'Agua antes que café', d: 'Un vaso de agua activa todo.' },
  { t: 'Caminata de 5 min', d: 'Salí afuera. Luz natural resetea tu humor.' },
  { t: 'Gratitud activa', d: 'Nombrá 3 cosas buenas en voz alta.' },
  { t: 'Body scan', d: 'Cerrá los ojos. Recorré tu cuerpo, 1 min.' },
  { t: 'Regla de 2 min', d: 'Si tarda menos de 2 min, hacelo ya.' },
  { t: 'Música sin letra', d: 'Lo-fi o clásica para arrancar.' },
  { t: 'Visualizá tu día', d: '30 seg imaginando tu día ideal.' },
];

export const ACHIEVEMENTS = [
  { id: 'gym1', name: 'Primera Pesa', desc: 'Primer gym', icon: '🏋️', xp: 20, check: s => s.gymTotal >= 1 },
  { id: 'run1', name: 'Primer Km', desc: 'Primera corrida', icon: '🏃', xp: 20, check: s => s.runTotal >= 1 },
  { id: 'wkfull', name: 'Semana Completa', desc: '3 gym + 3 corridas', icon: '⚔️', xp: 50, check: s => s.weekGym >= 3 && s.weekRun >= 3 },
  { id: 'str5', name: 'Racha x5', desc: '5 días entreno', icon: '🔥', xp: 30, check: s => s.streak >= 5 },
  { id: 'str14', name: 'Racha x14', desc: '14 días seguidos', icon: '💥', xp: 60, check: s => s.streak >= 14 },
  { id: 'edu1', name: 'Lector', desc: 'Primera educación', icon: '📖', xp: 20, check: s => s.eduTotal >= 1 },
  { id: 'eduwk', name: 'Semana Educativa', desc: '3 edu/semana', icon: '📚', xp: 40, check: s => s.weekEdu >= 3 },
  { id: 'tw7', name: 'Info Junkie', desc: '7 días Twitter', icon: '🐦', xp: 25, check: s => s.twitterTotal >= 7 },
  { id: 'fam1', name: 'Buen Hijo', desc: 'Llamar a papá y mamá', icon: '📞', xp: 25, check: s => s.calledParents >= 1 },
  { id: 'fam2', name: 'Hermano del Año', desc: 'Ver a Aitziber', icon: '👫', xp: 25, check: s => s.sawSister >= 1 },
  { id: 'med5', name: 'Mente Clara', desc: '5 meditaciones', icon: '🧘', xp: 30, check: s => s.meditateTotal >= 5 },
  { id: 'chk10', name: 'Reflexivo', desc: '10 check-ins', icon: '📝', xp: 30, check: s => s.checkinTotal >= 10 },
  { id: 'proj5', name: 'Ideador', desc: '5 ideas de proyecto', icon: '💡', xp: 30, check: s => s.ideasTotal >= 5 },
  { id: 'plan1', name: 'Planificador', desc: 'Planificar en Work', icon: '📋', xp: 20, check: s => s.workPlanned >= 1 },
  { id: 'hab7', name: '7 Días Limpio', desc: 'Racha 7 en un hábito', icon: '🛡️', xp: 50, check: s => s.bestHabit >= 7 },
  { id: 'hab30', name: 'Mes Limpio', desc: '30 días en un hábito', icon: '💎', xp: 100, check: s => s.bestHabit >= 30 },
  { id: 'wkperf', name: 'Semana Perfecta', desc: 'Todos los objetivos', icon: '🌟', xp: 75, check: s => s.weekPerfect },
  { id: 'quote1', name: 'Motivador', desc: 'Tu primera frase', icon: '✍️', xp: 15, check: s => s.customQuotes >= 1 },
];

// Rain sound
let audioCtx = null, rainSource = null, rainGain = null;

export const startRain = () => {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const size = 2 * audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, size, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    rainSource = audioCtx.createBufferSource();
    rainSource.buffer = buffer;
    rainSource.loop = true;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    rainGain = audioCtx.createGain();
    rainGain.gain.setValueAtTime(0, audioCtx.currentTime);
    rainGain.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + 2);
    rainSource.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(audioCtx.destination);
    rainSource.start();
  } catch (e) { console.log('Audio error:', e); }
};

export const stopRain = () => {
  try {
    if (rainGain && audioCtx) rainGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
    setTimeout(() => {
      try { rainSource?.stop(); audioCtx?.close(); } catch {}
      rainSource = null; rainGain = null; audioCtx = null;
    }, 2000);
  } catch {}
};
