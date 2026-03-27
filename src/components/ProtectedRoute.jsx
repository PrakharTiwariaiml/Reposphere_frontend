/**
 * Higher-order component to protect routes that require authentication.
 * Relies on backend session and global axios interceptor for redirection.
 */
export default function ProtectedRoute({ children }) {
  return children;
}
