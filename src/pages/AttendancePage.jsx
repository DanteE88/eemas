import { useState, useEffect } from 'react';
import { GRUPOS } from '../constants';
import { DEMO_MODE, supabase } from '../config';
import { initials } from '../utils/helpers';

export default function AttendancePage({ students }) {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedGroup, setSelectedGroup] = useState(GRUPOS[0]);
  const [attendance, setAttendance] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const groupStudents = students.filter((s) => s.grupo === selectedGroup && s.status === 'Activo');
  const storageKey = `attendance_${selectedDate}_${selectedGroup}`;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setAttendance(JSON.parse(stored));
    } else {
      const init = {};
      groupStudents.forEach((s) => { init[s.id] = 'presente'; });
      setAttendance(init);
    }
    setSaved(false);
  }, [selectedDate, selectedGroup]);

  const toggle = (id, val) => setAttendance((a) => ({ ...a, [id]: val }));

  const saveAttendance = async () => {
    setSaving(true);
    localStorage.setItem(storageKey, JSON.stringify(attendance));
    if (!DEMO_MODE && supabase) {
      const rows = Object.entries(attendance).map(([estudiante_id, status]) => ({
        estudiante_id, fecha: selectedDate, status, grupo: selectedGroup,
      }));
      await supabase.from('asistencia').upsert(rows, { onConflict: 'estudiante_id,fecha' });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const presentes    = Object.values(attendance).filter((v) => v === 'presente').length;
  const ausentes     = Object.values(attendance).filter((v) => v === 'ausente').length;
  const justificados = Object.values(attendance).filter((v) => v === 'justificado').length;
  const retardos     = Object.values(attendance).filter((v) => v === 'retardo').length;

  const STATUS_COLOR = {
    presente:    'var(--success)',
    ausente:     'var(--danger)',
    justificado: 'var(--warn)',
    retardo:     'var(--sky)',
  };

  const statusStyle = (val, current) => ({
    padding: '5px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none',
    background: current === val ? STATUS_COLOR[val] : 'var(--gray-100)',
    color: current === val ? '#fff' : 'var(--gray-500)',
    transition: 'all .15s',
  });

  return (
    <div>
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { label: 'Presentes',    value: presentes,           bg: 'var(--success-bg)', color: 'var(--success)' },
          { label: 'Ausentes',     value: ausentes,            bg: 'var(--danger-bg)',  color: 'var(--danger)'  },
          { label: 'Justificados', value: justificados,        bg: 'var(--warn-bg)',    color: 'var(--warn)'    },
          { label: 'Retardos',     value: retardos,            bg: 'var(--sky-light)',  color: 'var(--sky)'     },
          { label: 'Total grupo',  value: groupStudents.length, bg: 'var(--gray-100)', color: 'var(--gray-600)' },
        ].map((s) => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 'var(--radius-lg)', padding: '16px 20px', border: '1px solid var(--gray-200)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: s.color, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', fontSize: 14, fontFamily: 'DM Sans,sans-serif' }}
            />
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', fontSize: 14, fontFamily: 'DM Sans,sans-serif' }}
            >
              {GRUPOS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <button className="btn btn-primary btn-sm" onClick={saveAttendance} disabled={saving}>
            {saving ? <><span className="spinner" />&nbsp;Guardando...</> : saved ? 'Guardado ✓' : 'Guardar asistencia'}
          </button>
        </div>

        {groupStudents.length === 0 ? (
          <div className="empty-state"><h3>Sin alumnos activos en este grupo</h3></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Alumno</th>
                <th>Matrícula</th>
                <th>DX</th>
                <th style={{ textAlign: 'center' }}>Asistencia</th>
              </tr>
            </thead>
            <tbody>
              {groupStudents.map((s) => (
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
                  <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>{s.dx || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      {['presente', 'ausente', 'justificado', 'retardo'].map((v) => (
                        <button key={v} style={statusStyle(v, attendance[s.id])} onClick={() => toggle(s.id, v)}>
                          {v.charAt(0).toUpperCase() + v.slice(1)}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
