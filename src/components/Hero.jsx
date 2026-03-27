import { Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-neutral py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
        {/* ── Text block ── */}
        <div className="flex flex-col gap-6">
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-dark md:text-6xl lg:text-7xl">
            Manage your{' '}
            <span className="inline-block rounded-xl bg-neon px-3 py-1 neo-shadow">
              academic
            </span>{' '}
            world
          </h1>

          <p className="max-w-md text-lg text-dark/70">
            Your single hub for notes, schedules, and campus collaboration.
            Built for students who move fast and think bold.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button className="neo-btn rounded-xl bg-dark text-white hover:bg-dark/90" id="hero-cta">
              Get Started
            </button>
            <button className="neo-btn rounded-xl bg-white hover:bg-neon" id="hero-secondary">
              Learn More
            </button>
          </div>

          {/* ── Stats row ── */}
          <div className="mt-4 flex gap-8">
            {[
              { value: '12K+', label: 'Students' },
              { value: '4.8★', label: 'Rating' },
              { value: '50K', label: 'Notes Shared' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="text-2xl font-bold text-dark">{s.value}</span>
                <span className="text-sm text-dark/60">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Illustration placeholder ── */}
        <div className="relative flex items-center justify-center">
          {/* Abstract shapes */}
          <div className="neo-border neo-shadow-lg flex h-80 w-80 items-center justify-center rounded-[45px] bg-neon md:h-96 md:w-96">
            <div className="flex flex-col items-center gap-3 text-dark">
              <Sparkles size={64} strokeWidth={2} />
              <span className="text-xl font-bold">Illustration</span>
            </div>
          </div>

          {/* Decorative floating shapes */}
          <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full neo-border bg-white neo-shadow animate-bounce" />
          <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-[20px] neo-border bg-dark neo-shadow" />
        </div>
      </div>
    </section>
  );
}
