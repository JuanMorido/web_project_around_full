import { useState } from 'react';
import { Link } from 'react-router-dom';

type RegisterProps = {
  onRegister: (email: string, password: string) => void;
  notice?: string | null;
};

const fieldClass =
  'h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50';

export default function Register({
  onRegister,
  notice,
}: RegisterProps): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onRegister(email, password);
  }

  return (
    <form className="mt-6 grid gap-4" name="register-form" onSubmit={handleSubmit}>
      {notice ? (
        <p className="rounded-lg border border-border bg-muted px-3 py-2 text-sm">
          {notice}
        </p>
      ) : null}
      <label className="grid gap-1.5 text-sm font-medium">
        Correo electrónico
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
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Contraseña
        <input
          className={fieldClass}
          id="register-password"
          minLength={8}
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
        Regístrate
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
