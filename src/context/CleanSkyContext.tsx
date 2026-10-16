import {
  createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AirLevel, Reading, Settings } from '@/types';
import { classify } from '@/utils/airQuality';

const SETTINGS_KEY = '@cleansky:settings';

const defaultSettings: Settings = {
  moderateStart: 596,
  denseAlert: 910,
  pushNotifications: true,
  autoCleaning: true,
};

interface CleanSkyContextData {
  readings: Reading[];
  current?: Reading;
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  purifierOn: boolean;
  togglePurifier: () => void;
  alertVisible: boolean;
  dismissAlert: () => void;
}

const CleanSkyContext = createContext<CleanSkyContextData>({} as CleanSkyContextData);

function makeReading(ppm: number, timestamp: number, s: Settings): Reading {
  return { id: `${timestamp}-${ppm}`, ppm, timestamp, level: classify(ppm, s) };
}

export function CleanSkyProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [purifierOn, setPurifierOn] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const ppmRef = useRef(250);
  const lastLevel = useRef<AirLevel>('clean');

  // carrega os ajustes salvos no celular
  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then((raw) => {
      if (raw) setSettings({ ...defaultSettings, ...JSON.parse(raw) });
    });
  }, []);

  useEffect(() => {
    // histórico inicial (20 leituras, uma por minuto, para o gráfico não nascer vazio)
    const now = Date.now();
    const seed: Reading[] = [];
    for (let i = 20; i > 0; i--) {
      ppmRef.current += (300 - ppmRef.current) * 0.1 + (Math.random() - 0.5) * 80;
      seed.push(makeReading(Math.round(ppmRef.current), now - i * 60000, settingsRef.current));
    }
    setReadings(seed);

    // SIMULAÇÃO: troque este bloco pela leitura real do ESP32/Firebase depois
    const timer = setInterval(() => {
      const spike = Math.random() < 0.06 ? 450 : 0;
      ppmRef.current += (300 - ppmRef.current) * 0.1 + (Math.random() - 0.5) * 120 + spike;
      ppmRef.current = Math.min(1000, Math.max(100, ppmRef.current));

      const s = settingsRef.current;
      const reading = makeReading(Math.round(ppmRef.current), Date.now(), s);
      setReadings((prev) => [...prev, reading].slice(-300));

      if (reading.level === 'dense' && lastLevel.current !== 'dense') {
        setAlertVisible(true);
        if (s.autoCleaning) setPurifierOn(true);
      }
      lastLevel.current = reading.level;
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <CleanSkyContext.Provider
      value={{
        readings,
        current: readings[readings.length - 1],
        settings,
        updateSettings,
        purifierOn,
        togglePurifier: () => setPurifierOn((v) => !v),
        alertVisible,
        dismissAlert: () => setAlertVisible(false),
      }}
    >
      {children}
    </CleanSkyContext.Provider>
  );
}

export const useCleanSky = () => useContext(CleanSkyContext);