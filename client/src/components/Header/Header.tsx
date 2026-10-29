import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { publicUrl } from '../../utils/publicUrl';

type HeaderProps = {
  isLoggedIn: boolean;
  isCheckingToken: boolean;
  userEmail: string;
  onSignOut: () => void;
};

export default function Header({
  isLoggedIn,
  isCheckingToken,
  userEmail,
  onSignOut,
}: HeaderProps): React.JSX.Element {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const authLinkPath = pathname === '/signup' ? '/signin' : '/signup';
  const authLinkText = pathname === '/signup' ? 'Iniciar sesión' : 'Regístrate';

  function handleToggleMenu(): void {
    setIsMenuOpen((open) => !open);
  }

  function handleSignOut(): void {
    setIsMenuOpen(false);
    onSignOut();
  }

  return (
    <>
      {isLoggedIn && (
        <div
          className={`header__mobile-menu ${
            isMenuOpen ? 'header__mobile-menu_open' : ''
          }`}
          hidden={!isMenuOpen}
        >
          <p className='header__email'>{userEmail}</p>
          <button
            className='header__logout'
            type='button'
            onClick={handleSignOut}
          >
            Cerrar sesión
          </button>
        </div>
      )}
      <header
        className={`header page__section ${
          isMenuOpen ? 'header_menu-open' : ''
        }`}
      >
        <img
          src={publicUrl('logo-viabilidad.svg')}
          alt='Mundínamo'
          className='logo header__logo'
        />
        {isCheckingToken ? null : isLoggedIn ? (
          <>
            <nav className='header__nav'>
              <p className='header__email'>{userEmail}</p>
              <button
                className='header__logout'
                type='button'
                onClick={handleSignOut}
              >
                Cerrar sesión
              </button>
            </nav>
            <button
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              className={`header__burger ${
                isMenuOpen ? 'header__burger_open' : ''
              }`}
              type='button'
              onClick={handleToggleMenu}
            />
          </>
        ) : (
          <Link className='header__link' to={authLinkPath}>
            {authLinkText}
          </Link>
        )}
      </header>
    </>
  );
}
