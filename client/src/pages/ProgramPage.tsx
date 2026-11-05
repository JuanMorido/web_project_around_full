import "../styles/globals.css";
import { Studio } from "../components/studio/studio";

type ProgramPageProps = {
  onRename: (name: string) => Promise<void>;
  onSignOut: () => void;
  userName: string;
  userEmail: string;
};

export default function ProgramPage({
  onRename,
  onSignOut,
  userName,
  userEmail,
}: ProgramPageProps): React.JSX.Element {
  return (
    <Studio
      onRename={onRename}
      onSignOut={onSignOut}
      userName={userName}
      userEmail={userEmail}
    />
  );
}
