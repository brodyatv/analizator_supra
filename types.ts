export type Coordinate = [number, number]; // [longitude, latitude]

export interface Zone {
  id: string;
  name: string;
  color: string;
  baseDeliveryTime: number;
  currentTrafficScore: number;
  previousTrafficScore: number;
  polygon: Coordinate[];
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  zones: Zone[];
}

export interface Notification {
  id: number;
  message: string;
  type: 'increase' | 'decrease' | 'info';
  zoneName: string;
}
