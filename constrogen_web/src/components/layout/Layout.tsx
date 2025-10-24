import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequest } from '../../../shared/redux/slices/authSlice';
import { RootState } from '../../store';
import { COLORS } from '../../../shared/constants/theme';

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutRequest());
    navigate('/login');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Purchase',
      path: '/purchase',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      name: 'Approvals',
      path: '/approvals',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.gray50 }}>
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b fixed w-full top-0 z-40" style={{ borderColor: COLORS.border }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and App Name */}
            <div className="flex items-center">
              <button
                className="lg:hidden mr-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: COLORS.primaryText }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
                <img src="/logo2.png" alt="Logo" sizes='150x100' className="w-15 h-10 mr-3" />
                <div>
                  <h1 className="text-xl font-bold leading-tight" style={{ color: COLORS.primaryColor }}>
                    Constrogen
                  </h1>
                  <p className="text-xs leading-tight" style={{ color: COLORS.secondaryText }}>
                    Purchase Management
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-2">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isActive(item.path)
                      ? 'shadow-sm'
                      : 'hover:bg-gray-100'
                  }`}
                  style={isActive(item.path) ? { 
                    backgroundColor: `${COLORS.primaryColor}15`,
                    color: COLORS.primaryColor 
                  } : { 
                    color: COLORS.primaryText 
                  }}
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </button>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium leading-tight" style={{ color: COLORS.primaryText }}>
                    {user?.first_name || user?.user_name || 'User'}
                  </p>
                  <p className="text-xs leading-tight" style={{ color: COLORS.secondaryText }}>
                    {user?.email}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: COLORS.primaryColor }}
                >
                  {(user?.first_name?.[0] || user?.user_name?.[0] || 'U').toUpperCase()}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow"
                style={{ backgroundColor: COLORS.button }}
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-white shadow-lg" style={{ borderColor: COLORS.border }}>
            <nav className="px-4 py-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isActive(item.path)
                      ? 'shadow-sm'
                      : 'hover:bg-gray-100'
                  }`}
                  style={isActive(item.path) ? { 
                    backgroundColor: `${COLORS.primaryColor}15`,
                    color: COLORS.primaryColor 
                  } : { 
                    color: COLORS.primaryText 
                  }}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}

