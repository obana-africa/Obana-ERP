import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';
import logo from '/src/assets/images/logo/obana-logo.svg';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    if (!form.email) {
      setErrors(prev => [...prev, 'Email is required.']);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)){
      setErrors(prev => [...prev, 'Invalid email format. ']);
      return;
    }
    if (!form.password){
      setErrors(prev => [...prev, 'Password is rrequired. ']);
      return;
    }
    setLoading(true);
    try {
      // TODO: replace with authService.login(form) when backend is ready
      await new Promise((r) => setTimeout(r, 1000));
      navigate('/dashboard');
    } catch (err) {
      setErrors('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <div className={styles.brand}>
          <div className={styles.brandLogo}><img src={logo} alt="Obana Logo" /></div>
          {/* <span className={styles.brandName}>obana</span> */}
        </div>
        <div className={styles.leftBody}>
          <h1 className={styles.leftHeading}>Sell smarter,<br />grow faster.</h1>
          <p className={styles.leftSub}>
            Your all-in-one point of sale system built for Nigerian businesses.
          </p>
          <ul className={styles.featureList}>
            {[
              'Fast checkout & payment processing',
              'Real-time inventory tracking',
              'Order history & sales reports',
              'Integrates with your existing system',
            ].map((f) => (
              <li key={f} className={styles.featureItem}>
                <span className={styles.check} />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <p className={styles.leftFooter}>© 2026. All rights reserved.</p>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>Welcome back</h2>
          <p className={styles.formSub}>Sign in to your store account</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor='user_email' className={styles.label}>Email address</label>
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor='user_password' className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <p className={styles.forgot}>Forgot password?</p>

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>or</span>
          <span className={styles.dividerLine} />
        </div>

        <p className={styles.registerRow}>
          Don't have an account?{' '}
          <span className={styles.registerLink} onClick={() => navigate('/register')}>
            Create one
          </span>
        </p>

        <p className={styles.powered}>Powered</p>
      </div>
    </div>
  );
};

export default Login;