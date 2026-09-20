import logo from '../../images/logo.svg';

export default function Header(): React.JSX.Element {
  return (
    <header className='header page__section'>
      <img src={logo} alt='Around the U.S. logo' className='logo header__logo' />
    </header>
  );
}
