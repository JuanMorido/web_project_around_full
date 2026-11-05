import { useState } from 'react';
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH, PASSWORD_MIN_LENGTH } from '../../utils/config';
import { Link } from 'react-router-dom';

type RegisterProps = {
  onRegister: (username: string, email: string, password: string) => Promise<void>;
  notice?: string | null;
};

const fieldClass =
  'h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50';

export default function Register({
  onRegister,
  notice,
}: RegisterProps): React.JSX.Element {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setError(null);
    setPending(true);
    onRegister(username, email, password)
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : 'Uy, algo salió mal. Por favor, inténtalo de nuevo.');
      })
      .finally(() => setPending(false));
  }

  return (
    <form className="mt-6 grid gap-4" name="register-form" onSubmit={handleSubmit}>
      <label className="grid gap-1.5 text-sm font-medium">
        Usuario
        <input
          autoComplete="username"
          className={fieldClass}
          id="register-username"
          maxLength={NAME_MAX_LENGTH}
          minLength={NAME_MIN_LENGTH}
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
          id="register-password"
          minLength={PASSWORD_MIN_LENGTH}
          name="password"
          placeholder="Contraseña"
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Correo de recuperación
        <input
          className={fieldClass}
          id="register-email"
          name="email"
          placeholder="Correo electrónico"
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <span className="text-xs font-normal text-muted-foreground">
          Solo se usa si olvidas la contraseña.
        </span>
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
        {pending ? 'Creando la cuenta…' : 'Regístrate'}
      </button>
      <p className="text-center text-sm text-muted-foreground">
        ¿Ya eres miembro?{' '}
        <Link
          className="font-medium text-foreground underline-offset-4 hover:underline"
          to="/signin"
        >
          Inicia sesión aquí
        </Link>
      </p>
    </form>
  );
}
