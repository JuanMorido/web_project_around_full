import "../styles/globals.css";
import { Studio } from "../components/studio/studio";

type ProgramPageProps = {
  onSignOut: () => void;
  userName: string;
  userEmail: string;
};

export default function ProgramPage({
  onSignOut,
  userName,
  userEmail,
}: ProgramPageProps): React.JSX.Element {
  return <Studio onSignOut={onSignOut} userName={userName} userEmail={userEmail} />;
}
