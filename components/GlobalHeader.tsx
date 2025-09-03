
import React from 'react';
import SearchIcon from './icons/SearchIcon';
import DownloadIcon from './icons/DownloadIcon';
import UploadIcon from './icons/UploadIcon';
import BellIcon from './icons/BellIcon';

interface GlobalHeaderProps {
  onDownload: () => void;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  notificationCount: number;
  onBellClick: () => void;
}

const LogoIcon: React.FC = () => (
    <div className="w-8 h-8 bg-primary-accent rounded-lg flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    </div>
);

const HelpIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-secondary hover:text-text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
);


const GlobalHeader: React.FC<GlobalHeaderProps> = ({ onDownload, onUpload, notificationCount, onBellClick }) => {
    return (
        <header className="px-8 py-3 flex items-center justify-between bg-white border-b border-gray-200/90 sticky top-0 z-50">
            {/* Left Section */}
            <div className="flex items-center gap-3">
                <LogoIcon />
                <h1 className="text-xl font-bold text-text-primary">ProjectFlow Pro</h1>
            </div>

            {/* Center Section */}
            <div className="flex-1 flex justify-center px-8">
                <div className="relative w-full max-w-lg">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search tasks, projects, etc..."
                        className="w-full bg-background-start border border-gray-200/80 rounded-button py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-accent transition-all text-sm"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-5">
                <button onClick={onDownload} className="text-text-secondary hover:text-text-primary transition-colors" title="Download Data">
                    <DownloadIcon className="h-6 w-6" />
                </button>
                <label htmlFor="upload-file" className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer" title="Upload Data">
                    <UploadIcon className="h-6 w-6" />
                    <input type="file" id="upload-file" accept=".json" className="hidden" onChange={onUpload} />
                </label>
                <button onClick={onBellClick} className="relative" aria-label={`Notifications (${notificationCount} new)`}>
                    <BellIcon notificationCount={notificationCount} />
                </button>
                <button><HelpIcon /></button>
                <div className="w-9 h-9 rounded-full bg-primary-accent overflow-hidden cursor-pointer">
                    <img src="https://i.pravatar.cc/36?img=3" alt="User Avatar" />
                </div>
            </div>
        </header>
    );
};

export default GlobalHeader;