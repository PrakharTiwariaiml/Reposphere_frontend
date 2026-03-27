import { Folder, ExternalLink, Trash2, Edit2, FileText } from 'lucide-react';

/**
 * Specialized card for repository/folder/note display on the dashboard.
 *
 * @param {{ id: number, title: string, fileUrl: string, isPublic: boolean, type: 'folder' | 'note', noteCount: number, onClick: function, onDelete: function, onRename: function }} props
 */
export default function NoteCard({ id, title, fileUrl, isPublic, type = 'note', noteCount, onClick, onDelete, onRename }) {
  // Helper to extract file extension
  const getFileExtension = (url) => {
    if (!url) return '';
    try {
      const ext = url.split('.').pop().split(/[?#]/)[0].toUpperCase();
      return ext.length <= 4 ? ext : '';
    } catch {
      return '';
    }
  };

  const fileExt = type === 'note' ? getFileExtension(fileUrl) : null;

  return (
    <div
      onClick={type === 'folder' ? onClick : undefined}
      className={`neo-border relative p-6 transition-all duration-300 ${
        type === 'folder' 
          ? 'rounded-2xl bg-white cursor-pointer hover:bg-neutral hover:-translate-y-1' 
          : 'rounded-bl-[45px] bg-[#FFFBEB] hover:-translate-y-1 hover:rotate-1'
      }`}
      style={{ 
        boxShadow: '8px 8px 0 0 #191A23',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Dog-ear corner for Notes */}
      {type === 'note' && (
        <div className="absolute top-0 right-0 h-10 w-10 overflow-hidden rounded-tr-xl">
           <div className="absolute top-0 right-0 h-0 w-0 border-l-[40px] border-t-[40px] border-l-transparent border-t-dark/10 shadow-sm transition-all duration-300" 
                style={{ borderTopColor: 'rgba(25, 26, 35, 0.1)' }} />
           <div className="absolute top-0 right-0 h-0 w-0 border-r-[40px] border-b-[40px] border-r-transparent border-b-[#E5E1D1] shadow-md transform -translate-x-0.5 -translate-y-0.5" />
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl neo-border ${
          type === 'folder' ? 'bg-neon' : 'bg-sky-200'
        }`}>
          {type === 'folder' ? (
            <Folder size={20} className="text-dark" />
          ) : (
            <FileText size={20} className="text-dark/60" />
          )}
        </div>
        <div className="flex items-center gap-2">
          {fileExt && (
            <span className="neo-border rounded-lg bg-dark text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter">
              {fileExt}
            </span>
          )}
          {isPublic && (
            <span className="neo-border rounded-lg bg-green-100 text-green-700 px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter">
              Shared
            </span>
          )}
          <div className="flex items-center gap-1">
            {type === 'folder' && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onRename(id, title);
                }}
                className="rounded-md p-1 hover:bg-neon/20 hover:text-dark transition-colors"
                title="Rename Repository"
              >
                <Edit2 size={16} />
              </button>
            )}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Delete this ${type}?`)) {
                  onDelete(id);
                }
              }}
              className="rounded-md p-1 hover:bg-red-50 hover:text-red-600 transition-colors"
              title={`Delete ${type === 'folder' ? 'Repository' : 'Note'}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <h3 className={`mb-4 font-bold text-dark leading-tight line-clamp-2 ${type === 'folder' ? 'text-lg' : 'text-md italic font-black'}`}>
        {title}
      </h3>

      <div className="mt-auto flex items-center justify-between border-t-2 border-dark/5 pt-4">
        <span className="text-xs font-semibold text-dark/40 uppercase">
          {type === 'folder' ? `${noteCount ?? 0} file${noteCount === 1 ? '' : 's'}` : 'Attachment'}
        </span>
        {type === 'note' && fileUrl && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-bold text-dark underline decoration-sky-400 decoration-4 underline-offset-4 hover:decoration-dark transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            Open File
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}
