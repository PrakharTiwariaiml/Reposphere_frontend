import { useState } from 'react';
import { X, FolderPlus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { createFolder } from '../api/api';

/**
 * Modal component for creating a new Folder (Repository).
 */
export default function CreateFolderModal({ isOpen, onClose, onCreateSuccess }) {
  const [folderName, setFolderName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) {
      setError('Please provide a folder name.');
      return;
    }

    setCreating(true);
    setError('');
    
    try {
      await createFolder(folderName.trim(), isPublic);
      setSuccess(true);
      setTimeout(() => {
        onCreateSuccess();
        onClose();
        // Reset state
        setFolderName('');
        setIsPublic(false);
        setSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Folder creation error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Failed to create folder.';
      setError(errorMessage);
    } finally {
      setCreating(false);
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
          Create <span className="bg-neon px-2 neo-shadow">New Repo</span>
        </h2>

        {success ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
            <CheckCircle2 size={64} className="text-green-500 animate-bounce" />
            <p className="text-xl font-bold text-dark italic">Folder created successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Folder Name Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-dark/60">Repository Name</label>
              <input 
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="e.g. Semester 4 Notes"
                className="neo-border rounded-xl bg-neutral px-4 py-3 text-dark outline-none focus:ring-4 focus:ring-neon/30"
                autoFocus
              />
            </div>
 
            {/* Public Toggle */}
            <label className="flex cursor-pointer items-center gap-3">
              <div className="relative">
                <input 
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-6 w-6 rounded-md neo-border bg-white peer-checked:bg-neon transition-colors" />
              </div>
              <span className="text-sm font-bold text-dark">Make this repository public</span>
            </label>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-600 neo-border border-red-200">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {/* Actions */}
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
                disabled={creating}
                className="neo-btn flex-[2] flex items-center justify-center gap-2 rounded-xl bg-dark text-white hover:bg-neon hover:text-dark disabled:opacity-50"
              >
                {creating ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FolderPlus size={20} />
                    Confirm Create
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
