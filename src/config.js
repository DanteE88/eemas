import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY ?? '';

export const SCHOOL_NAME = 'EEmás';
export const SCHOOL_FULL = 'Educación Especial MAS+';
export const SCHOOL_CITY = 'Ciudad de México';
export const SCHOOL_PHONE = '55 3699 8659';

export const DEMO_MODE = !SUPABASE_URL || SUPABASE_URL.includes('your-project');

export const supabase = !DEMO_MODE
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

export const STAFF_EMAIL = 'staff@eemas.mx';
