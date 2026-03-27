import { useState, useEffect } from 'react';
import { fetchPublicNotes, fetchCurrentUser, BASE_SERVER_URL } from '../api/api';
import { FileText, Loader2, Globe, ExternalLink, Lock } from 'lucide-react';

/**
 * Displays publicly shared notes on the landing page.
 * Hits GET /api/notes/explore — guest access restricted via UI check.
 */
export default function ExploreSection() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const initExplore = async () => {
      setLoading(true);
      try {
        // 1. Check auth first (Crucial given backend security)
        try {
          await fetchCurrentUser();
          setIsLoggedIn(true);

          // 2. Fetch public notes/folders ONLY if logged in (since backend blocks guests)
          const data = await fetchPublicNotes();
          setFolders(Array.isArray(data) ? data : []);
        } catch (authErr) {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error('Explore fetch failed:', err);
        const msg = err.response?.data?.message || err.response?.data || err.message;
        setError(`Could not load community resources: ${msg}`);
      } finally {
        setLoading(false);
      }
    };

    initExplore();
  }, []);

  const getNoteName = (note) => {
    if (note.title) return note.title;
    const fileUrl = note.fileUrl;
    if (!fileUrl) return 'Untitled Note';
    try {
      const decoded = decodeURIComponent(fileUrl.split('/').pop().split('?')[0]);
      return decoded || 'Untitled Note';
    } catch {
      return 'Untitled Note';
    }
  };

  return (
    <div id="explore" className="flex flex-col gap-10">
      {/* Section header */}
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
        <h2 className="inline-block rounded-xl bg-neon px-4 py-2 text-3xl font-bold text-dark neo-shadow md:text-4xl">
          Explore
        </h2>
        <p className="max-w-lg text-dark/60 font-medium">
          Discover publicly shared knowledge from the community. Direct access to curated student resources.
        </p>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center gap-3 text-dark/50 p-12 neo-border rounded-[45px] bg-white/50">
          <Loader2 size={28} className="animate-spin text-neon" />
          <span className="font-bold text-xl italic uppercase tracking-widest">Scanning Repository...</span>
        </div>
      ) : !isLoggedIn ? (
        /* Guest Access Prompt */
        <div className="neo-border rounded-[45px] bg-white p-12 text-center shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-neon/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col items-center gap-6 relative z-10">
            <div className="h-20 w-20 rounded-3xl bg-neutral flex items-center justify-center neo-border rotate-3">
              <Lock size={40} className="text-dark/40" />
            </div>
            <h3 className="text-3xl font-black text-dark leading-tight">Join the <span className="underline decoration-neon decoration-8">Community Hub</span></h3>
            <p className="max-w-md text-lg text-dark/60 font-medium">
              Log in to see our public repositories, shared notes, and campus resources.
            </p>
            <a
              href={`${BASE_SERVER_URL}/oauth2/authorization/google`}
              className="neo-btn rounded-xl bg-neon px-8 py-3 text-lg font-bold shadow-lg hover:-translate-y-1 transition-transform"
            >
              Login with Google to View
            </a>
          </div>
        </div>
      ) : error ? (
        <div className="neo-border rounded-[45px] bg-red-50 p-12 text-center text-red-500 font-bold shadow-lg">
          <p className="text-xl mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="neo-btn rounded-xl bg-white px-6 py-2 text-sm hover:bg-neutral"
          >
            Retry Connection
          </button>
        </div>
      ) : folders.length === 0 ? (
        <div className="neo-border border-dashed border-4 rounded-[45px] bg-[#EAEAEA] py-24 text-center">
          <Globe size={64} className="mx-auto mb-6 text-dark/10" />
          <p className="text-2xl font-bold text-dark">The hub is currently quiet.</p>
          <p className="mt-2 text-lg text-dark/40">Be the first to share your academic world!</p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="group relative flex flex-col gap-6 rounded-[45px] bg-white p-8 transition-all duration-300 neo-border hover:-translate-y-2"
              style={{ boxShadow: '12px 12px 0 0 #191A23' }}
            >
              {/* Folder Header */}
              <div className="flex items-start justify-between border-b-2 border-dark/5 pb-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-2xl font-black text-dark uppercase tracking-tight truncate max-w-[200px]" title={folder.folderName}>
                    {folder.folderName}
                  </h3>
                  <div className="flex items-center gap-2 text-dark/40">
                    <Globe size={14} />
                    <span className="text-xs font-bold uppercase tracking-widest">Public Repository</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-neon flex items-center justify-center neo-border">
                  <span className="text-lg font-black">{folder.notes?.length || 0}</span>
                </div>
              </div>

              {/* Notes List inside Folder */}
              <div className="flex flex-col gap-4">
                {folder.notes && folder.notes.length > 0 ? (
                  folder.notes.map((note) => {
                    const noteName = getNoteName(note);
                    const fileExt = noteName.split('.').pop().toUpperCase();
                    
                    return (
                      <div 
                        key={note.id}
                        className="group/note flex items-center justify-between p-4 rounded-2xl bg-[#FFFBEB] neo-border hover:bg-neon/10 transition-colors"
                      >
                        <div className="flex flex-col gap-0.5 max-w-[70%]">
                          <span className="text-sm font-black italic text-dark truncate" title={noteName}>
                            {noteName}
                          </span>
                          {fileExt && fileExt.length <= 4 && (
                            <span className="w-fit text-[9px] font-black text-dark/40 uppercase tracking-tighter">
                              {fileExt} Document
                            </span>
                          )}
                        </div>

                        <a
                          href={note.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-dark text-white p-2 rounded-lg hover:bg-neon hover:text-dark transition-all"
                          title="Open Note"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    );
                  })
                ) : (
                  <p className="py-4 text-center text-xs font-bold text-dark/30 italic">No notes in this repository yet.</p>
                )}
              </div>

              {/* Footer info */}
              <div className="mt-auto pt-4 flex items-center justify-between opacity-40">
                <span className="text-[10px] font-black uppercase tracking-widest">Community Resource</span>
                <span className="text-[10px] font-bold">↗ Open Hub</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
