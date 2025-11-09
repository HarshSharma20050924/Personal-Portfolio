import React, { useState, useRef } from 'react';

interface LoginProps {
  onLogin: (apiKey: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.apiKey);
      } else {
        setError(data.message || 'Invalid username or password.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-slate-800 dark:text-slate-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-slate-800">
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          (Credentials are managed in the database)
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              ref={usernameRef}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              ref={passwordRef}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-colors disabled:bg-sky-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging In...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
