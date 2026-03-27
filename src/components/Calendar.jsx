import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { fetchMyEvents, addCalendarEvent, deleteCalendarEvent } from '../api/api';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getEventsForDate(events, year, month, day) {
  const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return events.filter((e) => {
    // If backend uses eventDate (ISO string), extract the date part
    const eDate = e.eventDate ? e.eventDate.split('T')[0] : e.date;
    return eDate === dateKey;
  });
}

export default function Calendar() {
  const today = new Date();
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selected, setSelected] = useState(null);
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('12:00');
  const [loading, setLoading] = useState(false);

  // Fetch events from backend
  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await fetchMyEvents();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const { year, month } = current;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () =>
    setCurrent(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
    );

  const nextMonth = () =>
    setCurrent(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
    );

  const isToday = (day) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const isSelected = (day) =>
    selected &&
    selected.day === day &&
    selected.month === month &&
    selected.year === year;

  const selectedEvents = selected
    ? getEventsForDate(events, selected.year, selected.month, selected.day)
    : [];

  const addEvent = async () => {
    if (!title.trim() || !selected) return;
    
    // Format LocalDateTime string: YYYY-MM-DDTHH:MM:SS
    const dateStr = `${selected.year}-${String(selected.month + 1).padStart(2, '0')}-${String(selected.day).padStart(2, '0')}`;
    const dateTimeStr = `${dateStr}T${time}:00`;
    
    const eventData = {
      title: title.trim(),
      description: description.trim(),
      eventDate: dateTimeStr,
      color: 'bg-neon text-dark' // Keep for UI if needed, though not in entity
    };

    try {
      await addCalendarEvent(eventData);
      setTitle('');
      setDescription('');
      setTime('12:00');
      loadEvents(); // Refresh events list
    } catch (error) {
      console.error("Failed to add event", error);
    }
  };

  const handleDeleteEvent = async (e, id) => {
    e.stopPropagation(); // Avoid selecting the day if clicked inside the list (though here it's already selected)
    if (!window.confirm("Delete this event?")) return;
    
    try {
      setLoading(true);
      await deleteCalendarEvent(id);
      loadEvents(); // Refresh
    } catch (error) {
      console.error("Failed to delete event", error);
      alert("Error deleting event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Build the grid: leading blank cells + day cells
  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* ── Calendar grid ── */}
      <div className="neo-border rounded-2xl bg-white p-6 shadow-sm">
        {/* Month navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="neo-border rounded-xl p-2 hover:bg-neon transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-xl font-bold text-dark">
            {MONTHS[month]} {year}
          </h3>
          <button
            onClick={nextMonth}
            className="neo-border rounded-xl p-2 hover:bg-neon transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Day-of-week headers */}
        <div className="mb-2 grid grid-cols-7 text-center">
          {DAYS.map((d) => (
            <div key={d} className="py-1 text-xs font-bold text-dark/50 uppercase tracking-wide">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, idx) => {
            if (!day) return <div key={`blank-${idx}`} />;
            const dayEvents = getEventsForDate(events, year, month, day);
            return (
              <button
                key={day}
                onClick={() => setSelected({ year, month, day })}
                className={[
                  'relative flex flex-col items-center rounded-xl py-2 px-1 text-sm font-semibold transition-all',
                  isSelected(day)
                    ? 'bg-dark text-white neo-border'
                    : isToday(day)
                    ? 'bg-neon text-dark neo-border'
                    : 'hover:bg-neon/40 text-dark',
                ].join(' ')}
              >
                <span>{day}</span>
                {/* Event dot indicators */}
                {dayEvents.length > 0 && (
                  <div className="mt-1 flex gap-0.5 justify-center">
                    {dayEvents.slice(0, 3).map((_, i) => (
                      <span
                        key={i}
                        className={[
                          'h-1 w-1 rounded-full',
                          isSelected(day) ? 'bg-neon' : 'bg-dark',
                        ].join(' ')}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className={`text-[8px] leading-none ${isSelected(day) ? 'text-neon' : 'text-dark'}`}>+</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Event sidebar/info ── */}
      <div className="neo-border rounded-2xl bg-white p-6 shadow-sm flex flex-col gap-4">
        {selected ? (
          <>
            <h4 className="text-lg font-bold text-dark">
              {MONTHS[selected.month]} {selected.day}, {selected.year}
            </h4>

            {loading ? (
              <div className="flex justify-center py-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-neon border-t-transparent"></div>
              </div>
            ) : selectedEvents.length === 0 ? (
              <p className="text-sm text-dark/50">No events for this day.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {selectedEvents.map((ev) => {
                  const eventTime = ev.eventDate ? new Date(ev.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                  return (
                    <li
                      key={ev.id}
                      className={`${ev.color || 'bg-neon text-dark'} neo-border group relative rounded-xl px-3 py-2 text-sm font-semibold flex flex-col gap-1 pr-10`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold">{ev.title}</span>
                        {eventTime && <span className="text-xs opacity-70">{eventTime}</span>}
                      </div>
                      {ev.description && (
                        <p className="text-xs font-normal opacity-80">{ev.description}</p>
                      )}
                      
                      {/* Delete button (visible on hover or always) */}
                      <button
                        onClick={(e) => handleDeleteEvent(e, ev.id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-dark/10 rounded-lg transition-colors text-dark/40 hover:text-dark"
                        title="Delete Event"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Add new event */}
            <div className="mt-auto flex flex-col gap-3 border-t-2 border-dark/10 pt-4">
              <p className="text-xs font-bold text-dark/50 uppercase tracking-wide">Add Event</p>
              
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Event Title (e.g. Calculus Exam)"
                  className="neo-border w-full rounded-xl bg-neutral px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neon"
                />
                
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description (Optional)"
                  rows="2"
                  className="neo-border w-full rounded-xl bg-neutral px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neon resize-none"
                />

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-dark/50">Time:</span>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="neo-border rounded-xl bg-neutral px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-neon"
                  />
                </div>
              </div>

              <button
                onClick={addEvent}
                disabled={!title.trim() || loading}
                className="neo-btn flex items-center justify-center gap-1 rounded-xl bg-neon text-sm font-semibold hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
                {loading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-dark/40 py-8">
            <div className="neo-border rounded-2xl bg-neutral p-6">
              <ChevronLeft size={32} className="rotate-90 opacity-30" />
            </div>
            <p className="text-sm font-semibold">Click a day to view<br />or add events</p>
          </div>
        )}
      </div>
    </div>
  );
}
