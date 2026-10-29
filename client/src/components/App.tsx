import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import api from '../utils/api';
import { register } from '../utils/auth';
import CurrentUserContext from '../contexts/CurrentUserContext';
import type { UserData } from '../interfaces/UserData';
import { publicUrl } from '../utils/publicUrl';

const ProgramPage = lazy(() => import('../pages/ProgramPage'));
const SignInPage = lazy(() => import('../pages/SignInPage'));
const SignUpPage = lazy(() => import('../pages/SignUpPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));

const LOCAL_SESSION_KEY = 'viabilidad-session';
const LOCAL_USERNAME = 'admin';
const LOCAL_PASSWORD = '0000';

function hasLocalSession(): boolean {
  return localStorage.getItem(LOCAL_SESSION_KEY) === LOCAL_USERNAME;
}

const localUser: UserData = {
  _id: 'local-admin',
  email: LOCAL_USERNAME,
  name: LOCAL_USERNAME,
  about: '',
  avatar: '',
};

export default function App(): React.JSX.Element {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(hasLocalSession);
  const [isCheckingToken, setIsCheckingToken] = useState(
    () => !hasLocalSession() && Boolean(localStorage.getItem('jwt')),
  );
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isTooltipSuccess, setIsTooltipSuccess] = useState(false);

  useEffect(() => {
    if (hasLocalSession()) {
      setCurrentUser(localUser);
      setIsLoggedIn(true);
      setIsCheckingToken(false);
      return;
    }

    const token = localStorage.getItem('jwt');

    if (!token) {
      return;
    }

    api
      .getUserInfo()
      .then((userData) => {
        setCurrentUser(userData);
        setIsLoggedIn(true);
      })
      .catch(() => {
        localStorage.removeItem('jwt');
        setIsLoggedIn(false);
        setCurrentUser(null);
      })
      .finally(() => {
        setIsCheckingToken(false);
      });
  }, []);

  function handleCloseTooltip(): void {
    setIsTooltipOpen(false);
  }

  function handleRegister(email: string, password: string): void {
    register(email, password)
      .then(() => {
        setIsTooltipSuccess(true);
        setIsTooltipOpen(true);
        navigate('/signin');
      })
      .catch((error) => {
        console.error(error);
        setIsTooltipSuccess(false);
        setIsTooltipOpen(true);
      });
  }

  function handleLogin(username: string, password: string): void {
    if (username.trim() === LOCAL_USERNAME && password === LOCAL_PASSWORD) {
      localStorage.setItem(LOCAL_SESSION_KEY, LOCAL_USERNAME);
      window.location.assign(publicUrl(''));
      return;
    }

    setIsTooltipSuccess(false);
    setIsTooltipOpen(true);
  }

  function handleSignOut(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem(LOCAL_SESSION_KEY);
    setIsLoggedIn(false);
    setCurrentUser(null);
    window.location.assign(publicUrl('signin'));
  }

  const authPageProps = {
    onSignOut: handleSignOut,
    isLoggedIn,
    isCheckingToken,
    userEmail: currentUser?.email ?? '',
    isTooltipOpen,
    isTooltipSuccess,
    onCloseTooltip: handleCloseTooltip,
  };

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        handleUpdateUser: async () => {},
        handleUpdateAvatar: async () => {},
        handleAddPlaceSubmit: async () => {},
        handleCardDelete: async () => {},
      }}
    >
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              isCheckingToken={isCheckingToken}
            >
              <Suspense fallback={null}>
                <ProgramPage onSignOut={handleSignOut} />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path='/signin'
          element={
            isCheckingToken ? null : isLoggedIn ? (
              <Navigate to='/' replace />
            ) : (
              <Suspense fallback={null}>
                <SignInPage onLogin={handleLogin} {...authPageProps} />
              </Suspense>
            )
          }
        />
        <Route
          path='/signup'
          element={
            isCheckingToken ? null : isLoggedIn ? (
              <Navigate to='/' replace />
            ) : (
              <Suspense fallback={null}>
                <SignUpPage onRegister={handleRegister} {...authPageProps} />
              </Suspense>
            )
          }
        />
        <Route
          path='/sobre'
          element={
            <Suspense fallback={null}>
              <AboutPage />
            </Suspense>
          }
        />
        <Route
          path='*'
          element={
            isCheckingToken ? null : (
              <Navigate to={isLoggedIn ? '/' : '/signin'} replace />
            )
          }
        />
      </Routes>
    </CurrentUserContext.Provider>
  );
}
