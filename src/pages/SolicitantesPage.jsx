import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Icon from '../components/Icon';
import { db } from '../services/db';

const EMPTY = {
  nombre_completo: '',
  fecha_nacimiento: '',
  dx_presuntivo: '',
  nombre_contacto: '',
  telefono: '',
  email: '',
  fecha_solicitud: new Date().toISOString().split('T')[0],
  status: 'Pendiente',
  notas: '',
};

const STATUS_OPTS = ['Pendiente', 'En proceso', 'Admitido', 'No admitido'];

const STATUS_COLOR = {
  'Pendiente':   'badge-warn',
  'En proceso':  'badge-blue',
  'Admitido':    'badge-success',
  'No admitido': 'badge-gray',
};

function SolicitanteForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState(() => initial ? { ...EMPTY, ...initial } : { ...EMPTY });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
      <div className="modal-body">
        <div className="form-grid">
          <div className="form-group full">
            <label>Nombre del Alumno <span className="required">*</span></label>
            <input type="text" value={form.nombre_completo} onChange={(e) => set('nombre_completo', e.target.value)} required placeholder="Apellido Apellido, Nombre(s)" />
          </div>
          <div className="form-group">
            <label>Fecha de Nacimiento</label>
            <input type="date" value={form.fecha_nacimiento} onChange={(e) => set('fecha_nacimiento', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Diagnóstico Presuntivo</label>
            <input type="text" value={form.dx_presuntivo} onChange={(e) => set('dx_presuntivo', e.target.value)} placeholder="TEA, DI, etc." />
          </div>
        </div>

        <div className="divider" />
        <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--gray-400)', marginBottom: 14 }}>Contacto</p>
        <div className="form-grid">
          <div className="form-group full">
            <label>Nombre del Contacto <span className="required">*</span></label>
            <input type="text" value={form.nombre_contacto} onChange={(e) => set('nombre_contacto', e.target.value)} required placeholder="Padre / Madre / Tutor" />
          </div>
          <div className="form-group">
            <label>Teléfono <span className="required">*</span></label>
            <input type="tel" value={form.telefono} onChange={(e) => set('telefono', e.target.value)} required placeholder="664 000 0000" />
          </div>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="opcional@email.com" />
          </div>
        </div>

        <div className="divider" />
        <div className="form-grid">
          <div className="form-group">
            <label>Fecha de Solicitud</label>
            <input type="date" value={form.fecha_solicitud} onChange={(e) => set('fecha_solicitud', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)}>
              {STATUS_OPTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group full">
            <label>Notas</label>
            <textarea value={form.notas} onChange={(e) => set('notas', e.target.value)} placeholder="Observaciones adicionales..." />
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <><span className="spinner" />&nbsp;Guardando...</> : <>{initial ? 'Actualizar' : 'Agregar'} Solicitante</>}
        </button>
      </div>
    </form>
  );
}

export default function SolicitantesPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [alert, setAlert] = useState(null);

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data, error } = await db.getSolicitantes();
    if (!error) setRecords(data || []);
    setLoading(false);
  };

  const handleSave = async (form) => {
    setFormLoading(true);
    if (editRecord) {
      const { error } = await db.updateSolicitante(editRecord.id, form);
      if (!error) {
        setRecords((rs) => rs.map((r) => r.id === editRecord.id ? { ...r, ...form } : r));
        setEditRecord(null);
        showAlert('Solicitante actualizado');
      } else showAlert('Error al actualizar', 'error');
    } else {
      const { data, error } = await db.addSolicitante(form);
      if (!error && data) {
        setRecords((rs) => [data, ...rs]);
        setShowAdd(false);
        showAlert('Solicitante agregado');
      } else showAlert('Error al guardar', 'error');
    }
    setFormLoading(false);
  };

  const handleDelete = async () => {
    setFormLoading(true);
    const { error } = await db.deleteSolicitante(confirmDelete.id);
    if (!error) {
      setRecords((rs) => rs.filter((r) => r.id !== confirmDelete.id));
      setConfirmDelete(null);
      showAlert('Solicitante eliminado');
    } else showAlert('Error al eliminar', 'error');
    setFormLoading(false);
  };

  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    const matchQ = !q || r.nombre_completo.toLowerCase().includes(q) || r.nombre_contacto.toLowerCase().includes(q) || r.telefono.includes(q);
    const matchS = !filterStatus || r.status === filterStatus;
    return matchQ && matchS;
  });

  return (
    <div>
      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {STATUS_OPTS.map((s) => {
          const count = records.filter((r) => r.status === s).length;
          const colors = {
            'Pendiente':   ['#fef3cd', 'var(--warn)'],
            'En proceso':  ['var(--sky-light)', 'var(--sky)'],
            'Admitido':    ['var(--success-bg)', 'var(--success)'],
            'No admitido': ['var(--gray-100)', 'var(--gray-500)'],
          };
          const [bg, color] = colors[s];
          return (
            <div key={s} style={{ background: bg, borderRadius: 'var(--radius-lg)', padding: '16px 20px', border: '1px solid var(--gray-200)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color, marginBottom: 6 }}>{s}</div>
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
              <input type="text" placeholder="Buscar solicitante..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">Todos los status</option>
              {STATUS_OPTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Nuevo Solicitante</button>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="page-loader"><div className="spinner spin-dark" />Cargando...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>Sin solicitantes registrados</h3>
              <p>Agrega el primer solicitante con el botón de arriba.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Alumno</th>
                  <th>Contacto</th>
                  <th>Teléfono</th>
                  <th>DX Presuntivo</th>
                  <th>Fecha Solicitud</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td><span className="student-name">{r.nombre_completo}</span></td>
                    <td style={{ fontSize: 13, color: 'var(--gray-600)' }}>{r.nombre_contacto}</td>
                    <td style={{ fontSize: 13 }}>{r.telefono}</td>
                    <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>{r.dx_presuntivo || '—'}</td>
                    <td style={{ fontSize: 13, fontFamily: 'DM Mono, monospace', color: 'var(--gray-500)' }}>{r.fecha_solicitud || '—'}</td>
                    <td><span className={`badge ${STATUS_COLOR[r.status] || 'badge-gray'}`}>{r.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn-icon" title="Editar" onClick={() => setEditRecord(r)}><Icon name="edit" size={15} /></button>
                        <button className="btn-icon danger" title="Eliminar" onClick={() => setConfirmDelete(r)}><Icon name="trash" size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {filtered.length > 0 && (
          <div style={{ padding: '10px 20px', borderTop: '1px solid var(--gray-100)', fontSize: 13, color: 'var(--gray-400)' }}>
            Mostrando {filtered.length} de {records.length} solicitantes
          </div>
        )}
      </div>

      {showAdd && (
        <Modal title="Nuevo Solicitante" onClose={() => setShowAdd(false)}>
          <SolicitanteForm onSave={handleSave} onCancel={() => setShowAdd(false)} loading={formLoading} />
        </Modal>
      )}

      {editRecord && (
        <Modal title="Editar Solicitante" onClose={() => setEditRecord(null)}>
          <SolicitanteForm initial={editRecord} onSave={handleSave} onCancel={() => setEditRecord(null)} loading={formLoading} />
        </Modal>
      )}

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
              <p style={{ fontSize: 15, color: 'var(--gray-700)' }}>¿Eliminar a <strong>{confirmDelete.nombre_completo}</strong>?</p>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)} disabled={formLoading}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={formLoading}>
                {formLoading ? <span className="spinner" /> : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
