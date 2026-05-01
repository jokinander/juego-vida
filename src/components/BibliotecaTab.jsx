import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const CATEGORIAS = [
  { id: 'all', label: 'Todas', icon: '✨' },
  { id: 'motivacional', label: 'Motivación', icon: '🔥' },
  { id: 'libro', label: 'Libros', icon: '📚' },
  { id: 'reflexion', label: 'Reflexión', icon: '🧠' },
  { id: 'meta', label: 'Metas', icon: '🎯' },
];

const FRASES_DEFAULT = [
  { id: '1', texto: 'No cuentes los días, haz que los días cuenten.', autor: 'Muhammad Ali', categoria: 'motivacional' },
  { id: '2', texto: 'El hombre más rico de Babilonia no buscaba atajos, buscaba sabiduría.', autor: 'George S. Clason', categoria: 'libro' },
  { id: '3', texto: 'La disciplina es elegirte a vos mismo una y otra vez.', autor: '', categoria: 'reflexion' },
];

export default function BibliotecaTab({ addXP }) {
  const [frases, setFrases] = useState(FRASES_DEFAULT);
  const [fraseDia, setFraseDia] = useState(null);
  const [filtro, setFiltro] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ texto: '', autor: '', categoria: 'motivacional' });
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarFrases();
  }, []);

  useEffect(() => {
    if (frases.length > 0) {
      const idx = Math.floor(Date.now() / 86400000) % frases.length;
      setFraseDia(frases[idx]);
    }
  }, [frases]);

  const cargarFrases = async () => {
    try {
      const ref = doc(db, 'finanzas', 'biblioteca');
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().frases?.length > 0) {
        setFrases(snap.data().frases);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const guardarFrases = async (nuevas) => {
    setGuardando(true);
    try {
      await setDoc(doc(db, 'finanzas', 'biblioteca'), { frases: nuevas });
    } catch (e) {
      console.error(e);
    } finally {
      setGuardando(false);
    }
  };

  const agregarFrase = async () => {
    if (!form.texto.trim()) return;
    let nuevas;
    if (editando) {
      nuevas = frases.map(f => f.id === editando ? { ...form, id: editando } : f);
    } else {
      const nueva = { ...form, id: Date.now().toString() };
      nuevas = [...frases, nueva];
      if (addXP) addXP(5, '📖 Frase agregada a la biblioteca');
    }
    setFrases(nuevas);
    await guardarFrases(nuevas);
    setForm({ texto: '', autor: '', categoria: 'motivacional' });
    setShowForm(false);
    setEditando(null);
  };

  const eliminarFrase = async (id) => {
    const nuevas = frases.filter(f => f.id !== id);
    setFrases(nuevas);
    await guardarFrases(nuevas);
  };

  const iniciarEdicion = (frase) => {
    setForm({ texto: frase.texto, autor: frase.autor, categoria: frase.categoria });
    setEditando(frase.id);
    setShowForm(true);
  };

  const nuevaFraseDia = () => {
    const otras = frases.filter(f => f.id !== fraseDia?.id);
    if (otras.length > 0) {
      setFraseDia(otras[Math.floor(Math.random() * otras.length)]);
    }
  };

  const frasesFiltered = filtro === 'all' ? frases : frases.filter(f => f.categoria === filtro);
  const catActual = CATEGORIAS.find(c => c.id === filtro);

  const styles = {
    container: {
      paddingBottom: 20,
    },
    destacada: {
      background: 'linear-gradient(135deg, var(--sf) 0%, #1a1a2e 100%)',
      border: '1px solid var(--c3)',
      borderRadius: 16,
      padding: '20px 16px',
      marginBottom: 16,
      position: 'relative',
      overflow: 'hidden',
    },
    destacadaGlow: {
      position: 'absolute',
      top: -30,
      right: -30,
      width: 120,
      height: 120,
      background: 'var(--c3)',
      borderRadius: '50%',
      opacity: 0.06,
      filter: 'blur(20px)',
    },
    labelDia: {
      fontFamily: 'var(--mf)',
      fontSize: 9,
      color: 'var(--c3)',
      letterSpacing: 2,
      marginBottom: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    btnNueva: {
      background: 'transparent',
      border: 'none',
      color: 'var(--c3)',
      fontSize: 16,
      cursor: 'pointer',
      padding: '0 4px',
    },
    textoDestacado: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--tx)',
      lineHeight: 1.5,
      marginBottom: 8,
      fontStyle: 'italic',
    },
    autorDestacado: {
      fontSize: 11,
      color: 'var(--t2)',
      fontFamily: 'var(--mf)',
    },
    filtros: {
      display: 'flex',
      gap: 6,
      overflowX: 'auto',
      paddingBottom: 4,
      marginBottom: 12,
      scrollbarWidth: 'none',
    },
    btnFiltro: (activo) => ({
      background: activo ? 'var(--c3)' : 'var(--sf)',
      border: activo ? '1px solid var(--c3)' : '1px solid var(--bd)',
      borderRadius: 20,
      padding: '5px 10px',
      fontSize: 11,
      color: activo ? '#000' : 'var(--t2)',
      fontFamily: 'var(--mf)',
      fontWeight: activo ? 700 : 400,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }),
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    titulo: {
      fontSize: 12,
      color: 'var(--t2)',
      fontFamily: 'var(--mf)',
    },
    btnAgregar: {
      background: 'var(--c1)',
      border: 'none',
      borderRadius: 20,
      padding: '6px 14px',
      fontSize: 12,
      color: '#000',
      fontFamily: 'var(--mf)',
      fontWeight: 700,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 4,
    },
    card: {
      background: 'var(--sf)',
      border: '1px solid var(--bd)',
      borderRadius: 12,
      padding: '14px 14px',
      marginBottom: 10,
    },
    cardTexto: {
      fontSize: 13,
      color: 'var(--tx)',
      lineHeight: 1.5,
      marginBottom: 6,
      fontStyle: 'italic',
    },
    cardFooter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    },
    badge: (cat) => {
      const colors = {
        motivacional: '#ff6b35',
        libro: 'var(--c4)',
        reflexion: 'var(--c3)',
        meta: 'var(--grn)',
      };
      return {
        background: (colors[cat] || 'var(--c2)') + '22',
        border: `1px solid ${colors[cat] || 'var(--c2)'}44`,
        borderRadius: 8,
        padding: '2px 6px',
        fontSize: 9,
        color: colors[cat] || 'var(--c2)',
        fontFamily: 'var(--mf)',
        letterSpacing: 1,
      };
    },
    cardAutor: {
      fontSize: 10,
      color: 'var(--t2)',
    },
    acciones: {
      display: 'flex',
      gap: 8,
    },
    btnAccion: {
      background: 'transparent',
      border: 'none',
      fontSize: 14,
      cursor: 'pointer',
      padding: '2px 4px',
      opacity: 0.5,
    },
    overlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'flex-end',
    },
    modal: {
      background: 'var(--sf)',
      borderRadius: '20px 20px 0 0',
      padding: '20px 16px 36px',
      width: '100%',
      maxWidth: 480,
      margin: '0 auto',
      borderTop: '1px solid var(--bd)',
    },
    modalTitulo: {
      fontFamily: 'var(--mf)',
      fontSize: 11,
      color: 'var(--c3)',
      letterSpacing: 2,
      marginBottom: 16,
      textAlign: 'center',
    },
    textarea: {
      width: '100%',
      background: 'var(--bg)',
      border: '1px solid var(--bd)',
      borderRadius: 10,
      padding: '10px 12px',
      fontSize: 13,
      color: 'var(--tx)',
      fontFamily: 'var(--hf)',
      resize: 'none',
      marginBottom: 10,
      boxSizing: 'border-box',
      minHeight: 90,
    },
    input: {
      width: '100%',
      background: 'var(--bg)',
      border: '1px solid var(--bd)',
      borderRadius: 10,
      padding: '10px 12px',
      fontSize: 13,
      color: 'var(--tx)',
      fontFamily: 'var(--hf)',
      marginBottom: 10,
      boxSizing: 'border-box',
    },
    catSelector: {
      display: 'flex',
      gap: 6,
      marginBottom: 14,
      flexWrap: 'wrap',
    },
    btnCat: (activo) => ({
      background: activo ? 'var(--c3)' : 'var(--bg)',
      border: activo ? '1px solid var(--c3)' : '1px solid var(--bd)',
      borderRadius: 20,
      padding: '5px 10px',
      fontSize: 11,
      color: activo ? '#000' : 'var(--t2)',
      fontFamily: 'var(--mf)',
      cursor: 'pointer',
      fontWeight: activo ? 700 : 400,
    }),
    btnGuardar: {
      width: '100%',
      background: 'linear-gradient(135deg, var(--c1), var(--c3))',
      border: 'none',
      borderRadius: 12,
      padding: '12px',
      fontSize: 13,
      color: '#000',
      fontFamily: 'var(--mf)',
      fontWeight: 700,
      cursor: 'pointer',
      letterSpacing: 1,
    },
    btnCancelar: {
      width: '100%',
      background: 'transparent',
      border: '1px solid var(--bd)',
      borderRadius: 12,
      padding: '10px',
      fontSize: 12,
      color: 'var(--t2)',
      fontFamily: 'var(--mf)',
      cursor: 'pointer',
      marginTop: 8,
    },
    vacio: {
      textAlign: 'center',
      padding: '30px 0',
      color: 'var(--t2)',
      fontSize: 13,
    },
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--t2)', fontFamily: 'var(--mf)', fontSize: 12 }}>
      Cargando biblioteca...
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Frase del día */}
      {fraseDia && (
        <div style={styles.destacada}>
          <div style={styles.destacadaGlow} />
          <div style={styles.labelDia}>
            <span>✨ FRASE DEL DÍA</span>
            <button style={styles.btnNueva} onClick={nuevaFraseDia} title="Otra frase">🔀</button>
          </div>
          <div style={styles.textoDestacado}>"{fraseDia.texto}"</div>
          {fraseDia.autor && <div style={styles.autorDestacado}>— {fraseDia.autor}</div>}
        </div>
      )}

      {/* Filtros */}
      <div style={styles.filtros}>
        {CATEGORIAS.map(c => (
          <button key={c.id} style={styles.btnFiltro(filtro === c.id)} onClick={() => setFiltro(c.id)}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Header lista */}
      <div style={styles.header}>
        <span style={styles.titulo}>
          {catActual?.icon} {frasesFiltered.length} {frasesFiltered.length === 1 ? 'frase' : 'frases'}
        </span>
        <button style={styles.btnAgregar} onClick={() => { setShowForm(true); setEditando(null); setForm({ texto: '', autor: '', categoria: 'motivacional' }); }}>
          + Agregar
        </button>
      </div>

      {/* Lista */}
      {frasesFiltered.length === 0 ? (
        <div style={styles.vacio}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📖</div>
          <div>No hay frases en esta categoría</div>
        </div>
      ) : (
        frasesFiltered.map(f => (
          <div key={f.id} style={styles.card}>
            <div style={styles.cardTexto}>"{f.texto}"</div>
            <div style={styles.cardFooter}>
              <div style={styles.cardMeta}>
                <span style={styles.badge(f.categoria)}>
                  {CATEGORIAS.find(c => c.id === f.categoria)?.icon} {f.categoria.toUpperCase()}
                </span>
                {f.autor && <span style={styles.cardAutor}>— {f.autor}</span>}
              </div>
              <div style={styles.acciones}>
                <button style={styles.btnAccion} onClick={() => iniciarEdicion(f)}>✏️</button>
                <button style={styles.btnAccion} onClick={() => eliminarFrase(f.id)}>🗑️</button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Modal agregar/editar */}
      {showForm && (
        <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div style={styles.modal}>
            <div style={styles.modalTitulo}>{editando ? '✏️ EDITAR FRASE' : '+ NUEVA FRASE'}</div>
            <textarea
              style={styles.textarea}
              placeholder="Escribí la frase..."
              value={form.texto}
              onChange={e => setForm(f => ({ ...f, texto: e.target.value }))}
              autoFocus
            />
            <input
              style={styles.input}
              placeholder="Autor (opcional)"
              value={form.autor}
              onChange={e => setForm(f => ({ ...f, autor: e.target.value }))}
            />
            <div style={styles.catSelector}>
              {CATEGORIAS.filter(c => c.id !== 'all').map(c => (
                <button key={c.id} style={styles.btnCat(form.categoria === c.id)} onClick={() => setForm(f => ({ ...f, categoria: c.id }))}>
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
            <button style={styles.btnGuardar} onClick={agregarFrase} disabled={guardando}>
              {guardando ? 'GUARDANDO...' : editando ? 'GUARDAR CAMBIOS' : 'GUARDAR FRASE'}
            </button>
            <button style={styles.btnCancelar} onClick={() => { setShowForm(false); setEditando(null); }}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
