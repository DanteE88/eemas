import { calcEdad, initials, fmtDate } from '../utils/helpers';

export default function ProfilePage({ student, onBack, onEdit, onGenerateID }) {
  if (!student) return null;

  const fields = (items) => (
    <div className="info-grid">
      {items.map(([label, val]) => (
        <div className="info-item" key={label}>
          <label>{label}</label>
          <p>{val || '—'}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 20 }}>← Volver</button>

      <div className="profile-header">
        {student.foto_url
          ? <img src={student.foto_url} className="profile-avatar-lg" alt="foto" />
          : <div className="profile-avatar-lg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>{initials(student.nombre_completo)}</div>
        }
        <div style={{ flex: 1 }}>
          <h2>{student.nombre_completo}</h2>
          <div className="profile-meta">{student.matricula} · Grupo {student.grupo}</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <span className={`badge ${student.status === 'Activo' ? 'badge-success' : student.status === 'Egresado' ? 'badge-blue' : 'badge-warn'}`}>
              {student.status}
            </span>
            {student.dx && <span className="badge badge-blue">{student.dx}</span>}
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={() => onEdit(student)}>Editar</button>
            <button className="btn btn-ghost btn-sm" onClick={() => onGenerateID(student)}>Generar Credencial</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-header"><span style={{ fontWeight: 600, color: 'var(--navy)', fontSize: 14 }}>Datos Generales</span></div>
          <div className="card-body">
            {fields([
              ['Fecha de Nacimiento', fmtDate(student.fecha_nacimiento)],
              ['Edad', calcEdad(student.fecha_nacimiento)],
              ['Diagnóstico', student.dx],
              ['Grupo', student.grupo],
            ])}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span style={{ fontWeight: 600, color: 'var(--navy)', fontSize: 14 }}>Datos Médicos</span></div>
          <div className="card-body">
            {fields([
              ['Factor RH', student.factor_rh],
              ['Alergias', student.alergias],
              ['Redes / Terapias', student.redes_auto],
            ])}
          </div>
        </div>
        <div className="card" style={{ gridColumn: '1/-1' }}>
          <div className="card-header"><span style={{ fontWeight: 600, color: 'var(--navy)', fontSize: 14 }}>Familia y Contacto</span></div>
          <div className="card-body">
            {fields([
              ['Nombre de la Madre', student.nombre_madre],
              ['Nombre del Padre', student.nombre_padre],
              ['Teléfono Principal', student.telefono_principal],
              ['Teléfono Secundario', student.telefono_secundario],
            ])}
          </div>
        </div>
      </div>
    </div>
  );
}
