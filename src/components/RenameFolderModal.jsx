import { useState, useEffect } from 'react';
import { X, Edit3, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { renameFolder } from '../api/api';

/**
 * Modal component for renaming an existing Folder (Repository).
 */
export default function RenameFolderModal({ isOpen, onClose, onRenameSuccess, folderId, folderName }) {
  const [newName, setNewName] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNewName(folderName || '');
      setError('');
      setSuccess(false);
    }
  }, [isOpen, folderName]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      setError('Please provide a new name.');
      return;
    }
    if (newName.trim() === folderName) {
      onClose();
      return;
    }

    setUpdating(true);
    setError('');
    
    try {
      await renameFolder(folderId, newName.trim());
      setSuccess(true);
      setTimeout(() => {
        onRenameSuccess();
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Folder rename error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Failed to rename folder.';
      setError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/60 backdrop-blur-sm p-4">
      <div 
        className="neo-border w-full max-w-lg rounded-[45px] bg-white p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200"
        style={{ boxShadow: '15px 15px 0 0 #191A23' }}
      >
        <button 
          onClick={onClose}
          className="absolute right-8 top-8 rounded-full p-2 hover:bg-neutral transition-colors"
        >
          <X size={24} className="text-dark" />
        </button>

        <h2 className="mb-8 text-3xl font-bold text-dark">
          Rename <span className="bg-neon px-2 neo-shadow">Repository</span>
        </h2>

        {success ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
            <CheckCircle2 size={64} className="text-green-500 animate-bounce" />
            <p className="text-xl font-bold text-dark italic">Renamed successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-dark/60">New Repository Name</label>
              <input 
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. New Project Name"
                className="neo-border rounded-xl bg-neutral px-4 py-3 text-dark outline-none focus:ring-4 focus:ring-neon/30"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-600 neo-border border-red-200">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="mt-4 flex gap-4">
              <button 
                type="button"
                onClick={onClose}
                className="neo-btn flex-1 rounded-xl bg-white hover:bg-neutral"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={updating}
                className="neo-btn flex-[2] flex items-center justify-center gap-2 rounded-xl bg-dark text-white hover:bg-neon hover:text-dark disabled:opacity-50"
              >
                {updating ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit3 size={20} />
                    Confirm Rename
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
