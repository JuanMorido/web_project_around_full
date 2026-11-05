import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import api from '../utils/api';
import { authorize, recover, register } from '../utils/auth';
import CurrentUserContext from '../contexts/CurrentUserContext';
import type { UserData } from '../interfaces/UserData';
import { publicUrl } from '../utils/publicUrl';

const ProgramPage = lazy(() => import('../pages/ProgramPage'));
const SignInPage = lazy(() => import('../pages/SignInPage'));
const SignUpPage = lazy(() => import('../pages/SignUpPage'));
const RecoverPage = lazy(() => import('../pages/RecoverPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));

export default function App(): React.JSX.Element {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(() =>
    Boolean(localStorage.getItem('jwt')),
  );

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

  function handleRegister(
    username: string,
    email: string,
    password: string,
  ): Promise<void> {
    return register(username, email, password).then(() => {
      navigate('/signin', { state: { registered: true } });
    });
  }

  function handleRecover(email: string, password: string): Promise<void> {
    return recover(email, password).then(() => {
      navigate('/signin', { state: { recovered: true } });
    });
  }

  function handleLogin(username: string, password: string): Promise<void> {
    return authorize(username, password).then((user) => {
      localStorage.setItem('jwt', user.token);
      setCurrentUser(user);
      setIsLoggedIn(true);
      window.location.assign(publicUrl(''));
    });
  }

  function handleRename(name: string): Promise<void> {
    return api
      .updateUserInfo({
        name,
        about: currentUser?.about || 'Proyectos de energía',
      })
      .then((user) => {
        setCurrentUser(user);
      });
  }

  function handleSignOut(): void {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    setCurrentUser(null);
    window.location.assign(publicUrl('signin'));
  }

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        handleUpdateUser: async (data) => {
          const user = await api.updateUserInfo(data);
          setCurrentUser(user);
        },
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
                  onRename={handleRename}
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
                <SignInPage onLogin={handleLogin} />
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
                <SignUpPage onRegister={handleRegister} />
              </Suspense>
            )
          }
        />
        <Route
          path='/recuperar'
          element={
            isCheckingToken ? null : isLoggedIn ? (
              <Navigate to='/' replace />
            ) : (
              <Suspense fallback={null}>
                <RecoverPage onRecover={handleRecover} />
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
