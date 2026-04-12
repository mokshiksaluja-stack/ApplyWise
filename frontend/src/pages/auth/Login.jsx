import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../../services/authService';

const ROLE_REDIRECT = {
  student: '/student/dashboard',
  admin: '/admin/dashboard',
  coordinator: '/coordinator/dashboard',
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { success, user, token } = await loginUser({ email, password });

      if (success && user) {
        // Persist session data consistently
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('user', JSON.stringify(user));
        // Store studentId for student portal pages (Student doc _id != User doc _id)
        if (user.role === 'student' && user.studentId) {
          localStorage.setItem('studentId', user.studentId);
        } else {
          localStorage.removeItem('studentId'); // ensure no stale studentId for admins/coordinators
        }

        // Clean RBAC redirect
        const destination = ROLE_REDIRECT[user.role] || '/student/dashboard';
        navigate(destination, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-200 opacity-30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-indigo-200 opacity-30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-white/70 bg-white/80 p-9 shadow-2xl shadow-blue-900/10 backdrop-blur-sm">

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
              <LogIn size={30} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">PlaceSync</h1>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              Placement Management Platform
            </p>
            <p className="mt-1 text-xs text-gray-400">Sign in to your portal</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="e.g. student@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
                />
                <span className="font-medium text-gray-600">Remember me</span>
              </label>
              <a href="#" className="font-semibold text-blue-600 hover:text-blue-700 transition">
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              id="login-btn"
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/25 transition hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-600/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Dev hint box */}
          {import.meta.env.DEV && (
            <div className="mt-7 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 px-5 py-4">
              <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-indigo-400">
                Dev Mode — Quick Access
              </p>
              <div className="space-y-1.5">
                {[
                  { label: 'Student Portal', email: 'student@example.com' },
                  { label: 'Admin Portal', email: 'admin@example.com' },
                  { label: 'Coordinator Portal', email: 'coordinator@example.com' },
                ].map(({ label, email: quickEmail }) => (
                  <button
                    key={quickEmail}
                    type="button"
                    onClick={() => { setEmail(quickEmail); setPassword('password123'); }}
                    className="w-full text-left rounded-lg px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition flex justify-between items-center group"
                  >
                    <span>{label}</span>
                    <span className="text-indigo-400 group-hover:text-indigo-600 font-mono text-[10px]">{quickEmail}</span>
                  </button>
                ))}
                <p className="mt-1 text-[10px] text-indigo-400 font-semibold text-center">password: password123</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-7 text-center text-sm font-medium text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-700 transition">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
