import EntryFrame from "../components/entry/EntryFrame";
import Recover from "../components/Recover/Recover";

type RecoverPageProps = {
  onRecover: (email: string, password: string) => Promise<void>;
};

export default function RecoverPage({
  onRecover,
}: RecoverPageProps): React.JSX.Element {
  return (
    <EntryFrame title="Recuperar contraseña">
      <Recover onRecover={onRecover} />
    </EntryFrame>
  );
}
