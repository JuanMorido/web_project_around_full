import { useState } from 'react';
import { Link } from 'react-router-dom';

type LoginProps = {
  onLogin: (username: string, password: string) => void;
  notice?: string | null;
};

const fieldClass =
  'h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50';

export default function Login({
  onLogin,
  notice,
}: LoginProps): React.JSX.Element {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onLogin(username, password);
  }

  return (
    <form
      autoComplete="off"
      className="mt-6 grid gap-4"
      name="login-form"
      onSubmit={handleSubmit}
    >
      {notice ? (
        <p className="rounded-lg border border-border bg-muted px-3 py-2 text-sm">
          {notice}
        </p>
      ) : null}
      <label className="grid gap-1.5 text-sm font-medium">
        Usuario
        <input
          autoComplete="off"
          className={fieldClass}
          id="login-username"
          name="login-user"
          required
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Contraseña
        <input
          className={fieldClass}
          id="login-password"
          name="password"
          placeholder="Contraseña"
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <button
        className="h-10 rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/80"
        type="submit"
      >
        Inicia sesión
      </button>
      <p className="text-center text-sm text-muted-foreground">
        ¿Aún no eres miembro?{' '}
        <Link
          className="font-medium text-foreground underline-offset-4 hover:underline"
          to="/signup"
        >
          Regístrate aquí
        </Link>
      </p>
    </form>
  );
}
