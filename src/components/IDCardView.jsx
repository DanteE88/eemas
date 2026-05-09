import { SCHOOL_NAME, SCHOOL_FULL } from '../config';
import { initials, fmtDate } from '../utils/helpers';
import logoUrl from '../assets/logo.js';

export default function IDCardView({ student }) {
  return (
    <div className="id-card-preview" id="id-card-export">
      {/* Header strip */}
      <div className="id-header">
        {logoUrl
          ? <img src={logoUrl} alt="logo" className="id-logo-img" />
          : <div className="id-logo-placeholder">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
        }
        <div>
          <div className="id-school-name">{SCHOOL_NAME}</div>
          <div className="id-school-full">{SCHOOL_FULL}</div>
        </div>
      </div>

      {/* Body */}
      <div className="id-body">
        {student.foto_url
          ? <img src={student.foto_url} alt="foto" className="id-photo" />
          : <div className="id-photo">{initials(student.nombre_completo)}</div>
        }
        <div className="id-info">
          <div className="id-name">{student.nombre_completo}</div>
          <div className="id-grupo">Grupo: {student.grupo || '—'}</div>
          <div className="id-fields">
            <div className="id-field">DX: <span>{student.dx || 'No especificado'}</span></div>
            <div className="id-field">Nac: <span>{fmtDate(student.fecha_nacimiento)}</span></div>
            <div className="id-field">RH: <span>{student.factor_rh || '—'}</span></div>
            <div className="id-field">Tel: <span>{student.telefono_principal}</span></div>
          </div>
        </div>
      </div>

      <div className="id-matricula">{student.matricula}</div>
      <div className="id-bar" />
    </div>
  );
}
