import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { fetchCurrentUser, logout, BASE_SERVER_URL } from '../api/api';

const navLinks = [
  { label: 'Explore', href: '/' },
  { label: 'Calendar', href: '#calendar' },
  { label: 'Community', href: '#community' },
];

export default function Header() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    fetchCurrentUser()
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false))
      .finally(() => setCheckingAuth(false));
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-neutral neo-border border-t-0 border-x-0 border-b-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* ── Logo ── */}
        <Link to="/" className="text-2xl font-bold tracking-tight text-dark select-none">
          Reposphere
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-semibold text-dark transition-colors hover:text-dark/70"
            >
              {l.label}
            </a>
          ))}

          {checkingAuth ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-dark border-t-transparent" />
          ) : isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="neo-btn flex items-center gap-2 rounded-xl bg-neon hover:brightness-95 text-sm font-semibold"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="neo-border rounded-xl bg-white p-2 hover:bg-neutral-200 transition-colors"
                title="Log Out"
              >
                <LogOut size={18} className="text-dark" />
              </button>
            </div>
          ) : (
            <a
              href={`${BASE_SERVER_URL}/oauth2/authorization/google`}
              className="neo-btn rounded-xl bg-neon hover:brightness-95 text-sm font-semibold"
              id="login-btn"
            >
              Login with Google
            </a>
          )}
        </nav>

        {/* ── Mobile hamburger ── */}
        <button
          className="md:hidden neo-border rounded-lg p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <nav className="flex flex-col gap-4 border-t-2 border-dark bg-neutral px-6 py-6 md:hidden">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-base font-semibold text-dark"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </a>
          ))}
          
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="neo-btn w-full flex items-center justify-center gap-2 rounded-xl bg-neon hover:brightness-95 text-sm font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                <LayoutDashboard size={18} />
                My Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="neo-btn w-full flex items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </>
          ) : (
            <a
              href={`${BASE_SERVER_URL}/oauth2/authorization/google`}
              className="neo-btn w-full rounded-xl bg-neon hover:brightness-95 text-center text-sm font-semibold"
              id="login-btn-mobile"
              onClick={() => setMobileOpen(false)}
            >
              Login with Google
            </a>
          )}
        </nav>
      )}
    </header>
  );
}
