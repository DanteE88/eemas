import { useState, useRef } from 'react';
import { GRUPOS, FACTORES, STATUS_OPTS, DX_OPTS, EMPTY_FORM } from '../constants';
import { generateMatricula } from '../utils/helpers';

export default function StudentForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState(() =>
    initial ? { ...EMPTY_FORM, ...initial } : { ...EMPTY_FORM, matricula: generateMatricula() }
  );
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(initial?.foto_url || null);
  const fileRef = useRef();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form, photoFile);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-body">
        <div className="form-group full" style={{ marginBottom: 20 }}>
          <label>Foto del Alumno</label>
          <div
            className="photo-upload"
            onClick={() => fileRef.current.click()}
            style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'flex-start', padding: '16px 20px' }}
          >
            {photoPreview ? (
              <img src={photoPreview} alt="foto" className="photo-preview" style={{ margin: 0, width: 70, height: 70 }} />
            ) : (
              <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'var(--sky-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--sky)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            )}
            <div>
              <p style={{ fontWeight: 500, fontSize: 14, color: 'var(--sky)' }}>Subir foto</p>
              <p style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>JPG, PNG · Máx. 2MB</p>
            </div>
          </div>
          <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }} onChange={handlePhoto} />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Matrícula <span className="required">*</span></label>
            <input type="text" value={form.matricula} onChange={(e) => set('matricula', e.target.value)} required style={{ fontFamily: 'DM Mono,monospace' }} />
          </div>
          <div className="form-group">
            <label>Fecha de Nacimiento <span className="required">*</span></label>
            <input type="date" value={form.fecha_nacimiento} onChange={(e) => set('fecha_nacimiento', e.target.value)} required />
          </div>
          <div className="form-group full">
            <label>Nombre Completo <span className="required">*</span></label>
            <input type="text" value={form.nombre_completo} onChange={(e) => set('nombre_completo', e.target.value)} required placeholder="Apellido Apellido, Nombre(s)" />
          </div>
          <div className="form-group full">
            <label>Diagnóstico (DX)</label>
            <select value={form.dx} onChange={(e) => set('dx', e.target.value)}>
              <option value="">Seleccionar diagnóstico...</option>
              {DX_OPTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)}>
              {STATUS_OPTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Grupo</label>
            <select value={form.grupo} onChange={(e) => set('grupo', e.target.value)}>
              {GRUPOS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div className="divider" />
        <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--gray-400)', marginBottom: 14 }}>Información Médica</p>
        <div className="form-grid">
          <div className="form-group">
            <label>Factor RH</label>
            <select value={form.factor_rh} onChange={(e) => set('factor_rh', e.target.value)}>
              {FACTORES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Alergias</label>
            <input type="text" value={form.alergias} onChange={(e) => set('alergias', e.target.value)} placeholder="Ninguna" />
          </div>
          <div className="form-group full">
            <label>Redes de Apoyo / Terapias</label>
            <input type="text" value={form.redes_auto} onChange={(e) => set('redes_auto', e.target.value)} placeholder="Fonoaudiología, Terapia ocupacional..." />
          </div>
        </div>

        <div className="divider" />
        <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--gray-400)', marginBottom: 14 }}>Familia y Contacto</p>
        <div className="form-grid">
          <div className="form-group">
            <label>Nombre de la Madre</label>
            <input type="text" value={form.nombre_madre} onChange={(e) => set('nombre_madre', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Nombre del Padre</label>
            <input type="text" value={form.nombre_padre} onChange={(e) => set('nombre_padre', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Teléfono Principal <span className="required">*</span></label>
            <input type="tel" value={form.telefono_principal} onChange={(e) => set('telefono_principal', e.target.value)} required placeholder="664 000 0000" />
          </div>
          <div className="form-group">
            <label>Teléfono Secundario</label>
            <input type="tel" value={form.telefono_secundario} onChange={(e) => set('telefono_secundario', e.target.value)} placeholder="Opcional" />
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <><span className="spinner" />&nbsp;Guardando...</> : <>{initial ? 'Actualizar' : 'Agregar'} Alumno</>}
        </button>
      </div>
    </form>
  );
}
