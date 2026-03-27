import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Calendar from './components/Calendar';
import ExploreSection from './components/ExploreSection';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function HomePage() {
  return (
    <div className="min-h-screen bg-neutral">
      <Header />
      <main>
        <Hero />

        {/* ── Explore + Calendar side-by-side ── */}
        <section className="bg-neutral py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
              {/* Left: Public Repos */}
              <div className="flex-1">
                <ExploreSection />
              </div>

              {/* Right: Sticky Calendar */}
              <aside className="w-full lg:w-[400px]">
                <div className="sticky top-28">
                  <div className="mb-6">
                    <h2 className="inline-block rounded-xl bg-neon px-4 py-2 text-3xl font-bold text-dark neo-shadow">
                      Calendar
                    </h2>
                    <p className="mt-3 max-w-xs text-dark/60">
                      Plan your semester and track deadlines.
                    </p>
                  </div>
                  <Calendar />
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <footer className="neo-border border-x-0 border-b-0 bg-dark py-10 text-center text-white/60">
        <p className="text-sm">
          © 2026 <span className="font-bold text-neon">Reposphere</span>. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

