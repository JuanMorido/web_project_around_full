import EntryFrame from "../components/entry/EntryFrame";
import Register from "../components/Register/Register";

type SignUpPageProps = {
  onRegister: (email: string, password: string) => void;
  onSignOut: () => void;
  isLoggedIn: boolean;
  isCheckingToken: boolean;
  userEmail: string;
  isTooltipOpen: boolean;
  isTooltipSuccess: boolean;
  onCloseTooltip: () => void;
};

export default function SignUpPage({
  onRegister,
  isTooltipOpen,
  isTooltipSuccess,
}: SignUpPageProps): React.JSX.Element {
  const notice =
    isTooltipOpen && !isTooltipSuccess
      ? "Uy, algo salió mal. Por favor, inténtalo de nuevo."
      : null;

  return (
    <EntryFrame title="Regístrate">
      <Register notice={notice} onRegister={onRegister} />
    </EntryFrame>
  );
}
