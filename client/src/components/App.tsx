import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import api from '../utils/api';
import { authorize, register } from '../utils/auth';
import CurrentUserContext from '../contexts/CurrentUserContext';
import type { UserData } from '../interfaces/UserData';
import { publicUrl } from '../utils/publicUrl';

const ProgramPage = lazy(() => import('../pages/ProgramPage'));
const SignInPage = lazy(() => import('../pages/SignInPage'));
const SignUpPage = lazy(() => import('../pages/SignUpPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));

export default function App(): React.JSX.Element {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(() =>
    Boolean(localStorage.getItem('jwt')),
  );
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isTooltipSuccess, setIsTooltipSuccess] = useState(false);

  useEffect(() => {
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

  function handleLogin(email: string, password: string): void {
    authorize(email, password)
      .then((user) => {
        localStorage.setItem('jwt', user.token);
        setCurrentUser(user);
        setIsLoggedIn(true);
        window.location.assign(publicUrl(''));
      })
      .catch(() => {
        setIsTooltipSuccess(false);
        setIsTooltipOpen(true);
      });
  }

  function handleSignOut(): void {
    localStorage.removeItem('jwt');
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
                <ProgramPage
                  onSignOut={handleSignOut}
                  userName={currentUser?.name ?? ''}
                  userEmail={currentUser?.email ?? ''}
                />
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
