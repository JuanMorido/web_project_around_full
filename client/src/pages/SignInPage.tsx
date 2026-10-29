import EntryFrame from "../components/entry/EntryFrame";
import Login from "../components/Login/Login";

type SignInPageProps = {
  onLogin: (email: string, password: string) => void;
  onSignOut: () => void;
  isLoggedIn: boolean;
  isCheckingToken: boolean;
  userEmail: string;
  isTooltipOpen: boolean;
  isTooltipSuccess: boolean;
  onCloseTooltip: () => void;
};

export default function SignInPage({
  onLogin,
  isTooltipOpen,
  isTooltipSuccess,
}: SignInPageProps): React.JSX.Element {
  const notice = !isTooltipOpen
    ? null
    : isTooltipSuccess
      ? "¡Correcto! Ya estás registrado."
      : "Uy, algo salió mal. Por favor, inténtalo de nuevo.";

  return (
    <EntryFrame title="Inicia sesión">
      <Login notice={notice} onLogin={onLogin} />
    </EntryFrame>
  );
}
