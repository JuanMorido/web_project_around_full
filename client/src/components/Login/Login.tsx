import { useState } from 'react';
import { Link } from 'react-router-dom';

type LoginProps = {
  onLogin: (username: string, password: string) => Promise<void>;
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
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setError(null);
    setPending(true);
    onLogin(username, password)
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : 'Uy, algo salió mal. Por favor, inténtalo de nuevo.');
      })
      .finally(() => setPending(false));
  }

  return (
    <form
      autoComplete="off"
      className="mt-6 grid gap-4"
      name="login-form"
      onSubmit={handleSubmit}
    >
      <label className="grid gap-1.5 text-sm font-medium">
        Usuario
        <input
          autoComplete="username"
          className={fieldClass}
          id="login-username"
          name="username"
          placeholder="Usuario"
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
      {error || notice ? (
        <p className="rounded-lg border border-border bg-muted px-3 py-2 text-sm" role="alert">
          {error ?? notice}
        </p>
      ) : null}
      <button
        disabled={pending}
        className="h-10 rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/80"
        type="submit"
      >
        {pending ? 'Entrando…' : 'Inicia sesión'}
      </button>
      <p className="text-center text-sm text-muted-foreground">
        <Link
          className="font-medium text-foreground underline-offset-4 hover:underline"
          to="/recuperar"
        >
          ¿Olvidaste la contraseña?
        </Link>
      </p>
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
