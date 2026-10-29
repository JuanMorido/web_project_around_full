import "../styles/globals.css";
import { Studio } from "../components/studio/studio";

type ProgramPageProps = {
  onSignOut: () => void;
};

export default function ProgramPage({
  onSignOut,
}: ProgramPageProps): React.JSX.Element {
  return <Studio onSignOut={onSignOut} />;
}
