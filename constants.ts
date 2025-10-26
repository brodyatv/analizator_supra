import { Restaurant } from './types';
import { parseMapData } from './services/mapDataParser';

/**
 * ПРИМЕЧАНИЕ: Данные о ресторанах теперь генерируются динамически
 * на основе точных GeoJSON-данных, импортированных напрямую с карты.
 * Это обеспечивает 100% соответствие полигонов и названий.
 * Вся логика парсинга находится в `services/mapDataParser.ts`.
 */
export const INITIAL_RESTAURANTS: Restaurant[] = parseMapData();

export const TRAFFIC_ANALYSIS_INTERVAL = 30 * 60 * 1000; // 30 minutes
export const NORMAL_TRAFFIC_SCORE = 4;
