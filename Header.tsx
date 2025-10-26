import React from 'react';

interface HeaderProps {
    lastUpdated: Date | null;
    isLoading: boolean;
    onRefresh: () => void;
    timeToNextUpdate: number;
}

export const Header: React.FC<HeaderProps> = ({ lastUpdated, isLoading, onRefresh, timeToNextUpdate }) => {
    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    
    return (
        <header className="bg-gray-800 shadow-lg p-4 sticky top-0 z-20">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-3">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-10h2v5h-2zm0 6h2v2h-2z"/>
                    </svg>
                    <h1 className="text-xl md:text-2xl font-bold text-white">Анализатор Пробок Доставки</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-right text-sm text-gray-400 hidden sm:block">
                        <div>
                            <span>Последнее обновление: </span>
                            <span className="font-semibold text-gray-300">
                                {lastUpdated ? lastUpdated.toLocaleTimeString('ru-RU') : 'Загрузка...'}
                            </span>
                        </div>
                         <div>
                            <span>Следующее через: </span>
                            <span className="font-semibold text-gray-300">
                                {isLoading ? '...' : formatTime(timeToNextUpdate)}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="p-2 rounded-full bg-gray-700 text-white hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
                        aria-label="Обновить данные"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M20 4h-5v5M4 20h5v-5M12 4V2M12 22v-2M20 12h2M2 12h2" opacity="0.2" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16a4 4 0 100-8 4 4 0 000 8z" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};