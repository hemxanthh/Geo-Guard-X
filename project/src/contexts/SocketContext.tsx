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

    // UPDATED: Fixed coordinates (no movement)
    const baseLocation = {
      latitude: 12.917861, // Your static lat
      longitude: 77.591750, // Your static long
    };

    // UPDATED: Removed random movement; keep location fixed
    const generateDemoData = () => {
      const demoVehicleId = 'vehicle-1';
      
      const newLocation = {
        ...baseLocation,
        speed: 0,                  // UPDATED: vehicle not moving
        heading: 0,                // UPDATED: fixed direction
        timestamp: new Date(),
      };

      const newStatus: VehicleStatus = {
        vehicleId: demoVehicleId,
        location: newLocation,
        ignitionOn: false,         // UPDATED: static ignition
        engineLocked: false,       // UPDATED: static engine state
        batteryLevel: 80,
        gsmSignal: 90,
        gpsSignal: 95,
        isMoving: false,           // UPDATED: not moving
        lastUpdate: new Date(),
        temperature: 28,
        mileage: 45231,
      };

      setVehicleStatus(prev => ({
        ...prev,
        [demoVehicleId]: newStatus,
      }));

      // Alert generation remains for demo
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

    // Interval remains to simulate periodic updates
    interval = setInterval(generateDemoData, 3000);
    generateDemoData();

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
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Math.random() > 0.2;
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
