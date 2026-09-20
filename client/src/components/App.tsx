import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Header from './Header/Header';
import Main from './Main/Main';
import Footer from './Footer/Footer';
import Login from './Login/Login';
import Register from './Register/Register';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import InfoTooltip from './InfoTooltip/InfoTooltip';
import api from '../utils/api';
import { authorize, checkToken, register } from '../utils/auth';
import CurrentUserContext from '../contexts/CurrentUserContext';
import type { CardData, CardFormData } from '../interfaces/CardData';
import type { ModalData } from '../interfaces/ModalData';
import type {
  AvatarFormData,
  ProfileFormData,
  UserData,
} from '../interfaces/UserData';

export default function App(): React.JSX.Element {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [cards, setCards] = useState<CardData[]>([]);
  const [popup, setPopup] = useState<ModalData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isCheckingToken, setIsCheckingToken] = useState(
    () => Boolean(localStorage.getItem('jwt')),
  );
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isTooltipSuccess, setIsTooltipSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwt');

    if (!token) {
      return;
    }

    checkToken(token)
      .then((data) => {
        setIsLoggedIn(true);
        setUserEmail(data.data.email);
      })
      .catch(() => {
        localStorage.removeItem('jwt');
        setIsLoggedIn(false);
        setUserEmail('');
      })
      .finally(() => {
        setIsCheckingToken(false);
      });
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    (async () => {
      try {
        const [userData, initialCards] = await Promise.all([
          api.getUserInfo(),
          api.getInitialCards(),
        ]);
        setCurrentUser(userData);
        setCards(initialCards);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [isLoggedIn]);

  function handleOpenPopup(nextPopup: ModalData): void {
    setPopup(nextPopup);
  }

  function handleClosePopup(): void {
    setPopup(null);
  }

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
      .then((data) => {
        localStorage.setItem('jwt', data.token);
        setIsLoggedIn(true);
        setUserEmail(email);
        navigate('/');
      })
      .catch((error) => {
        console.error(error);
        setIsTooltipSuccess(false);
        setIsTooltipOpen(true);
      });
  }

  function handleSignOut(): void {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    setUserEmail('');
    setCurrentUser(null);
    setCards([]);
    setPopup(null);
    navigate('/signin');
  }

  async function handleCardLike(card: CardData): Promise<void> {
    const isLiked = card.isLiked;
    try {
      const apiCall = isLiked ? api.removeLike(card._id) : api.addLike(card._id);
      const newCard = await apiCall;
      setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCardDelete(card: CardData): Promise<void> {
    try {
      await api.deleteCard(card._id);
      setCards((state) => state.filter((c) => c._id !== card._id));
      setPopup(null);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdateUser(data: ProfileFormData): Promise<void> {
    try {
      const userData = await api.updateUserInfo(data);
      setCurrentUser(userData);
      setPopup(null);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdateAvatar(data: AvatarFormData): Promise<void> {
    try {
      const userData = await api.updateAvatar(data);
      setCurrentUser(userData);
      setPopup(null);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAddPlaceSubmit(data: CardFormData): Promise<void> {
    try {
      const newCard = await api.addCard(data);
      setCards((state) => [newCard, ...state]);
      setPopup(null);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        handleUpdateUser,
        handleUpdateAvatar,
        handleAddPlaceSubmit,
        handleCardDelete,
      }}
    >
      <div className='page__content'>
        <Header
          isLoggedIn={isLoggedIn}
          isCheckingToken={isCheckingToken}
          userEmail={userEmail}
          onSignOut={handleSignOut}
        />
        <Routes>
          <Route
            path='/'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                isCheckingToken={isCheckingToken}
              >
                <>
                  <Main
                    cards={cards}
                    handleOpenPopup={handleOpenPopup}
                    handleClosePopup={handleClosePopup}
                    popup={popup}
                    handleCardLike={handleCardLike}
                  />
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path='/signin'
            element={
              isCheckingToken ? null : isLoggedIn ? (
                <Navigate to='/' replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path='/signup'
            element={
              isCheckingToken ? null : isLoggedIn ? (
                <Navigate to='/' replace />
              ) : (
                <Register onRegister={handleRegister} />
              )
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
        {isTooltipOpen && (
          <InfoTooltip
            isOpen={isTooltipOpen}
            isSuccess={isTooltipSuccess}
            onClose={handleCloseTooltip}
          />
        )}
      </div>
    </CurrentUserContext.Provider>
  );
}
