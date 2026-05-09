import { useState, useEffect } from 'react';
import { db } from './services/db';
import Icon from './components/Icon';
import Modal from './components/Modal';
import ConfirmModal from './components/ConfirmModal';
import StudentForm from './components/StudentForm';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import ProfilePage from './pages/ProfilePage';
import IDGeneratorPage from './pages/IDGeneratorPage';
import AttendancePage from './pages/AttendancePage';
import SolicitantesPage from './pages/SolicitantesPage';
import IncidenciasPage from './pages/IncidenciasPage';
import { SCHOOL_NAME } from './config';
import { logoColor } from './assets/logo.js';

const NAV = [
  { key: 'dashboard',     icon: 'chart',      label: 'Dashboard'      },
  { key: 'students',      icon: 'students',   label: 'Alumnos'        },
  { key: 'id-generator',  icon: 'card',       label: 'Credenciales'   },
  { key: 'attendance',    icon: 'attendance', label: 'Asistencia'     },
  { key: 'solicitantes',  icon: 'folder',     label: 'Solicitantes'   },
  { key: 'incidencias',   icon: 'warn',       label: 'Incidencias'    },
];

const PAGE_TITLES = {
  dashboard:    'Dashboard',
  students:     'Gestión de Alumnos',
  'id-generator': 'Generador de Credenciales',
  attendance:   'Control de Asistencia',
  solicitantes: 'Solicitantes',
  incidencias:  'Incidencias',
};

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewStudent, setViewStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [idStudent, setIdStudent] = useState(null);
  const [alert, setAlert] = useState(null);

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3500);
  };

  useEffect(() => {
    if (sessionStorage.getItem('eemas_auth') === '1') {
      setUser({ email: 'staff@eemas.mx', id: 'staff' });
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    loadStudents();
  }, [user]);

  const loadStudents = async () => {
    setLoading(true);
    const { data, error } = await db.getStudents();
    if (!error) setStudents(data || []);
    setLoading(false);
  };

  const handleSave = async (form, photoFile) => {
    setFormLoading(true);
    let foto_url = form.foto_url || null;

    if (photoFile) {
      const { url, error } = await db.uploadPhoto(photoFile);
      if (!error && url) foto_url = url;
    }

    const payload = { ...form, foto_url };

    if (editStudent) {
      const { error } = await db.updateStudent(editStudent.id, payload);
      if (!error) {
        showAlert('Alumno actualizado correctamente');
        setStudents((ss) => ss.map((s) => s.id === editStudent.id ? { ...s, ...payload } : s));
        setEditStudent(null);
      } else {
        showAlert('Error al actualizar', 'error');
      }
    } else {
      const { data, error } = await db.addStudent(payload);
      if (!error && data) {
        showAlert('Alumno agregado correctamente');
        setStudents((ss) => [...ss, data]);
        setShowAdd(false);
      } else {
        showAlert('Error al agregar. Verifica que la matrícula no exista.', 'error');
      }
    }
    setFormLoading(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setFormLoading(true);
    const { error } = await db.deleteStudent(confirmDelete.id);
    if (!error) {
      showAlert('Alumno eliminado');
      setStudents((ss) => ss.filter((s) => s.id !== confirmDelete.id));
      setConfirmDelete(null);
    } else {
      showAlert('Error al eliminar', 'error');
    }
    setFormLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('eemas_auth');
    setUser(null);
  };

  if (!user) return <LoginPage onLogin={setUser} />;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div style={{ background: '#fff', borderRadius: 12, padding: '8px 10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
            <img src={logoColor} alt={SCHOOL_NAME} style={{ height: 52, width: 'auto', objectFit: 'contain', display: 'block' }} />
          </div>
          <p style={{ marginTop: 2 }}>Sistema Escolar</p>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((n) => (
            <button
              key={n.key}
              className={`nav-item ${page === n.key && !viewStudent ? 'active' : ''}`}
              onClick={() => { setPage(n.key); setViewStudent(null); }}
            >
              <span className="nav-icon"><Icon name={n.icon} size={17} /></span>
              {n.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-pill">
            <div className="user-avatar">{(user.email || 'U')[0].toUpperCase()}</div>
            <div className="user-info">
              <div className="user-name">{user.email}</div>
              <div className="user-role">Personal escolar</div>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
              <Icon name="logout" size={15} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <h2 className="page-title">{viewStudent ? viewStudent.nombre_completo : PAGE_TITLES[page]}</h2>
          {page === 'students' && !viewStudent && (
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Nuevo Alumno</button>
          )}
        </div>

        <div className="page-body">
          {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

          {loading ? (
            <div className="page-loader"><div className="spinner spin-dark" />Cargando datos...</div>
          ) : viewStudent ? (
            <ProfilePage
              student={viewStudent}
              onBack={() => setViewStudent(null)}
              onEdit={(s) => { setEditStudent(s); setPage('students'); setViewStudent(null); }}
              onGenerateID={(s) => { setIdStudent(s); setPage('id-generator'); setViewStudent(null); }}
            />
          ) : page === 'dashboard' ? (
            <DashboardPage students={students} />
          ) : page === 'students' ? (
            <StudentsPage students={students} onAdd={() => setShowAdd(true)} onEdit={setEditStudent} onDelete={setConfirmDelete} onView={setViewStudent} />
          ) : page === 'id-generator' ? (
            <IDGeneratorPage students={students} preselected={idStudent} />
          ) : page === 'attendance' ? (
            <AttendancePage students={students} />
          ) : page === 'solicitantes' ? (
            <SolicitantesPage />
          ) : page === 'incidencias' ? (
            <IncidenciasPage students={students} />
          ) : null}
        </div>
      </main>

      {showAdd && (
        <Modal title="Agregar Nuevo Alumno" onClose={() => setShowAdd(false)}>
          <StudentForm onSave={handleSave} onCancel={() => setShowAdd(false)} loading={formLoading} />
        </Modal>
      )}

      {editStudent && (
        <Modal title="Editar Alumno" onClose={() => setEditStudent(null)}>
          <StudentForm initial={editStudent} onSave={handleSave} onCancel={() => setEditStudent(null)} loading={formLoading} />
        </Modal>
      )}

      {confirmDelete && (
        <ConfirmModal
          message={`¿Eliminar a ${confirmDelete.nombre_completo}? Esta acción no se puede deshacer.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          loading={formLoading}
        />
      )}
    </div>
  );
}
