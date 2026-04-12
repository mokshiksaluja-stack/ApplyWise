import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupAPI } from '../services/api';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { data } = await signupAPI({ email, password, role });
      localStorage.setItem('token', data.token);
      
      if (data.user && data.user.id) {
          localStorage.setItem('studentId', data.user.id);
      }
      
      localStorage.setItem('userRole', role);
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'coordinator') navigate('/coordinator/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md border border-gray-100">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-blue-900">Placement Portal</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Create a new account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input name="email" type="email" required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <input name="password" type="password" required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div>
              <select name="role" value={role} onChange={e => setRole(e.target.value)} className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm">
                 <option value="student">Student</option>
                 <option value="coordinator">Placement Coordinator</option>
                 <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div>
            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Sign up
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">Already have an account? Sign in</Link>
        </div>
      </div>
    </div>
  );
}
