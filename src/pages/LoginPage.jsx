import { useState } from 'react';
import { APP_PASSWORD, SCHOOL_CITY } from '../config';
import { logoColor } from '../assets/logo.js';

export default function LoginPage({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === APP_PASSWORD) {
      sessionStorage.setItem('eemas_auth', '1');
      onLogin({ email: 'staff@eemas.mx', id: 'staff' });
    } else {
      setError('Contraseña incorrecta. Intenta de nuevo.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setPassword('');
    }
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
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
