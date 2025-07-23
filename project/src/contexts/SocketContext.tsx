import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { VehicleStatus, Alert, Trip } from '../types';

interface SocketContextType {
  connected: boolean;
  vehicleStatus: Record<string, VehicleStatus>;
  alerts: Alert[];
  activeTrips: Trip[];
  subscribeToVehicle: (vehicleId: string) => void;
  unsubscribeFromVehicle: (vehicleId: string) => void;
  sendCommand: (vehicleId: string, command: string) => Promise<boolean>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [vehicleStatus, setVehicleStatus] = useState<Record<string, VehicleStatus>>({});
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeTrips, setActiveTrips] = useState<Trip[]>([]);
  const { user } = useAuth();

  // Simulate real-time data for demo
  useEffect(() => {
    if (!user) return;

    let interval: NodeJS.Timeout;
    
    // Simulate connection
    setConnected(true);

    // Generate demo data
    const generateDemoData = () => {
      const demoVehicleId = 'vehicle-1';
      const baseLocation = { latitude: 28.6139, longitude: 77.2090 };
      
      // Simulate vehicle movement
      const randomOffset = () => (Math.random() - 0.5) * 0.01;
      const newLocation = {
        latitude: baseLocation.latitude + randomOffset(),
        longitude: baseLocation.longitude + randomOffset(),
        speed: Math.random() * 60,
        heading: Math.random() * 360,
        timestamp: new Date(),
      };

      const newStatus: VehicleStatus = {
        vehicleId: demoVehicleId,
        location: newLocation,
        ignitionOn: Math.random() > 0.3,
        engineLocked: Math.random() > 0.8,
        batteryLevel: Math.floor(Math.random() * 40) + 60,
        gsmSignal: Math.floor(Math.random() * 30) + 70,
        gpsSignal: Math.floor(Math.random() * 20) + 80,
        isMoving: newLocation.speed > 5,
        lastUpdate: new Date(),
        temperature: Math.floor(Math.random() * 30) + 20,
        mileage: 45231 + Math.floor(Math.random() * 100),
      };

      setVehicleStatus(prev => ({
        ...prev,
        [demoVehicleId]: newStatus,
      }));

      // Occasionally generate alerts
      if (Math.random() > 0.95) {
        const alertTypes = ['unauthorized_movement', 'low_battery', 'geofence_breach'] as const;
        const severities = ['low', 'medium', 'high'] as const;
        
        const newAlert: Alert = {
          id: `alert-${Date.now()}`,
          vehicleId: demoVehicleId,
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          message: 'Demo alert generated',
          location: newLocation,
          timestamp: new Date(),
          isRead: false,
          severity: severities[Math.floor(Math.random() * severities.length)],
          acknowledged: false,
        };

        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
      }
    };

    // Update every 3 seconds for demo
    interval = setInterval(generateDemoData, 3000);
    generateDemoData(); // Initial data

    return () => {
      if (interval) clearInterval(interval);
      setConnected(false);
    };
  }, [user]);

  const subscribeToVehicle = (vehicleId: string) => {
    console.log(`Subscribed to vehicle: ${vehicleId}`);
  };

  const unsubscribeFromVehicle = (vehicleId: string) => {
    console.log(`Unsubscribed from vehicle: ${vehicleId}`);
  };

  const sendCommand = async (vehicleId: string, command: string): Promise<boolean> => {
    console.log(`Sending command ${command} to vehicle ${vehicleId}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Math.random() > 0.2; // 80% success rate
  };

  const value = {
    connected,
    vehicleStatus,
    alerts,
    activeTrips,
    subscribeToVehicle,
    unsubscribeFromVehicle,
    sendCommand,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};