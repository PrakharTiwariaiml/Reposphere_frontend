import { ArrowUpRight } from 'lucide-react';

/**
 * Reusable Neo-Brutalist card (Positivus style).
 *
 * @param {{ title: string, description: string, category: string, variant?: 'white' | 'neon' | 'dark' }} props
 */
export default function FeatureCard({
  title,
  description,
  category,
  variant = 'white',
}) {
  /* colour map */
  const styles = {
    white: {
      bg: 'bg-white',
      text: 'text-dark',
      badge: 'badge-green',
      arrow: 'bg-dark text-white',
    },
    neon: {
      bg: 'bg-neon',
      text: 'text-dark',
      badge: 'badge-white',
      arrow: 'bg-dark text-white',
    },
    dark: {
      bg: 'bg-dark',
      text: 'text-white',
      badge: 'badge-green',
      arrow: 'bg-neon text-dark',
    },
  };

  const s = styles[variant] || styles.white;

  return (
    <div
      className={`group neo-border rounded-[45px] p-10 transition-all duration-200 hover:-translate-y-1 ${s.bg} ${s.text}`}
      style={{ boxShadow: '5px 5px 0 0 #191A23' }}
    >
      {/* Badge */}
      <span className={`${s.badge} mb-4 inline-block`}>{category}</span>

      {/* Title */}
      <h3 className="mb-2 text-xl font-bold leading-snug md:text-2xl">{title}</h3>

      {/* Description */}
      <p className={`mb-6 text-sm leading-relaxed ${variant === 'dark' ? 'text-white/70' : 'text-dark/60'}`}>
        {description}
      </p>

      {/* Arrow button */}
      <button
        className={`flex h-12 w-12 items-center justify-center rounded-full neo-border transition-transform group-hover:rotate-12 ${s.arrow}`}
        aria-label={`Open ${title}`}
      >
        <ArrowUpRight size={22} />
      </button>
    </div>
  );
}
