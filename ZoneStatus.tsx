import React from 'react';
import { Zone } from '../types';

interface ZoneStatusProps {
  zone: Zone;
}

const TrafficScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  const getColor = () => {
    if (score <= 4) return 'bg-green-500 text-green-900';
    if (score <= 6) return 'bg-yellow-400 text-yellow-900';
    if (score <= 8) return 'bg-orange-500 text-orange-900';
    return 'bg-red-600 text-red-100';
  };

  const scoreText = score === 10 ? 'MAX' : score;

  return (
    <div className={`flex items-center justify-center w-12 h-12 rounded-full font-extrabold text-2xl ${getColor()}`}>
      {scoreText}
    </div>
  );
};

const TrendIcon: React.FC<{ current: number; previous: number }> = ({ current, previous }) => {
    if (current > previous) {
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" /></svg>;
    }
    if (current < previous) {
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.707-4.293l3-3a1 1 0 00-1.414-1.414L10 10.586 8.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0z" clipRule="evenodd" /></svg>;
    }
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 9a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm1 4a1 1 0 100 2h2a1 1 0 100-2H9z" clipRule="evenodd" /></svg>;
};

export const ZoneStatus: React.FC<ZoneStatusProps> = ({ zone }) => {
  const getTimeAdjustment = (score: number) => {
    if (score >= 9) return 20;
    if (score === 8) return 15;
    if (score === 7) return 10;
    if (score === 6) return 5;
    return 0;
  };

  const timeAdjustment = getTimeAdjustment(zone.currentTrafficScore);
  const recommendedTime = zone.baseDeliveryTime + timeAdjustment;

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg flex items-center justify-between hover:bg-gray-700/50 transition-colors duration-200">
      <div className="flex items-center space-x-4">
        <span className={`w-3 h-10 rounded ${zone.color}`}></span>
        <div>
          <h4 className="font-semibold text-white">{zone.name}</h4>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Пробки:</span>
            <TrendIcon current={zone.currentTrafficScore} previous={zone.previousTrafficScore} />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="text-right">
          <p className="text-sm text-gray-400">Эталон</p>
          <p className="text-lg font-bold text-gray-300">{zone.baseDeliveryTime} мин</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-cyan-400">Тикет</p>
          <p className={`text-xl font-bold ${recommendedTime > zone.baseDeliveryTime ? 'text-amber-400' : 'text-cyan-300'}`}>
            {recommendedTime} мин
          </p>
        </div>
        <TrafficScoreBadge score={zone.currentTrafficScore} />
      </div>
    </div>
  );
};