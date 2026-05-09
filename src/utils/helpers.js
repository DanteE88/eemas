export const calcEdad = (fecha) => {
  if (!fecha) return '—';
  const hoy = new Date(), nac = new Date(fecha);
  let edad = hoy.getFullYear() - nac.getFullYear();
  if (hoy < new Date(hoy.getFullYear(), nac.getMonth(), nac.getDate())) edad--;
  return `${edad} años`;
};

export const initials = (name) =>
  name ? name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() : '?';

export const fmtDate = (d) =>
  d
    ? new Date(d + 'T00:00:00').toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '—';

export const generateMatricula = () => {
  const yr = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 900) + 100).padStart(3, '0');
  return `CREE-${yr}-${num}`;
};
