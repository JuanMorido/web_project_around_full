import EntryFrame from "../components/entry/EntryFrame";
import Register from "../components/Register/Register";

type SignUpPageProps = {
  onRegister: (username: string, email: string, password: string) => Promise<void>;
};

export default function SignUpPage({
  onRegister,
}: SignUpPageProps): React.JSX.Element {
  return (
    <EntryFrame title="Regístrate">
      <Register onRegister={onRegister} />
    </EntryFrame>
  );
}
