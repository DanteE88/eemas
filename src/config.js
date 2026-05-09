import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY ?? '';

export const SCHOOL_NAME = 'EEmás';
export const SCHOOL_FULL = 'Educación Especial Más';
export const SCHOOL_CITY = 'Ciudad de México';

export const DEMO_MODE = !SUPABASE_URL || SUPABASE_URL.includes('your-project');

export const supabase = !DEMO_MODE
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

export const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD ?? 'demo1234';
