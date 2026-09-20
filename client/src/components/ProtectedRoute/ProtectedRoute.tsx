import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  isLoggedIn: boolean;
  isCheckingToken: boolean;
  children: React.ReactNode;
};

export default function ProtectedRoute(
  props: ProtectedRouteProps,
): React.JSX.Element | null {
  const { isLoggedIn, isCheckingToken, children } = props;

  if (isCheckingToken) {
    return null;
  }

  return isLoggedIn ? <>{children}</> : <Navigate to='/signin' replace />;
}
