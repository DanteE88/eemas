import { useState } from 'react';
import Modal from '../components/Modal';
import Icon from '../components/Icon';
import { initials } from '../utils/helpers';

const TIPOS = ['Caida', 'Golpe', 'Crisis', 'Enfermedad'];

const EMPTY_INCIDENCIA = {
  tipo: TIPOS[0],
  reporte_papas: 'Si',
  descripcion: '',
  estudiante_id: '',
  estudiante_nombre: '',
  fecha: new Date().toISOString().split('T')[0],
  hora: new Date().toTimeString().slice(0, 5),
};

const TIPO_COLOR = {
  Caida:       { bg: '#fef3cd', color: 'var(--warn)',    icon: '🤕' },
  Golpe:       { bg: 'var(--danger-bg)', color: 'var(--danger)', icon: '🤜' },
  Crisis:      { bg: 'var(--sky-light)', color: 'var(--sky)',    icon: '⚡' },
  Enfermedad:  { bg: 'var(--success-bg)', color: 'var(--success)', icon: '🤒' },
};

function IncidenciaForm({ students, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY_INCIDENCIA });
  const [studentSearch, setStudentSearch] = useState('');
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const filteredStudents = students.filter((s) =>
    !studentSearch || s.nombre_completo.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const selectStudent = (s) => {
    set('estudiante_id', s.id);
    set('estudiante_nombre', s.nombre_completo);
    setStudentSearch(s.nombre_completo);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.estudiante_id) return alert('Selecciona un alumno');
    if (!form.descripcion.trim()) return alert('Escribe una descripción');
    onSave({ ...form, id: Date.now() });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-body">
        {/* Student picker */}
        <div className="form-group full" style={{ marginBottom: 20 }}>
          <label>Alumno <span className="required">*</span></label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Buscar alumno..."
              value={studentSearch}
              onChange={(e) => { setStudentSearch(e.target.value); set('estudiante_id', ''); set('estudiante_nombre', ''); }}
            />
            {studentSearch && !form.estudiante_id && filteredStudents.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)', zIndex: 50, maxHeight: 200, overflowY: 'auto' }}>
                {filteredStudents.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => selectStudent(s)}
                    style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--sky-light)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div className="avatar-initials" style={{ width: 28, height: 28, fontSize: 10 }}>{initials(s.nombre_completo)}</div>
                    <span>{s.nombre_completo}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {form.estudiante_id && (
            <p style={{ fontSize: 12, color: 'var(--success)', marginTop: 4 }}>✓ {form.estudiante_nombre}</p>
          )}
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Fecha <span className="required">*</span></label>
            <input type="date" value={form.fecha} onChange={(e) => set('fecha', e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Hora</label>
            <input type="time" value={form.hora} onChange={(e) => set('hora', e.target.value)} />
          </div>
        </div>

        <div className="divider" />

        {/* Tipo de incidencia */}
        <div className="form-group full" style={{ marginBottom: 16 }}>
          <label>Tipo de Incidencia <span className="required">*</span></label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
            {TIPOS.map((t) => {
              const { bg, color, icon } = TIPO_COLOR[t];
              const active = form.tipo === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => set('tipo', t)}
                  style={{
                    padding: '10px 18px', borderRadius: 'var(--radius)', border: `2px solid ${active ? color : 'var(--gray-200)'}`,
                    background: active ? bg : '#fff', color: active ? color : 'var(--gray-600)',
                    fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all .15s',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <span>{icon}</span> {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reporte a papás */}
        <div className="form-group full" style={{ marginBottom: 16 }}>
          <label>Reporte a Papás <span className="required">*</span></label>
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            {['Si', 'No'].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => set('reporte_papas', v)}
                style={{
                  padding: '9px 24px', borderRadius: 'var(--radius)', border: `2px solid ${form.reporte_papas === v ? (v === 'Si' ? 'var(--success)' : 'var(--danger)') : 'var(--gray-200)'}`,
                  background: form.reporte_papas === v ? (v === 'Si' ? 'var(--success-bg)' : 'var(--danger-bg)') : '#fff',
                  color: form.reporte_papas === v ? (v === 'Si' ? 'var(--success)' : 'var(--danger)') : 'var(--gray-600)',
                  fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all .15s',
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Descripción */}
        <div className="form-group full">
          <label>Descripción <span className="required">*</span></label>
          <textarea
            value={form.descripcion}
            onChange={(e) => set('descripcion', e.target.value)}
            placeholder="Describe lo ocurrido: cómo sucedió, dónde, qué se hizo..."
            style={{ minHeight: 100 }}
            required
          />
        </div>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary">Registrar Incidencia</button>
      </div>
    </form>
  );
}

export default function IncidenciasPage({ students }) {
  const [records, setRecords] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filterTipo, setFilterTipo] = useState('');
  const [search, setSearch] = useState('');

  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    const matchQ = !q || r.estudiante_nombre.toLowerCase().includes(q);
    const matchT = !filterTipo || r.tipo === filterTipo;
    return matchQ && matchT;
  });

  const handleSave = (record) => {
    setRecords((rs) => [record, ...rs]);
    setShowAdd(false);
  };

  const handleDelete = (id) => {
    setRecords((rs) => rs.filter((r) => r.id !== id));
    setConfirmDelete(null);
  };

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {TIPOS.map((t) => {
          const { bg, color, icon } = TIPO_COLOR[t];
          const count = records.filter((r) => r.tipo === t).length;
          return (
            <div key={t} style={{ background: bg, borderRadius: 'var(--radius-lg)', padding: '16px 20px', border: '1px solid var(--gray-200)' }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color, marginBottom: 4 }}>{t}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color }}>{count}</div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="filter-row">
            <div className="search-bar">
              <span className="search-icon" style={{ display: 'flex', alignItems: 'center' }}>
                <Icon name="search" size={15} color="var(--gray-400)" />
              </span>
              <input type="text" placeholder="Buscar por alumno..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="filter-select" value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
              <option value="">Todos los tipos</option>
              {TIPOS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Nueva Incidencia</button>
        </div>

        <div className="table-wrap">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
              <h3>Sin incidencias registradas</h3>
              <p>Registra la primera incidencia con el botón de arriba.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Fecha / Hora</th>
                  <th>Alumno</th>
                  <th>Tipo</th>
                  <th>Reporte a Papás</th>
                  <th>Descripción</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const { bg, color, icon } = TIPO_COLOR[r.tipo] || {};
                  return (
                    <tr key={r.id}>
                      <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
                        {r.fecha}<br />{r.hora}
                      </td>
                      <td><span className="student-name">{r.estudiante_nombre}</span></td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, background: bg, color, fontSize: 12, fontWeight: 600 }}>
                          {icon} {r.tipo}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${r.reporte_papas === 'Si' ? 'badge-success' : 'badge-warn'}`}>
                          {r.reporte_papas === 'Si' ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, color: 'var(--gray-600)' }}>
                        {r.descripcion}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn-icon" title="Ver detalle" onClick={() => setViewRecord(r)}><Icon name="view" size={15} /></button>
                          <button className="btn-icon danger" title="Eliminar" onClick={() => setConfirmDelete(r)}><Icon name="trash" size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {filtered.length > 0 && (
          <div style={{ padding: '10px 20px', borderTop: '1px solid var(--gray-100)', fontSize: 13, color: 'var(--gray-400)' }}>
            {filtered.length} incidencia{filtered.length !== 1 ? 's' : ''} registrada{filtered.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* New incidencia modal */}
      {showAdd && (
        <Modal title="Registrar Incidencia" onClose={() => setShowAdd(false)}>
          <IncidenciaForm students={students} onSave={handleSave} onCancel={() => setShowAdd(false)} />
        </Modal>
      )}

      {/* Detail view modal */}
      {viewRecord && (
        <Modal title="Detalle de Incidencia" onClose={() => setViewRecord(null)}>
          <div className="modal-body">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 36 }}>{TIPO_COLOR[viewRecord.tipo]?.icon}</span>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)' }}>{viewRecord.tipo}</div>
                <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>{viewRecord.fecha} · {viewRecord.hora}</div>
              </div>
            </div>
            <div className="info-grid" style={{ marginBottom: 20 }}>
              <div className="info-item"><label>Alumno</label><p>{viewRecord.estudiante_nombre}</p></div>
              <div className="info-item">
                <label>Reporte a Papás</label>
                <p><span className={`badge ${viewRecord.reporte_papas === 'Si' ? 'badge-success' : 'badge-warn'}`}>{viewRecord.reporte_papas === 'Si' ? 'Sí' : 'No'}</span></p>
              </div>
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <div style={{ padding: '12px 14px', background: 'var(--gray-50)', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)', fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.7 }}>
                {viewRecord.descripcion}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={() => setViewRecord(null)}>Cerrar</button>
          </div>
        </Modal>
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-body" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <p style={{ fontSize: 15, color: 'var(--gray-700)' }}>¿Eliminar esta incidencia de <strong>{confirmDelete.estudiante_nombre}</strong>?</p>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete.id)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
