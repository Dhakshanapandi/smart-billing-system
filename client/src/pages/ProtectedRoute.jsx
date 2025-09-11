import { useSelector } from "react-redux";
export default function ProtectedRoute({ children, roles }) {
  const { token, role: userRole } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/login" />;

  if (roles && !roles.includes(userRole)) return <Navigate to="/login" />;

  return children;
}
