import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Restaurant, Notification as NotificationType, Zone } from './types';
import { RestaurantCard } from './components/RestaurantCard';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { Notification } from './components/Notification';
import { getTrafficData } from './services/geminiService';
import { INITIAL_RESTAURANTS, TRAFFIC_ANALYSIS_INTERVAL } from './constants';

const App: React.FC = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [timeToNextUpdate, setTimeToNextUpdate] = useState(TRAFFIC_ANALYSIS_INTERVAL);
    const notificationIdCounter = useRef(0);

    const getTimeAdjustment = (score: number): number => {
        if (score >= 9) return 20;
        if (score === 8) return 15;
        if (score === 7) return 10;
        if (score === 6) return 5;
        return 0;
    };

    const fetchAndProcessTrafficData = useCallback(async () => {
        setIsLoading(true);

        const allZones = restaurants.flatMap(r => r.zones);
        const trafficData = await getTrafficData(allZones);

        const newNotifications: NotificationType[] = [];

        setRestaurants(prevRestaurants => {
            return prevRestaurants.map(restaurant => ({
                ...restaurant,
                zones: restaurant.zones.map(zone => {
                    const newData = trafficData.find(d => d.zoneId === zone.id);
                    if (!newData) return zone;

                    const newScore = newData.trafficScore;
                    const oldScore = zone.currentTrafficScore;

                    const oldAdjustment = getTimeAdjustment(oldScore);
                    const newAdjustment = getTimeAdjustment(newScore);

                    if (newAdjustment > oldAdjustment) {
                        newNotifications.push({
                            id: notificationIdCounter.current++,
                            zoneName: zone.name,
                            message: `Пробка ${newScore} баллов 🟠. Увеличьте тикет на ${newAdjustment} мин.`,
                            type: 'increase',
                        });
                    } else if (newAdjustment < oldAdjustment) {
                         newNotifications.push({
                            id: notificationIdCounter.current++,
                            zoneName: zone.name,
                            message: `Пробка ${newScore} балла ✅. Корректировка ${newAdjustment > 0 ? `+${newAdjustment}` : '0'} мин.`,
                            type: 'decrease',
                        });
                    }

                    return {
                        ...zone,
                        previousTrafficScore: oldScore,
                        currentTrafficScore: newScore,
                    };
                }),
            }));
        });
        
        setNotifications(prev => [...newNotifications, ...prev]);
        setLastUpdated(new Date());
        setIsLoading(false);
        setTimeToNextUpdate(TRAFFIC_ANALYSIS_INTERVAL);
    }, [restaurants]);

    useEffect(() => {
        fetchAndProcessTrafficData();
        const intervalId = setInterval(fetchAndProcessTrafficData, TRAFFIC_ANALYSIS_INTERVAL);

        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isLoading) return;

        const timer = setInterval(() => {
            setTimeToNextUpdate(prev => (prev > 1000 ? prev - 1000 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [isLoading]);

    const dismissNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            {isLoading && <Loader />}
            
            <div
                aria-live="assertive"
                className="fixed inset-0 flex flex-col items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-end z-50 space-y-4"
            >
                {notifications.map(n => (
                    <Notification key={n.id} notification={n} onDismiss={dismissNotification} />
                ))}
            </div>

            <Header 
                lastUpdated={lastUpdated} 
                isLoading={isLoading} 
                onRefresh={fetchAndProcessTrafficData} 
                timeToNextUpdate={timeToNextUpdate}
            />

            <main className="container mx-auto p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {restaurants.map(restaurant => (
                        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default App;