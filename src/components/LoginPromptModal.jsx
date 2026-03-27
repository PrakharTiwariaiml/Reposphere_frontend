import { X, Lock, LogIn } from 'lucide-react';
import { BASE_SERVER_URL } from '../api/api';

/**
 * A sleek, neo-brutalist modal to prompt users to login.
 */
export default function LoginPromptModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div 
        className="neo-border w-full max-w-md rounded-[45px] bg-white p-10 shadow-2xl relative animate-in zoom-in duration-200"
        style={{ boxShadow: '20px 20px 0 0 #191A23' }}
      >
        <button 
          onClick={onClose}
          className="absolute right-8 top-8 rounded-full p-2 hover:bg-neutral transition-colors"
        >
          <X size={24} className="text-dark" />
        </button>

        <div className="flex flex-col items-center text-center gap-6">
          <div className="h-20 w-20 rounded-3xl bg-neon flex items-center justify-center neo-border rotate-6 shadow-lg">
            <Lock size={40} className="text-dark" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-dark">
              Unlock <span className="bg-neon px-2">Knowledge</span>
            </h2>
            <p className="text-dark/60 font-medium leading-relaxed">
              You need to be logged in to access this material, download notes, and join our academic community.
            </p>
          </div>

          <div className="flex w-full flex-col gap-4 mt-4">
            <a
              href={`${BASE_SERVER_URL}/oauth2/authorization/google`}
              className="neo-btn flex items-center justify-center gap-2 rounded-xl bg-dark py-4 text-white hover:bg-neon hover:text-dark transition-all duration-300 font-bold"
            >
              <LogIn size={20} />
              Login with Google
            </a>
            <button
              onClick={onClose}
              className="text-sm font-bold text-dark/40 hover:text-dark transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
