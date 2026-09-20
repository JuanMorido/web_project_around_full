import { useState } from 'react';
import { Link } from 'react-router-dom';

type LoginProps = {
  onLogin: (email: string, password: string) => void;
};

export default function Login({ onLogin }: LoginProps): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onLogin(email, password);
  }

  return (
    <section className='auth'>
      <h2 className='auth__title'>Inicia sesión</h2>
      <form className='auth__form' name='login-form' onSubmit={handleSubmit}>
        <label className='auth__field'>
          <input
            className='auth__input'
            id='login-email'
            name='email'
            placeholder='Correo electrónico'
            required
            type='email'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className='auth__field'>
          <input
            className='auth__input'
            id='login-password'
            minLength={8}
            name='password'
            placeholder='Contraseña'
            required
            type='password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button className='auth__button' type='submit'>
          Inicia sesión
        </button>
      </form>
      <p className='auth__caption'>
        ¿Aún no eres miembro?{' '}
        <Link className='auth__link' to='/signup'>
          Regístrate aquí
        </Link>
      </p>
    </section>
  );
}
