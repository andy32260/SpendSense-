import React, { useState } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Wordmark } from '../components/AppShell';
import Icon from '../components/Icon';

const points = [
    'See what\'s left to spend this month, at a glance',
    'Get a heads-up before a budget runs out',
    'Work out how soon you can reach a savings goal',
];

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { setTokens } = useAuth();

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const response = await apiClient.post('token/', { username, password });
            setTokens(response.data.access, response.data.refresh);
            navigate('/dashboard');
        } catch {
            setError("That username and password don't match. Check for typos and try again.");
            setSubmitting(false);
        }
    }

    return (
        <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
            <section className="flex flex-col gap-10 bg-spine px-6 py-10 text-spine-text sm:px-10 lg:justify-between lg:px-14 lg:py-14">
                <Wordmark />
                <div className="flex flex-col gap-6">
                    <h1 className="max-w-md text-4xl leading-tight tracking-tight text-white sm:text-5xl">
                        Know where your money goes, <span className="text-butter">without the spreadsheet.</span>
                    </h1>
                    <ul className="flex flex-col gap-3">
                        {points.map((p) => (
                            <li key={p} className="flex items-start gap-3">
                                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-butter text-butter-ink">
                                    <Icon name="check" className="size-3.5" />
                                </span>
                                {p}
                            </li>
                        ))}
                    </ul>
                </div>
                <p className="hidden text-sm text-spine-text/60 lg:block">Made for students managing money on their own for the first time.</p>
            </section>

            <section className="flex items-center justify-center px-6 py-12 sm:px-10">
                <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl tracking-tight">Welcome back</h2>
                        <p className="text-ink-soft">Log in to see how your month is going.</p>
                    </div>
                    <label className="field-label" htmlFor="login-username">
                        Username
                        <input id="login-username" type="text" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} className="field" />
                    </label>
                    <label className="field-label" htmlFor="login-password">
                        Password
                        <input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="field" />
                    </label>
                    {error && <p className="form-error" role="alert">{error}</p>}
                    <button type="submit" className="btn-primary w-full" disabled={submitting}>
                        {submitting ? 'Logging in…' : 'Log in'}
                    </button>
                </form>
            </section>
        </div>
    );
}
