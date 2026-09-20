import { useState } from 'react';
import { Link } from 'react-router-dom';

type RegisterProps = {
  onRegister: (email: string, password: string) => void;
};

export default function Register({
  onRegister,
}: RegisterProps): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onRegister(email, password);
  }

  return (
    <section className='auth'>
      <h2 className='auth__title'>Regístrate</h2>
      <form className='auth__form' name='register-form' onSubmit={handleSubmit}>
        <label className='auth__field'>
          <input
            className='auth__input'
            id='register-email'
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
            id='register-password'
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
          Regístrate
        </button>
      </form>
      <p className='auth__caption'>
        ¿Ya eres miembro?{' '}
        <Link className='auth__link' to='/signin'>
          Inicia sesión aquí
        </Link>
      </p>
    </section>
  );
}
