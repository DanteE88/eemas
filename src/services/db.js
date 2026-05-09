import { supabase, DEMO_MODE } from '../config';
import { DEMO_STUDENTS } from '../constants';

let demoStudents = [...DEMO_STUDENTS];
let demoSolicitantes = [];
let demoIncidencias = [];

export const db = {
  // ── Estudiantes ────────────────────────────────────────────────────────────
  async getStudents() {
    if (DEMO_MODE) return { data: demoStudents, error: null };
    return await supabase.from('estudiantes').select('*').order('nombre_completo');
  },

  async addStudent(student) {
    if (DEMO_MODE) {
      const s = { ...student, id: 'd' + Date.now(), created_at: new Date().toISOString() };
      demoStudents = [...demoStudents, s];
      return { data: s, error: null };
    }
    return await supabase.from('estudiantes').insert([student]).select().single();
  },

  async updateStudent(id, updates) {
    if (DEMO_MODE) {
      demoStudents = demoStudents.map((s) => (s.id === id ? { ...s, ...updates } : s));
      return { data: { ...updates, id }, error: null };
    }
    return await supabase.from('estudiantes').update(updates).eq('id', id).select().single();
  },

  async deleteStudent(id) {
    if (DEMO_MODE) {
      demoStudents = demoStudents.filter((s) => s.id !== id);
      return { error: null };
    }
    return await supabase.from('estudiantes').delete().eq('id', id);
  },

  // ── Solicitantes ───────────────────────────────────────────────────────────
  async getSolicitantes() {
    if (DEMO_MODE) return { data: demoSolicitantes, error: null };
    return await supabase.from('solicitantes').select('*').order('created_at', { ascending: false });
  },

  async addSolicitante(record) {
    if (DEMO_MODE) {
      const s = { ...record, id: 's' + Date.now(), created_at: new Date().toISOString() };
      demoSolicitantes = [s, ...demoSolicitantes];
      return { data: s, error: null };
    }
    return await supabase.from('solicitantes').insert([record]).select().single();
  },

  async updateSolicitante(id, updates) {
    if (DEMO_MODE) {
      demoSolicitantes = demoSolicitantes.map((s) => (s.id === id ? { ...s, ...updates } : s));
      return { data: { ...updates, id }, error: null };
    }
    return await supabase.from('solicitantes').update(updates).eq('id', id).select().single();
  },

  async deleteSolicitante(id) {
    if (DEMO_MODE) {
      demoSolicitantes = demoSolicitantes.filter((s) => s.id !== id);
      return { error: null };
    }
    return await supabase.from('solicitantes').delete().eq('id', id);
  },

  // ── Incidencias ────────────────────────────────────────────────────────────
  async getIncidencias() {
    if (DEMO_MODE) return { data: demoIncidencias, error: null };
    return await supabase.from('incidencias').select('*').order('fecha', { ascending: false });
  },

  async addIncidencia(record) {
    if (DEMO_MODE) {
      const i = { ...record, id: 'i' + Date.now(), created_at: new Date().toISOString() };
      demoIncidencias = [i, ...demoIncidencias];
      return { data: i, error: null };
    }
    return await supabase.from('incidencias').insert([record]).select().single();
  },

  async deleteIncidencia(id) {
    if (DEMO_MODE) {
      demoIncidencias = demoIncidencias.filter((i) => i.id !== id);
      return { error: null };
    }
    return await supabase.from('incidencias').delete().eq('id', id);
  },

  // ── Photo upload ───────────────────────────────────────────────────────────
  async uploadPhoto(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX = 400;
          let w = img.width, h = img.height;
          if (w > h) { if (w > MAX) { h = (h * MAX) / w; w = MAX; } }
          else { if (h > MAX) { w = (w * MAX) / h; h = MAX; } }
          canvas.width = w;
          canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve({ url: canvas.toDataURL('image/jpeg', 0.75), error: null });
        };
        img.src = e.target.result;
      };
      reader.onerror = () => resolve({ url: null, error: 'Error leyendo archivo' });
      reader.readAsDataURL(file);
    });
  },
};
