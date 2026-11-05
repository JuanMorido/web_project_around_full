import { useState } from 'react';
import { Link } from 'react-router-dom';

type RecoverProps = {
  onRecover: (email: string, password: string) => Promise<void>;
};

const fieldClass =
  'h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50';

export default function Recover({
  onRecover,
}: RecoverProps): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setError(null);
    setPending(true);
    onRecover(email, password)
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : 'Uy, algo salió mal. Por favor, inténtalo de nuevo.');
      })
      .finally(() => setPending(false));
  }

  return (
    <form className="mt-6 grid gap-4" name="recover-form" onSubmit={handleSubmit}>
      <p className="text-sm text-muted-foreground">
        El correo no entra a la cuenta. Solo sirve para elegir una contraseña nueva.
      </p>
      <label className="grid gap-1.5 text-sm font-medium">
        Correo de recuperación
        <input
          className={fieldClass}
          id="recover-email"
          name="email"
          placeholder="Correo electrónico"
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Contraseña nueva
        <input
          className={fieldClass}
          id="recover-password"
          minLength={8}
          name="password"
          placeholder="Contraseña"
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      {error ? (
        <p className="rounded-lg border border-border bg-muted px-3 py-2 text-sm" role="alert">
          {error}
        </p>
      ) : null}
      <button
        disabled={pending}
        className="h-10 rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/80"
        type="submit"
      >
        {pending ? 'Guardando…' : 'Guardar contraseña'}
      </button>
      <p className="text-center text-sm text-muted-foreground">
        <Link
          className="font-medium text-foreground underline-offset-4 hover:underline"
          to="/signin"
        >
          Volver a iniciar sesión
        </Link>
      </p>
    </form>
  );
}
