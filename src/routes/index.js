import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import SkeletonLoader from '../components/common/SkeletonLoader';

// Preload components
const preloadComponent = (importFn) => {
  const Component = lazy(importFn);
  Component.preload = importFn;
  return Component;
};

// Lazy load components with preloading
const Home = preloadComponent(() => import('../components/features/home/Home'));
const About = preloadComponent(() => import('../components/features/about/About'));
const Login = preloadComponent(() => import('../components/auth/Login'));
const Signup = preloadComponent(() => import('../components/auth/Signup'));
const Support = preloadComponent(() => import('../components/features/support/Support'));
const NotFound = preloadComponent(() => import('../components/common/NotFound'));

// Preload next likely routes
const preloadNextRoutes = (path) => {
  switch (path) {
    case '/':
      About.preload();
      Login.preload();
      break;
    case '/about':
      Home.preload();
      Support.preload();
      break;
    case '/login':
      Signup.preload();
      break;
    case '/signup':
      Login.preload();
      break;
    default:
      break;
  }
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <Routes>
        <Route 
          path="/" 
          element={
            <React.Suspense fallback={<SkeletonLoader />}>
              <Home />
            </React.Suspense>
          } 
          onMouseEnter={() => preloadNextRoutes('/')}
        />
        <Route 
          path="/about" 
          element={
            <React.Suspense fallback={<SkeletonLoader />}>
              <About />
            </React.Suspense>
          }
          onMouseEnter={() => preloadNextRoutes('/about')}
        />
        <Route 
          path="/login" 
          element={
            <React.Suspense fallback={<SkeletonLoader />}>
              <Login />
            </React.Suspense>
          }
          onMouseEnter={() => preloadNextRoutes('/login')}
        />
        <Route 
          path="/signup" 
          element={
            <React.Suspense fallback={<SkeletonLoader />}>
              <Signup />
            </React.Suspense>
          }
          onMouseEnter={() => preloadNextRoutes('/signup')}
        />
        <Route 
          path="/support" 
          element={
            <React.Suspense fallback={<SkeletonLoader />}>
              <Support />
            </React.Suspense>
          }
          onMouseEnter={() => preloadNextRoutes('/support')}
        />
        <Route 
          path="*" 
          element={
            <React.Suspense fallback={<SkeletonLoader />}>
              <NotFound />
            </React.Suspense>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes; 