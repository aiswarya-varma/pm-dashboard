import { useEffect, useState } from 'react';
import './Login.scss';
import { useNavigate } from "react-router-dom";
import { api } from '../../services/api';

type LoginResponse = { 
  accessToken: string; 
  user: { 
    id: string; 
    email: string; 
    role: string 
  } 
}

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const navigate = useNavigate();

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
          auth: false 
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
      <header className="login-header">
        <h1>Project Manager</h1>
        <p>Sign in to continue</p>
      </header>

      <section className="login-card">
        <form onSubmit={handleSubmit} data-testid="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              data-testid="email-input"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              data-testid="password-input"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>

          {error && (
            <div className="error-message" data-testid="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            data-testid="login-button"
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </section>

      <footer className="login-footer">
        <p data-testid="help-text">
          Copyright © 2026 Aiswarya. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}