import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials } from '../types/auth';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const LoginPage: React.FC = () => {
     const [credentials, setCredentials] = useState<LoginCredentials>({
          email: '',
          password: '',
     });
     const [showPassword, setShowPassword] = useState(false);
     const [isLoading, setIsLoading] = useState(false);
     const [localError, setLocalError] = useState<string | null>(null);

     const { signIn, user, error, clearError } = useAuth();
     const navigate = useNavigate();
     const location = useLocation();

     // Get the intended destination or default to admin
     const from = (location.state as any)?.from || '/panel';

     // Redirect if already logged in
     useEffect(() => {
          if (user) {
               navigate(from, { replace: true });
          }
     }, [user, navigate, from]);

     // Clear errors when credentials change
     useEffect(() => {
          clearError();
          setLocalError(null);
     }, [credentials.email, credentials.password]);

     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target;
          setCredentials(prev => ({
               ...prev,
               [name]: value,
          }));
     };

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setLocalError(null);

          // Basic validation
          if (!credentials.email || !credentials.password) {
               setLocalError('Vui lòng điền đầy đủ thông tin');
               return;
          }

          if (!isValidEmail(credentials.email)) {
               setLocalError('Email không hợp lệ');
               return;
          }

          try {
               setIsLoading(true);
               await signIn(credentials);
               // Navigation will be handled by useEffect when user state changes
          } catch (error: any) {
               // Error is handled by AuthContext
               console.error('Login error:', error);
          } finally {
               setIsLoading(false);
          }
     };

     const isValidEmail = (email: string): boolean => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
     };

     const displayError = localError || error;

     return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
               <div className="max-w-md w-full space-y-8">
                    {/* Header */}
                    <div className="text-center">
                         <Link to="/" className="inline-block">
                              <h1 className="text-3xl font-bold text-primary mb-2">
                                   Gia Sư Hoàng Hà
                              </h1>
                         </Link>
                         <h2 className="text-xl font-semibold text-gray-900 mb-2">
                              Đăng nhập hệ thống
                         </h2>
                         <p className="text-gray-600">
                              Dành cho nhân viên và quản trị viên
                         </p>
                    </div>

                    {/* Login Form */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                         <form onSubmit={handleSubmit} className="space-y-6">
                              {/* Error Message */}
                              {displayError && (
                                   <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                        <div className="flex">
                                             <div className="flex-shrink-0">
                                                  <svg
                                                       className="h-5 w-5 text-red-400"
                                                       viewBox="0 0 20 20"
                                                       fill="currentColor"
                                                  >
                                                       <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                            clipRule="evenodd"
                                                       />
                                                  </svg>
                                             </div>
                                             <div className="ml-3">
                                                  <p className="text-sm text-red-800">{displayError}</p>
                                             </div>
                                        </div>
                                   </div>
                              )}

                              {/* Email Field */}
                              <div>
                                   <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                   </label>
                                   <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={credentials.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                                        placeholder="Nhập email của bạn"
                                        disabled={isLoading}
                                   />
                              </div>

                              {/* Password Field */}
                              <div>
                                   <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        Mật khẩu
                                   </label>
                                   <div className="relative">
                                        <input
                                             id="password"
                                             name="password"
                                             type={showPassword ? 'text' : 'password'}
                                             autoComplete="current-password"
                                             required
                                             value={credentials.password}
                                             onChange={handleInputChange}
                                             className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                                             placeholder="Nhập mật khẩu"
                                             disabled={isLoading}
                                        />
                                        <button
                                             type="button"
                                             className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                             onClick={() => setShowPassword(!showPassword)}
                                             disabled={isLoading}
                                        >
                                             {showPassword ? (
                                                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                             ) : (
                                                  <EyeIcon className="h-5 w-5 text-gray-400" />
                                             )}
                                        </button>
                                   </div>
                              </div>

                              {/* Submit Button */}
                              <div>
                                   <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                   >
                                        {isLoading ? (
                                             <div className="flex items-center">
                                                  <svg
                                                       className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                       xmlns="http://www.w3.org/2000/svg"
                                                       fill="none"
                                                       viewBox="0 0 24 24"
                                                  >
                                                       <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                       ></circle>
                                                       <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                       ></path>
                                                  </svg>
                                                  Đang đăng nhập...
                                             </div>
                                        ) : (
                                             'Đăng nhập'
                                        )}
                                   </button>
                              </div>

                              {/* Forgot Password Link */}
                              <div className="text-center">
                                   <Link
                                        to="/forgot-password"
                                        className="text-sm text-primary hover:text-blue-700"
                                   >
                                        Quên mật khẩu?
                                   </Link>
                              </div>
                         </form>
                    </div>

                    {/* Back to Home */}
                    <div className="text-center">
                         <Link
                              to="/"
                              className="text-sm text-gray-600 hover:text-gray-900"
                         >
                              ← Quay về trang chủ
                         </Link>
                    </div>

                    {/* Demo Credentials (for development) */}
                    {import.meta.env.DEV && (
                         <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                                   Demo Credentials (Development Only)
                              </h3>
                              <div className="text-xs text-yellow-700 space-y-1">
                                   <p><strong>Admin:</strong> admin@giasuhoangha.com / admin123</p>
                                   <p><strong>Staff:</strong> staff@giasuhoangha.com / staff123</p>
                              </div>
                         </div>
                    )}
               </div>
          </div>
     );
};

export default LoginPage; 