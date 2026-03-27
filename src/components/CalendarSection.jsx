import Calendar from './Calendar';

export default function CalendarSection() {
  return (
    <section id="calendar" className="bg-neutral py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-12 flex flex-col items-start gap-4 md:flex-row md:items-center">
          <h2 className="inline-block rounded-xl bg-neon px-4 py-2 text-3xl font-bold text-dark neo-shadow md:text-4xl">
            Calendar
          </h2>
          <p className="max-w-lg text-dark/60">
            Plan your semester, track deadlines, and never miss an exam. Click any day to manage events.
          </p>
        </div>

        <Calendar />
      </div>
    </section>
  );
}
