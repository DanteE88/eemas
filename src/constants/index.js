export const GRUPOS = [
  'Burbuja 1',
  'Burbuja 2',
  'Sensorial 1',
  'Sensorial 2',
  'Pre-lectores',
  'Academia',
  'Juvenil',
];

export const FACTORES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export const STATUS_OPTS = ['Activo', 'Baja', 'Egresado'];

export const DX_OPTS = [
  'TEA 1',
  'TEA 2',
  'TEA 3',
  'TDA-H',
  'TRISONOMIA 21',
  'LENGUAJE',
  'DISCP. INTELECTUAL',
  'MOTOR',
  'PARALISIS CEREBRAL',
  'POR DEFINIR',
  'SINDROME WEST',
  'TRAST. GEN. DESARRO.',
  'SIND. MC DERMIND',
  'ATRO. MUSC. ESPINAL',
  'QUISTE ARACNOIDEO',
  'DIXPRASIA',
];

export const EMPTY_FORM = {
  matricula: '',
  nombre_completo: '',
  dx: '',
  fecha_nacimiento: '',
  status: 'Activo',
  grupo: 'Burbuja 1',
  factor_rh: 'O+',
  alergias: '',
  redes_auto: '',
  nombre_madre: '',
  nombre_padre: '',
  telefono_principal: '',
  telefono_secundario: '',
  foto_url: '',
};

export const DEMO_STUDENTS = [
  { id: 'd1', matricula: 'CREE-2024-001', nombre_completo: 'Ana Lucía Ramírez Torres', dx: 'TEA - Leve', fecha_nacimiento: '2015-03-12', status: 'Activo', grupo: 'A-1', factor_rh: 'O+', alergias: 'Ninguna', redes_auto: 'Ninguna', nombre_madre: 'Lucía Torres Méndez', nombre_padre: 'Roberto Ramírez Vega', telefono_principal: '6641234567', telefono_secundario: '6649876543', created_at: new Date().toISOString(), foto_url: null },
  { id: 'd2', matricula: 'CREE-2024-002', nombre_completo: 'Carlos Emilio Vega Soto', dx: 'Discapacidad Intelectual', fecha_nacimiento: '2013-07-22', status: 'Activo', grupo: 'B-2', factor_rh: 'A+', alergias: 'Penicilina', redes_auto: 'Ninguna', nombre_madre: 'Sonia Soto Flores', nombre_padre: 'Emilio Vega Cruz', telefono_principal: '6645550123', telefono_secundario: '', created_at: new Date().toISOString(), foto_url: null },
  { id: 'd3', matricula: 'CREE-2024-003', nombre_completo: 'María Fernanda López Díaz', dx: 'Síndrome de Down', fecha_nacimiento: '2014-11-05', status: 'Activo', grupo: 'A-2', factor_rh: 'B+', alergias: 'Látex', redes_auto: 'Ninguna', nombre_madre: 'Fernanda Díaz Reyes', nombre_padre: 'Juan López Ortiz', telefono_principal: '6643210987', telefono_secundario: '6648765432', created_at: new Date().toISOString(), foto_url: null },
  { id: 'd4', matricula: 'CREE-2024-004', nombre_completo: 'Diego Sebastián Morales Peña', dx: 'TDAH', fecha_nacimiento: '2016-01-30', status: 'Baja temporal', grupo: 'C-1', factor_rh: 'AB-', alergias: 'Gluten', redes_auto: 'Ninguna', nombre_madre: 'Claudia Peña Torres', nombre_padre: 'Sebastián Morales Gil', telefono_principal: '6641112233', telefono_secundario: '', created_at: new Date().toISOString(), foto_url: null },
];
