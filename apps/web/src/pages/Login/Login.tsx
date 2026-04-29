import { useEffect, useState } from 'react';
import './Login.scss';
import { useNavigate } from "react-router-dom";
import { api } from '../../services/api';

type LoginResponse = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
};

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isFormValid) {
      setError('Email and password are required');
      return;
    }

    try {
      setIsLoading(true);

      const data: LoginResponse = await api(
        "/auth/login",
        {
          method: "POST",
          body: { email, password },
          auth: false,
        }
      );

      localStorage.setItem('accessToken', data.accessToken);
      navigate("/dashboard", { replace: true });
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page" data-testid="login-page">
      <div className="login-page__inner">
        <header className="login-header">
          <div className="login-header__logo" aria-hidden="true">◆</div>
          <h1 className="login-header__title">Workbench</h1>
          <p className="login-header__subtitle">Sign in to your workspace</p>
        </header>

        <section className="login-card" aria-label="Sign in form">
          <form onSubmit={handleSubmit} data-testid="login-form" noValidate>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                data-testid="email-input"
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus
                aria-invalid={!!error}
                aria-describedby={error ? "error-message" : undefined}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  data-testid="password-input"
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-invalid={!!error}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="input-wrapper__toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="error-message"
                data-testid="error-message"
                id="error-message"
                role="alert"
                aria-live="polite"
              >
                <span className="error-message__icon" aria-hidden="true">!</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="submit-btn"
              disabled={!isFormValid || isLoading}
              data-testid="login-button"
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="submit-btn__spinner" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </section>

        <footer className="login-footer">
          <p data-testid="help-text">
            © 2026 Aiswarya. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};