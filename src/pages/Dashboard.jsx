import { useEffect, useState, useCallback } from 'react';
import { Plus, Loader2, LogOut, Upload, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchMyFolders, deleteFolder, deleteNote } from '../api/api';
import NoteCard from '../components/NoteCard';
import Calendar from '../components/Calendar';
import UploadModal from '../components/UploadModal';
import CreateFolderModal from '../components/CreateFolderModal';
import RenameFolderModal from '../components/RenameFolderModal';

export default function Dashboard() {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [folderToRename, setFolderToRename] = useState(null);
  
  // Track the currently open folder object (null = root view)
  const [currentFolder, setCurrentFolder] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    console.log('Fetching folders...');
    try {
      const foldersData = await fetchMyFolders();
      console.log('Fetched folders:', foldersData);
      
      if (Array.isArray(foldersData)) {
        setFolders(foldersData);
        if (currentFolder) {
          const refreshed = foldersData.find(f => f.id === currentFolder.id);
          setCurrentFolder(refreshed || null);
        }
      } else {
        console.error('Expected array for foldersData but got:', foldersData);
        setFolders([]);
        setError('Received unexpected data format from server.');
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      const msg = err.response?.data?.message || err.response?.data || err.message;
      setError(`Failed to connect to backend: ${msg}`);
    } finally {
      setLoading(false);
    }
  }, [currentFolder?.id]);

  useEffect(() => {
    loadData();
  }, []); // Load once on mount; manual refresh via loadData()

  const handleLogout = () => {
    // Redirect to home page (which acts as the login page)
    // Note: Backend handles session invalidation usually.
    navigate('/');
  };

  const handleDeleteFolder = async (id) => {
    try {
      await deleteFolder(id);
      // If we deleted the folder we're currently in, go back to root
      if (currentFolder?.id === id) setCurrentFolder(null);
      loadData();
    } catch (err) {
      console.error('Failed to delete folder:', err);
      alert('Failed to delete folder: ' + (err.response?.data || err.message));
    }
  };

  const handleRenameTrigger = (id, name) => {
    setFolderToRename({ id, name });
    setIsRenameModalOpen(true);
  };

  const handleDeleteNote = async (id) => {
    try {
      await deleteNote(id);
      loadData();
    } catch (err) {
      console.error('Failed to delete note:', err);
      alert('Failed to delete note: ' + (err.response?.data || err.message));
    }
  };

  const handleOpenFolder = (folder) => {
    setCurrentFolder(folder);
  };

  const handleGoBack = () => {
    setCurrentFolder(null);
  };

  // What to render in the grid depends on whether we're at root or inside a folder
  const gridItems = currentFolder
    ? (currentFolder.notes || []).map(note => ({ ...note, _type: 'note' }))
    : folders.map(folder => ({ ...folder, _type: 'folder' }));

  // Derive a human-readable name from a fileUrl
  const getNoteName = (note) => {
    if (note.title) return note.title;
    const fileUrl = note.fileUrl;
    if (!fileUrl) return 'Unnamed File';
    try {
      const decoded = decodeURIComponent(fileUrl.split('/').pop().split('?')[0]);
      return decoded || 'Unnamed File';
    } catch {
      return 'Unnamed File';
    }
  };

  return (
    <div className="min-h-screen bg-neutral p-6 md:p-12">
      <div className="mx-auto max-w-7xl relative">
        {/* Dashboard Header */}
        <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold tracking-tight text-dark md:text-5xl">
              {currentFolder ? (
                <>
                  <span className="inline-block rounded-xl bg-neon px-3 py-1 neo-shadow">
                    {currentFolder.folderName}
                  </span>
                </>
              ) : (
                <>
                  My{' '}
                  <span className="inline-block rounded-xl bg-neon px-3 py-1 neo-shadow">
                    Repositories
                  </span>
                </>
              )}
            </h1>
            <p className="max-w-md text-lg text-dark/60">
              {currentFolder
                ? `${(currentFolder.notes || []).length} file(s) in this repository`
                : 'Manage and access your academic materials in one place.'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {currentFolder ? (
              <>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="neo-btn flex items-center gap-2 rounded-xl bg-dark text-white hover:bg-neon hover:text-dark transition-colors duration-200"
                >
                  <Upload size={20} />
                  Upload File
                </button>
                <button
                  onClick={handleGoBack}
                  className="neo-btn flex items-center gap-2 rounded-xl bg-white text-dark hover:bg-neutral transition-colors duration-200"
                >
                  <ArrowLeft size={20} />
                  Back
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsCreateFolderModalOpen(true)}
                  className="neo-btn flex items-center gap-2 rounded-xl bg-white text-dark hover:bg-neutral transition-colors duration-200"
                >
                  <Plus size={20} />
                  Create Repo
                </button>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="neo-btn flex items-center gap-2 rounded-xl bg-dark text-white hover:bg-neon hover:text-dark transition-colors duration-200"
                >
                  <Upload size={20} />
                  Upload File
                </button>
              </>
            )}
            <button
              onClick={handleLogout}
              className="neo-border rounded-xl bg-white p-3 hover:bg-neutral-200 transition-colors"
              title="Log Out"
            >
              <LogOut size={20} className="text-dark" />
            </button>
          </div>
        </header>

        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          {/* ── Left Content: Grid ── */}
          <div className="flex-1 flex flex-col gap-8">
            {loading && gridItems.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center gap-4 text-dark/60">
                <Loader2 size={42} className="animate-spin text-neon" />
                <p className="text-xl font-bold italic">Loading your hub...</p>
              </div>
            ) : error ? (
              <div className="neo-border rounded-2xl bg-red-50 p-12 text-center text-red-600">
                <p className="font-bold text-xl mb-2">Error Loading Data</p>
                <p className="text-sm opacity-80 mb-6">{error}</p>
                <button 
                  onClick={loadData} 
                  className="neo-btn rounded-xl bg-white px-6 py-2 text-sm font-bold hover:bg-neutral"
                >
                  Retry Connection
                </button>
              </div>
            ) : gridItems.length === 0 ? (
              /* Empty State */
              <div className="neo-border border-dashed border-4 flex flex-col items-center justify-center rounded-[45px] bg-[#EAEAEA] py-24 px-6 text-center shadow-lg">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white neo-border shadow-md">
                  {currentFolder ? (
                    <FileText size={40} className="text-dark/20" />
                  ) : (
                    <Plus size={40} className="text-dark/20" />
                  )}
                </div>
                <h2 className="mb-2 text-2xl font-bold text-dark">
                  {currentFolder ? 'This repository is empty.' : 'No repositories found.'}
                </h2>
                <p className="mb-8 max-w-sm text-dark/60 text-lg">
                  {currentFolder
                    ? 'Upload your first file to this repo!'
                    : 'Start by creating your first academic hub!'}
                </p>
                <button
                  onClick={() => currentFolder ? setIsUploadModalOpen(true) : setIsCreateFolderModalOpen(true)}
                  className="neo-btn rounded-xl bg-neon hover:brightness-95"
                >
                  {currentFolder ? `Upload to ${currentFolder.folderName}` : 'Create First Repo'}
                </button>
              </div>
            ) : (
              /* Grid */
              <div className="grid gap-6 sm:grid-cols-2">
                {gridItems.map((item) =>
                  item._type === 'folder' ? (
                    <NoteCard
                      key={`folder-${item.id}`}
                      id={item.id}
                      title={item.folderName}
                      isPublic={item.public}
                      type="folder"
                      noteCount={(item.notes || []).length}
                      onClick={() => handleOpenFolder(item)}
                      onDelete={handleDeleteFolder}
                      onRename={handleRenameTrigger}
                    />
                  ) : (
                    <NoteCard
                      key={`note-${item.id}`}
                      id={item.id}
                      title={getNoteName(item)}
                      fileUrl={item.fileUrl}
                      isPublic={currentFolder?.public}
                      type="note"
                      onDelete={handleDeleteNote}
                    />
                  )
                )}
              </div>
            )}
          </div>

          {/* ── Right Content: Sidebar Calendar ── */}
          <aside className="w-full lg:w-[400px]">
            <div className="sticky top-28">
              <Calendar />
            </div>
          </aside>
        </div>

        {/* Upload Modal — only shown when inside a folder */}
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUploadSuccess={() => {
            setIsUploadModalOpen(false);
            loadData();
          }}
          folderId={currentFolder?.id ?? null}
          folderName={currentFolder?.folderName ?? null}
        />

        {/* Create Folder Modal */}
        <CreateFolderModal
          isOpen={isCreateFolderModalOpen}
          onClose={() => setIsCreateFolderModalOpen(false)}
          onCreateSuccess={loadData}
        />

        {/* Rename Folder Modal */}
        {folderToRename && (
          <RenameFolderModal
            isOpen={isRenameModalOpen}
            folderId={folderToRename.id}
            folderName={folderToRename.name}
            onClose={() => {
              setIsRenameModalOpen(false);
              setFolderToRename(null);
            }}
            onRenameSuccess={loadData}
          />
        )}
      </div>
    </div>
  );
}
