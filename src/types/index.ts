export type AirLevel = 'clean' | 'moderate' | 'dense';

export interface Reading {
  id: string;
  level: AirLevel;
  ppm: number;
  timestamp: number; // Date.now()
}

export interface Settings {
  moderateStart: number;
  denseAlert: number;
  pushNotifications: boolean;
  autoCleaning: boolean;
}