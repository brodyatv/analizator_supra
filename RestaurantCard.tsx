
import React from 'react';
import { Restaurant } from '../types';
import { ZoneStatus } from './ZoneStatus';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
      <div className="p-5 bg-gray-900/50">
        <h3 className="text-2xl font-bold text-white">{restaurant.name}</h3>
        <p className="text-gray-400">{restaurant.address}</p>
      </div>
      <div className="p-2 md:p-4 space-y-2">
        {restaurant.zones.map((zone) => (
          <ZoneStatus key={zone.id} zone={zone} />
        ))}
      </div>
    </div>
  );
};
