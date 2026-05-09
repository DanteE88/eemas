import { useState } from 'react';
import { supabase, DEMO_MODE, SCHOOL_CITY } from '../config';
import { logoColor } from '../assets/logo.js';

const DEMO_PASSWORD = 'demo1234';

export default function LoginPage({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const triggerShake = (msg) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 600);
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (DEMO_MODE) {
      if (password === DEMO_PASSWORD) {
        onLogin({ email: 'demo@eemas.mx', id: 'demo' });
      } else {
        triggerShake('Contraseña incorrecta. Intenta de nuevo.');
      }
      setLoading(false);
      return;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: 'staff@eemas.mx',
      password,
    });

    if (authError || !data.session) {
      triggerShake(authError?.message || 'Contraseña incorrecta. Intenta de nuevo.');
    } else {
      onLogin(data.user);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={shake ? { animation: 'shake .5s ease' } : {}}>
        <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
        <div className="auth-logo">
          <img src={logoColor} alt="EEmás" style={{ width: 160, height: 'auto', objectFit: 'contain', marginBottom: 12 }} />
          <h1 style={{ fontSize: 22 }}>Bienvenido</h1>
          <p style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 4 }}>{SCHOOL_CITY}</p>
        </div>
        {error && <div className="auth-message error">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Contraseña de acceso</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              autoFocus
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? <><span className="spinner" />&nbsp;Verificando...</> : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
