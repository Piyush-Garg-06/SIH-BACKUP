import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { LogIn, Smartphone, Shield, Heart, Users, ShieldCheck, Eye, EyeOff, Stethoscope, Building2, UserCheck, Star, Award, Building } from 'lucide-react';
import api from '../utils/api.js';

const Login = () => {
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    userType: 'worker',
    emailOrId: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // Background images for the hero section
  const backgroundImages = [
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  ];

  // Animation on component mount
  useEffect(() => {
    setIsVisible(true);

    // Auto-change background images
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 4000);

    return () => clearInterval(imageInterval);
  }, [backgroundImages.length]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting login with:', { 
        userType: formData.userType, 
        emailOrId: formData.emailOrId 
      });
      
      const res = await api.post('/auth/login', formData);
      console.log('Login API response:', res);
      
      if (res.token && res.user) {
        await authLogin(res);
        
        // Navigate to appropriate dashboard
        const dashboardPath = res.user.role === 'doctor' ? '/dashboard' : 
                             res.user.role === 'employer' ? '/dashboard' : 
                             res.user.role === 'admin' ? '/dashboard' : 
                             res.user.role === 'emitra' ? '/emitra/dashboard' : '/dashboard';
        navigate(dashboardPath);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login failed:', error);
      
      let errorMessage = 'Login failed. Please check your credentials and try again.';
      
      if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg;
      } else if (error.data?.msg) {
        errorMessage = error.data.msg;
      } else if (error.message && error.message !== 'Network Error') {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getUserIcon = () => {
    switch (formData.userType) {
      case 'doctor': return <Stethoscope className="w-5 h-5" />;
      case 'employer': return <Building2 className="w-5 h-5" />;
      case 'admin': return <UserCheck className="w-5 h-5" />;
      case 'emitra': return <Building className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-100/20 to-purple-100/20 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-8xl mx-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">

          {/* Left Side - Hero Section with Changing Images */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-6 p-4">
            <div className="relative w-full max-w-xl h-96 rounded-3xl overflow-hidden shadow-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform scale-105"
                style={{
                  backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

              {/* Image indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {backgroundImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'bg-white shadow-lg scale-125'
                        : 'bg-white/60 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>

              {/* Floating cards */}
              <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg animate-fade-in">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium text-gray-800">Health First</span>
                </div>
              </div>

              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg animate-fade-in delay-500">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-800">Secure</span>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg animate-fade-in delay-1000">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-800">Govt. Approved</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="text-center space-y-4 animate-slide-in">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Digital Health Portal
              </h2>
              <p className="text-gray-600 text-lg">Your health records, simplified and secure</p>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-800">10K+ Users</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-800">50+ Centers</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-800">5 Star Rated</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center lg:justify-start">
            <div className={`w-full max-w-lg space-y-6 bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>

              {/* Header with gradient text */}
              <div className="text-center">
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-fade-in">
                  Welcome Back
                </h2>
                <p className="mt-2 text-sm text-gray-600 transition-colors duration-300">
                  Sign in to your account
                </p>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* User Type Selection with Animation */}
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-300">
                      I am a
                    </label>
                    <div className="relative">
                      <select
                        id="userType"
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        className="appearance-none block w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white hover:border-blue-400 transition-all duration-300 hover:shadow-md"
                      >
                        <option value="worker">Migrant Worker</option>
                        <option value="doctor">Doctor/Healthcare Provider</option>
                        <option value="employer">Employer/Manager</option>
                        <option value="admin">Administrator</option>
                        <option value="emitra">eMitra Operator</option>
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className="text-blue-600">
                          {getUserIcon()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email/ID Input with Animation */}
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <label htmlFor="emailOrId" className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-300">
                      {formData.userType === 'emitra' ? 'Email or Operator ID' : 'Email or Health ID'}
                    </label>
                    <input
                      id="emailOrId"
                      name="emailOrId"
                      type="text"
                      required
                      value={formData.emailOrId}
                      onChange={handleChange}
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white hover:border-blue-400 transition-all duration-300 hover:shadow-md focus:scale-105"
                      placeholder={formData.userType === 'emitra' ? 'Enter your email or operator ID' : 'Enter your email or health ID'}
                    />
                  </div>

                  {/* Password Input with Animation */}
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-300">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="appearance-none block w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white hover:border-blue-400 transition-all duration-300 hover:shadow-md focus:scale-105"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600 transition-colors duration-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remember Me and Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-300 hover:scale-110"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900 transition-colors duration-300">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      to="/forgot-password"
                      className="font-medium text-blue-600 hover:text-blue-500 transition-all duration-300 hover:scale-105 inline-block"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {/* Submit Button with Enhanced Animation */}
                <div className="transform transition-all duration-300 hover:scale-105">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <LogIn className="h-4 w-4 text-blue-200 group-hover:text-blue-100 transition-colors duration-300" />
                    </span>
                    <span className="flex items-center">
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing in...
                        </>
                      ) : (
                        'Sign in'
                      )}
                    </span>
                  </button>
                </div>
              </form>

              {/* Divider with Animation */}
              <div className="mt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Alternative Login Options with Enhanced Animations */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button className="w-full inline-flex justify-center py-2 px-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md">
                    <Smartphone className="h-4 w-4" />
                    <span className="ml-2">OTP</span>
                  </button>
                  <button className="w-full inline-flex justify-center py-2 px-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md">
                    <Shield className="h-4 w-4" />
                    <span className="ml-2">Aadhaar</span>
                  </button>
                </div>
              </div>

              {/* Additional Info with Animation */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 transition-colors duration-300">
                  Secure login powered by Kerala Government
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;