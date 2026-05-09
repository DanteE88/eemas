import { useState, useEffect } from 'react';
import { initials } from '../utils/helpers';
import IDCardView from '../components/IDCardView';
import Icon from '../components/Icon';

export default function IDGeneratorPage({ students, preselected }) {
  const [selected, setSelected] = useState(preselected || null);
  const [exporting, setExporting] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (preselected) setSelected(preselected);
  }, [preselected]);

  const filtered = students.filter(
    (s) => !search || s.nombre_completo.toLowerCase().includes(search.toLowerCase()) || s.matricula.toLowerCase().includes(search.toLowerCase())
  );

  const exportPDF = async () => {
    if (!selected) return;
    setExporting(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { jsPDF } = await import('jspdf');
      const card = document.getElementById('id-card-export');
      const canvas = await html2canvas(card, { scale: 3, useCORS: true, backgroundColor: null });
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 54] });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', 0, 0, 85.6, 54);
      pdf.save(`credencial-${selected.matricula}.pdf`);
    } catch {
      alert('Error al exportar. Intenta de nuevo.');
    }
    setExporting(false);
  };

  const printCard = () => {
    const card = document.getElementById('id-card-export');
    const w = window.open('', '_blank');
    w.document.write(`<html><head><style>*{margin:0;padding:0;box-sizing:border-box;} body{display:flex;justify-content:center;align-items:center;min-height:100vh;background:#fff;}</style></head><body>`);
    w.document.write(card.outerHTML);
    w.document.write(`</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); w.close(); }, 500);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
      <div className="card">
        <div className="card-header">
          <span style={{ fontWeight: 600, color: 'var(--navy)' }}>Seleccionar Alumno</span>
        </div>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--gray-100)' }}>
          <div className="search-bar">
            <span className="search-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <Icon name="search" size={15} color="var(--gray-400)" />
            </span>
            <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%' }} />
          </div>
        </div>
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {filtered.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelected(s)}
              style={{ padding: '12px 20px', cursor: 'pointer', borderBottom: '1px solid var(--gray-100)', background: selected?.id === s.id ? 'var(--sky-light)' : 'transparent', display: 'flex', alignItems: 'center', gap: 12, transition: 'background .15s' }}
            >
              {s.foto_url
                ? <img src={s.foto_url} className="avatar" alt="foto" />
                : <div className="avatar-initials">{initials(s.nombre_completo)}</div>
              }
              <div>
                <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--gray-800)' }}>{s.nombre_completo}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-400)', fontFamily: 'DM Mono,monospace' }}>{s.matricula}</div>
              </div>
              {selected?.id === s.id && (
                <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--sky)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header">
            <span style={{ fontWeight: 600, color: 'var(--navy)' }}>Vista Previa de Credencial</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            {selected ? (
              <>
                <IDCardView student={selected} />
                <p style={{ fontSize: 12, color: 'var(--gray-400)', textAlign: 'center' }}>Credencial formato CR80 (tarjeta estándar 85.6×54mm)</p>
                <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={exportPDF} disabled={exporting}>
                    {exporting ? <><span className="spinner" />&nbsp;Exportando...</> : 'Exportar PDF'}
                  </button>
                  <button className="btn btn-ghost" onClick={printCard}>Imprimir</button>
                </div>
              </>
            ) : (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                  </svg>
                </div>
                <h3>Selecciona un alumno</h3>
                <p>La credencial se generará automáticamente.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
