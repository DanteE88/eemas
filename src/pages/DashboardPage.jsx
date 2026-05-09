import { GRUPOS } from '../constants';
import { DEMO_MODE } from '../config';
import Icon from '../components/Icon';

export default function DashboardPage({ students }) {
  const activos = students.filter((s) => s.status === 'Activo').length;
  const grupos = [...new Set(students.map((s) => s.grupo).filter(Boolean))].length;

  return (
    <div>
      <div className="stats-grid">
        {[
          { label: 'Total Alumnos', value: students.length, icon: 'students', sub: 'En el sistema', color: '#e8f2fc' },
          { label: 'Alumnos Activos', value: activos, icon: 'check', sub: `${students.length - activos} con otro status`, color: '#e6f5ee' },
          { label: 'Grupos', value: grupos, icon: 'info', sub: 'Grupos registrados', color: '#fef6e4' },
          { label: 'Con DX', value: students.filter((s) => s.dx).length, icon: 'folder', sub: 'Con diagnóstico', color: '#f1e8fc' },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={s.icon} size={20} color="var(--sky)" />
            </div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span style={{ fontWeight: 600, color: 'var(--navy)' }}>Distribución por Grupo</span>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 10 }}>
            {GRUPOS.map((g) => {
              const count = students.filter((s) => s.grupo === g).length;
              return (
                <div key={g} style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius)', padding: '14px 16px', border: '1px solid var(--gray-200)' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)' }}>{count}</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>{g}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {DEMO_MODE && (
        <div style={{ marginTop: 20, padding: '16px 20px', background: '#fef6e4', border: '1px solid #fde68a', borderRadius: 'var(--radius)', fontSize: 13, color: '#92400e' }}>
          <strong>Modo Demo</strong> — Para conectar tu base de datos real, edita <code style={{ background: 'rgba(0,0,0,.08)', padding: '1px 5px', borderRadius: 4 }}>SUPABASE_URL</code> y <code style={{ background: 'rgba(0,0,0,.08)', padding: '1px 5px', borderRadius: 4 }}>SUPABASE_KEY</code> en <code>src/config.js</code>. Los datos aquí son de ejemplo.
        </div>
      )}
    </div>
  );
}
