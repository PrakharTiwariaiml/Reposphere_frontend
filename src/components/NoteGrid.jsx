import FeatureCard from './FeatureCard';

const SAMPLE_NOTES = [
  {
    title: 'Data Structures & Algorithms',
    description:
      'Comprehensive notes covering arrays, linked lists, trees, graphs, sorting, and dynamic programming with visual examples.',
    category: 'Computer Science',
    variant: 'white',
  },
  {
    title: 'Organic Chemistry Reactions',
    description:
      "Detailed reaction mechanisms, reagent tables, and quick-reference for SN1, SN2, E1 & E2 processes.",
    category: 'Chemistry',
    variant: 'neon',
  },
  {
    title: 'Macroeconomics Fundamentals',
    description:
      'GDP, inflation, fiscal & monetary policy explained with real-world case studies and graph interpretations.',
    category: 'Economics',
    variant: 'dark',
  },
  {
    title: 'Linear Algebra Essentials',
    description:
      'Vectors, matrices, eigenvalues, and transformations — distilled into exam-ready cheat sheets.',
    category: 'Mathematics',
    variant: 'neon',
  },
  {
    title: 'World History: Modern Era',
    description:
      'Key events from the Industrial Revolution through the Cold War, timeline summaries, and essay outlines.',
    category: 'History',
    variant: 'dark',
  },
  {
    title: 'Psychology 101',
    description:
      'Core theories — Freud, Piaget, Maslow — along with research methods and cognitive biases for quick revision.',
    category: 'Psychology',
    variant: 'white',
  },
];

export default function NoteGrid() {
  return (
    <section id="notes" className="bg-neutral py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-12 flex flex-col items-start gap-4 md:flex-row md:items-center">
          <h2 className="inline-block rounded-xl bg-neon px-4 py-2 text-3xl font-bold text-dark neo-shadow md:text-4xl">
            Notes
          </h2>
          <p className="max-w-lg text-dark/60">
            Browse community-curated notes across every discipline. Filter, save,
            and contribute your own.
          </p>
        </div>

        {/* Card grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_NOTES.map((note, i) => (
            <FeatureCard
              key={i}
              title={note.title}
              description={note.description}
              category={note.category}
              variant={note.variant}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
