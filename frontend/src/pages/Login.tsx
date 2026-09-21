import React, { useState } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setTokens } = useAuth();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    try {
      const response = await apiClient.post('token/', { username, password });
      setTokens(response.data.access, response.data.refresh);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-12">
      <form onSubmit={handleSubmit} className="form-card max-w-sm">
        <h1 className="form-title">Log In</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="field-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="field-input"
        />
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn-primary">
          Log In
        </button>
      </form>
    </div>
  ); 
}