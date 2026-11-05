import { useLocation } from "react-router-dom";
import EntryFrame from "../components/entry/EntryFrame";
import Login from "../components/Login/Login";

type SignInPageProps = {
  onLogin: (email: string, password: string) => Promise<void>;
};

export default function SignInPage({
  onLogin,
}: SignInPageProps): React.JSX.Element {
  const location = useLocation();
  const state = location.state as { registered?: boolean; recovered?: boolean } | null;
  const notice = state?.recovered
    ? "Contraseña actualizada. Entra con tu usuario."
    : state?.registered
      ? "¡Correcto! Ya estás registrado."
      : null;

  return (
    <EntryFrame title="Inicia sesión">
      <Login notice={notice} onLogin={onLogin} />
    </EntryFrame>
  );
}
