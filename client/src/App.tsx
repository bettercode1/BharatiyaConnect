import React from 'react';
import { Router, Route, Switch, Redirect } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import Hero from './pages/hero';
import Members from './pages/members';
import Events from './pages/events';
import Leadership from './pages/leadership';
import Analytics from './pages/analytics';
import Notices from './pages/notices';
import Reports from './pages/reports';
import Photos from './pages/photos';
import Settings from './pages/settings';
import NotFound from './pages/not-found';
import FeedbackPage from './pages/feedback';
import Login from './pages/login';
import ForgotPassword from './pages/forgot-password';
import { LanguageProvider } from './hooks/useLanguage';
import Layout from './components/layout/layout';
import { useAuth } from './hooks/useAuth';
import './index.css';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return <>{children}</>;
}

// Root Route Component - Shows login for unauthenticated users, Hero for authenticated users
function RootRoute() {
  const { isAuthenticated, loading } = useAuth();
  
  console.log('RootRoute - isAuthenticated:', isAuthenticated, 'loading:', loading);
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, show login page
  if (!isAuthenticated) {
    console.log('RootRoute - Showing Login page');
    return <Login />;
  }
  
  // If authenticated, show Hero page with layout
  console.log('RootRoute - Showing Hero page');
  return (
    <Layout>
      <Hero />
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Router>
          <div className="App">
            <Switch>
              {/* Login Routes - No Layout */}
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/forgot-password">
                <ForgotPassword />
              </Route>
              
              {/* Root path - Always show login page for now */}
              <Route path="/">
                <Login />
              </Route>
              <Route path="/hero">
                <ProtectedRoute>
                  <Layout>
                    <Hero />
                  </Layout>
                </ProtectedRoute>
              </Route>
              <Route path="/members">
                <ProtectedRoute>
                  <Layout>
                    <Members />
                  </Layout>
                </ProtectedRoute>
              </Route>
              <Route path="/events">
                <ProtectedRoute>
                  <Layout>
                    <Events />
                  </Layout>
                </ProtectedRoute>
              </Route>
              <Route path="/leadership">
                <ProtectedRoute>
                  <Layout>
                    <Leadership />
                  </Layout>
                </ProtectedRoute>
              </Route>
              <Route path="/notices">
                <ProtectedRoute>
                  <Layout>
                    <Notices />
                  </Layout>
                </ProtectedRoute>
              </Route>
              <Route path="/photos">
                <ProtectedRoute>
                  <Layout>
                    <Photos />
                  </Layout>
                </ProtectedRoute>
              </Route>
              <Route path="/settings">
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              </Route>
              <Route path="/analytics">
                <ProtectedRoute>
                  <Layout>
                    <Analytics />
                  </Layout>
                </ProtectedRoute>
              </Route>
              <Route path="/reports">
                <ProtectedRoute>
                  <Layout>
                    <Reports />
                  </Layout>
                </ProtectedRoute>
              </Route>
              <Route path="/feedback">
                <ProtectedRoute>
                  <Layout>
                    <FeedbackPage />
                  </Layout>
                </ProtectedRoute>
              </Route>
              <Route path="/dashboard">
                <ProtectedRoute>
                  <Redirect to="/" />
                </ProtectedRoute>
              </Route>
              <Route>
                <ProtectedRoute>
                  <Layout>
                    <NotFound />
                  </Layout>
                </ProtectedRoute>
              </Route>
            </Switch>
          </div>
        </Router>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App; 