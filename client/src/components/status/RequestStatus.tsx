import { EMPTY_RESULTS, REQUEST_ERROR } from "../../utils/messages";

type RequestStatusProps = {
  status: "loading" | "error" | "empty";
};

export default function RequestStatus({
  status,
}: RequestStatusProps): React.JSX.Element {
  if (status === "loading") {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        Cargando…
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-sm leading-5" role="alert">
        {REQUEST_ERROR}
      </p>
    );
  }

  return <p className="text-sm">{EMPTY_RESULTS}</p>;
}
