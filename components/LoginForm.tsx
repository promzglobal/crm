import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (email: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      onLogin(email);
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-8 bg-secondary-accent/20">
      <div className="w-full max-w-sm bg-white p-8 rounded-card shadow-card-default">
        <h2 className="text-2xl font-bold text-text-primary text-center mb-2">Connect Your Inbox</h2>
        <p className="text-text-secondary text-center mb-6">Sign in to view your emails within ProjectFlow Pro.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full bg-background-start border border-secondary-accent/50 rounded-button py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-accent"
              required
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" aria-label="Password (for demonstration only)" className="block text-sm font-medium text-text-secondary mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full bg-background-start border border-secondary-accent/50 rounded-button py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-accent"
              required
              placeholder="••••••••"
            />
          </div>
          <p className="text-xs text-text-secondary text-center pt-2">
            Note: This is a simulated login for demonstration purposes. Any email/password will work.
          </p>
          <button
            type="submit"
            className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-primary-accent rounded-button hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
