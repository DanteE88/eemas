import { useState } from 'react';
import { GRUPOS, STATUS_OPTS } from '../constants';
import { calcEdad, initials } from '../utils/helpers';
import Icon from '../components/Icon';

export default function StudentsPage({ students, onAdd, onEdit, onDelete, onView }) {
  const [search, setSearch] = useState('');
  const [filterGrupo, setFilterGrupo] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const matchQ = !q || s.nombre_completo.toLowerCase().includes(q) || s.matricula.toLowerCase().includes(q) || (s.dx || '').toLowerCase().includes(q);
    const matchG = !filterGrupo || s.grupo === filterGrupo;
    const matchS = !filterStatus || s.status === filterStatus;
    return matchQ && matchG && matchS;
  });

  const statusColor = (st) => {
    if (st === 'Activo') return 'badge-success';
    if (st === 'Baja') return 'badge-warn';
    if (st === 'Egresado') return 'badge-blue';
    return 'badge-gray';
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="filter-row">
            <div className="search-bar">
              <span className="search-icon" style={{ display: 'flex', alignItems: 'center' }}>
                <Icon name="search" size={15} color="var(--gray-400)" />
              </span>
              <input type="text" placeholder="Buscar alumno..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="filter-select" value={filterGrupo} onChange={(e) => setFilterGrupo(e.target.value)}>
              <option value="">Todos los grupos</option>
              {GRUPOS.map((g) => <option key={g}>{g}</option>)}
            </select>
            <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">Todos los status</option>
              {STATUS_OPTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <button className="btn btn-primary btn-sm" onClick={onAdd}>+ Nuevo Alumno</button>
        </div>

        <div className="table-wrap">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3>No se encontraron alumnos</h3>
              <p>Prueba con otros filtros o agrega un nuevo alumno.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Alumno</th>
                  <th>Matrícula</th>
                  <th>Grupo</th>
                  <th>DX</th>
                  <th>Edad</th>
                  <th>Status</th>
                  <th>Teléfono</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="avatar-cell">
                        {s.foto_url
                          ? <img src={s.foto_url} className="avatar" alt="foto" />
                          : <div className="avatar-initials">{initials(s.nombre_completo)}</div>
                        }
                        <span className="student-name">{s.nombre_completo}</span>
                      </div>
                    </td>
                    <td><span className="student-id">{s.matricula}</span></td>
                    <td><span className="badge badge-blue">{s.grupo || '—'}</span></td>
                    <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.dx || <span className="text-muted">—</span>}
                    </td>
                    <td>{calcEdad(s.fecha_nacimiento)}</td>
                    <td><span className={`badge ${statusColor(s.status)}`}>{s.status || '—'}</span></td>
                    <td>{s.telefono_principal}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn-icon" title="Ver perfil" onClick={() => onView(s)}><Icon name="view" size={15} /></button>
                        <button className="btn-icon" title="Editar" onClick={() => onEdit(s)}><Icon name="edit" size={15} /></button>
                        <button className="btn-icon danger" title="Eliminar" onClick={() => onDelete(s)}><Icon name="trash" size={15} /></button>
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
            Mostrando {filtered.length} de {students.length} alumnos
          </div>
        )}
      </div>
    </div>
  );
}
