import React, { useState } from 'react';
import { Shield, Mail, Lock, User, Activity, Loader2 } from 'lucide-react';
import { loginUser, registerUser } from '../api/auth';
import './auth.css';

interface AuthScreenProps {
  onLoginSuccess: (userData: { name: string; username: string }) => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await loginUser(username, password);
        const actualName = res.user?.name || username;
        onLoginSuccess({ name: actualName, username });
      } else {
        await registerUser(name, username, email, password);
        // Automatically log them in after successful registration to fetch a real JWT
        const res = await loginUser(username, password);
        const actualName = res.user?.name || name;
        onLoginSuccess({ name: actualName, username });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrorMsg('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Shield size={32} fill="#FFFFFF" stroke="#FFFFFF" />
          </div>
          <h1 className="auth-title">SafeHer</h1>
          <p className="auth-subtitle">
            {isLogin ? 'Welcome back to your safe space.' : 'Join the secure community.'}
          </p>
        </div>

        {errorMsg && (
          <div className="auth-error-msg">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <div className="auth-input-group">
                <User size={18} className="auth-input-icon" />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="auth-input"
                />
              </div>
              <div className="auth-input-group">
                <Mail size={18} className="auth-input-icon" />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                />
              </div>
            </>
          )}

          <div className="auth-input-group">
            <Activity size={18} className="auth-input-icon" />
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="auth-input"
            />
          </div>

          <div className="auth-input-group">
            <Lock size={18} className="auth-input-icon" />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? <Loader2 className="spinner" size={20} /> : (isLogin ? 'Secure Login' : 'Create Account')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button type="button" onClick={toggleMode} className="auth-toggle-btn">
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
