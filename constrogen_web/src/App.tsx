import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Login from './pages/Login';
import OTPVerification from './pages/OTPVerification';
import Dashboard from './pages/Dashboard';
import Purchase from './pages/Purchase';
import Approvals from './pages/Approvals';
import PurchaseRequisitionForm from './pages/PurchaseRequisitionForm';
import PurchaseRequisitionReview from './pages/PurchaseRequisitionReview';
import PurchaseHistory from './pages/PurchaseHistory';
import PurchaseOrderGRN from './pages/PurchaseOrderGRN';
import Layout from './components/layout/Layout';

// Protected Route Component
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Public Route Component (redirects to dashboard if already authenticated)
function PublicRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
}

// Coming Soon Component for placeholder pages
// function ComingSoon({ title }: { title: string }) {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[60vh]">
//       <div className="text-center">
//         <svg className="mx-auto h-24 w-24 text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//         </svg>
//         <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
//         <p className="text-gray-600 mb-4">This feature is coming soon!</p>
//         <p className="text-sm text-gray-500">We're working hard to bring you this functionality.</p>
//       </div>
//     </div>
//   );
// }

function App() {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('Service Worker registered successfully:', registration.scope);
          },
          (error) => {
            console.log('Service Worker registration failed:', error);
          }
        );
      });
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/otp-verification"
          element={
            <PublicRoute>
              <OTPVerification />
            </PublicRoute>
          }
        />

        {/* Protected Routes with Layout */}
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/approvals" element={<Approvals />} />

          {/* Purchase Sub-routes */}
          <Route path="/purchase-requisition" element={<PurchaseRequisitionForm />} />
          <Route path="/purchase-requisition/review" element={<PurchaseRequisitionReview />} />
          <Route path="/purchase-history" element={<PurchaseHistory />} />
          <Route path="/purchase-order-grn" element={<PurchaseOrderGRN />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

