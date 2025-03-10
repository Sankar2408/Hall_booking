import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Building2 } from 'lucide-react';

const LoginForm = () => {
  const navigate = useNavigate();
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [staffId, setStaffId] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('token', data.token);
      setStaffId(data.staffId);

      if (data.isFirstLogin) {
        setIsResetPassword(true);
      } else {
        // Navigate to StaffView instead of departments
        navigate('/staffview');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized request');

      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          staffId, 
          newPassword: formData.newPassword,
          isFirstLogin: false // Set this to false to update the database
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Password reset failed');

      // Update the local token if a new one is returned
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      navigate('/staffview'); // Navigate to StaffView after password reset
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="bg-white/90 p-8 rounded-lg shadow-xl w-full max-w-md">
      <div className="flex justify-center mb-8">
        <Building2 className="h-12 w-12 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-center mb-8">
        {isResetPassword ? 'Reset Password' : 'Staff Login'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={isResetPassword ? handlePasswordReset : handleLogin} className="space-y-6">
        {!isResetPassword ? (
          <>
            <InputField
              label="Email Address"
              type="email"
              name="email"
              icon={<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            <InputField
              label="Password"
              type="password"
              name="password"
              icon={<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </>
        ) : (
          <>
            <InputField
              label="New Password"
              type="password"
              name="newPassword"
              icon={<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />}
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
            />
            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              icon={<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
            />
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          {isResetPassword ? 'Reset Password' : 'Login'}
        </button>
      </form>
    </div>
  );
};

const InputField = ({ label, type, name, value, onChange, icon, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      {icon}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
        required
      />
    </div>
  </div>
);

export default LoginForm;