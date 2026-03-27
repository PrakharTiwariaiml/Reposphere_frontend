import { useState } from 'react';
import { X, Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadNote } from '../api/api';

/**
 * Modal component for uploading files to the Reposphere.
 */
/**
 * Modal component for uploading files to the Reposphere.
 */
export default function UploadModal({ isOpen, onClose, onUploadSuccess, folderId, folderName }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds the 50MB limit. Please upload a smaller file.');
      return;
    }
    if (!folderId) {
      setError('Please select a repository to upload this file to.');
      return;
    }

    setUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderId', folderId);
    if (title.trim()) {
      formData.append('title', title.trim());
    }

    try {
      await uploadNote(formData);
      setSuccess(true);
        setTimeout(() => {
          onUploadSuccess();
          onClose();
          // Reset state
          setFile(null);
          setTitle('');
          setSuccess(false);
        }, 1500);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data || 'Failed to upload. Please try again.');
    } finally {
      setUploading(false);
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
          Upload <span className="bg-neon px-2 neo-shadow">New File</span>
        </h2>

        {success ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
            <CheckCircle2 size={64} className="text-green-500 animate-bounce" />
            <p className="text-xl font-bold text-dark italic">Uploaded successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Folder Info */}
            {folderId ? (
              <div className="rounded-xl bg-neon/10 p-3 neo-border border-neon/30 text-sm font-bold text-dark/70 flex items-center gap-2">
                <span className="text-neon">📁</span>
                Uploading to: <span className="text-dark">{folderName || `Repo #${folderId}`}</span>
              </div>
            ) : (
              <div className="rounded-xl bg-orange-50 p-3 neo-border border-orange-200 text-sm font-bold text-orange-700">
                ⚠️ Please open a repository first, then upload from inside it.
              </div>
            )}

            {/* Title Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-dark/60">Note Title (Optional)</label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Lecture 1 - Introduction"
                className="neo-border rounded-xl bg-neutral-100 px-4 py-3 text-dark focus:bg-white focus:outline-none transition-colors"
                disabled={uploading}
              />
            </div>

            {/* File Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-dark/60">Upload File</label>
              <div className="relative">
                <input 
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                />
                <div className="neo-border flex items-center gap-3 rounded-xl bg-neutral-100 px-4 py-3 text-dark border-dashed border-2">
                  <Upload size={20} className="text-dark/40" />
                  <span className="truncate text-sm font-bold">
                    {file ? file.name : 'Select PDF, Doc, or Image...'}
                  </span>
                </div>
                <p className="mt-1 text-[10px] font-bold text-dark/40 uppercase tracking-widest">
                  Maximum file size: <span className="text-dark">50MB</span>
                </p>
              </div>
            </div>

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
                disabled={uploading}
                className="neo-btn flex-[2] flex items-center justify-center gap-2 rounded-xl bg-dark text-white hover:bg-neon hover:text-dark disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Confirm Upload'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
