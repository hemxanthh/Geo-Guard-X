import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Navigation, Filter, Search } from 'lucide-react';
import { Trip } from '../../types';
import { formatDistance, formatDuration } from 'date-fns';
import { clsx } from 'clsx';

// Demo trip data
const demoTrips: Trip[] = [
  {
    id: '1',
    vehicleId: 'vehicle-1',
    startLocation: { latitude: 28.6139, longitude: 77.2090, timestamp: new Date('2024-01-20T09:00:00') },
    endLocation: { latitude: 28.5355, longitude: 77.3910, timestamp: new Date('2024-01-20T10:30:00') },
    startTime: new Date('2024-01-20T09:00:00'),
    endTime: new Date('2024-01-20T10:30:00'),
    distance: 25.4,
    duration: 90, // minutes
    maxSpeed: 65,
    avgSpeed: 42,
    route: [],
    status: 'completed',
    fuelConsumed: 2.1,
  },
  {
    id: '2',
    vehicleId: 'vehicle-1',
    startLocation: { latitude: 28.5355, longitude: 77.3910, timestamp: new Date('2024-01-20T14:15:00') },
    endLocation: { latitude: 28.6600, longitude: 77.2300, timestamp: new Date('2024-01-20T15:45:00') },
    startTime: new Date('2024-01-20T14:15:00'),
    endTime: new Date('2024-01-20T15:45:00'),
    distance: 18.7,
    duration: 90,
    maxSpeed: 58,
    avgSpeed: 35,
    route: [],
    status: 'completed',
    fuelConsumed: 1.5,
  },
  {
    id: '3',
    vehicleId: 'vehicle-1',
    startLocation: { latitude: 28.6600, longitude: 77.2300, timestamp: new Date('2024-01-19T08:30:00') },
    endLocation: { latitude: 28.7041, longitude: 77.1025, timestamp: new Date('2024-01-19T09:15:00') },
    startTime: new Date('2024-01-19T08:30:00'),
    endTime: new Date('2024-01-19T09:15:00'),
    distance: 12.3,
    duration: 45,
    maxSpeed: 72,
    avgSpeed: 38,
    route: [],
    status: 'completed',
    fuelConsumed: 1.0,
  },
];

const TripHistory: React.FC = () => {
  const [trips] = useState<Trip[]>(demoTrips);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = searchTerm === '' || 
      trip.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = dateFilter === 'all' || (() => {
      const tripDate = new Date(trip.startTime);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);

      switch (dateFilter) {
        case 'today':
          return tripDate.toDateString() === today.toDateString();
        case 'yesterday':
          return tripDate.toDateString() === yesterday.toDateString();
        case 'week':
          return tripDate >= lastWeek;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesDate;
  });

  const totalDistance = trips.reduce((sum, trip) => sum + trip.distance, 0);
  const totalTrips = trips.length;
  const avgDistance = totalDistance / totalTrips;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trip History</h1>
          <p className="text-gray-600 mt-1">View and analyze your travel patterns</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Navigation className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{totalTrips}</h3>
              <p className="text-gray-600 font-medium">Total Trips</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{totalDistance.toFixed(1)} km</h3>
              <p className="text-gray-600 font-medium">Total Distance</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{avgDistance.toFixed(1)} km</h3>
              <p className="text-gray-600 font-medium">Avg per Trip</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search trips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
            />
          </div>

          {/* Date Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 w-4 h-4" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last Week</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trip List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Trips</h2>
          <p className="text-sm text-gray-500 mt-1">{filteredTrips.length} trips found</p>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className={clsx(
                'p-6 hover:bg-gray-50 transition-colors cursor-pointer',
                selectedTrip?.id === trip.id && 'bg-blue-50 border-r-4 border-blue-600'
              )}
              onClick={() => setSelectedTrip(selectedTrip?.id === trip.id ? null : trip)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {trip.startTime.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {trip.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        {trip.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Distance</div>
                      <div className="font-semibold text-gray-900">{trip.distance} km</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Duration</div>
                      <div className="font-semibold text-gray-900">{trip.duration} min</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Max Speed</div>
                      <div className="font-semibold text-gray-900">{trip.maxSpeed} km/h</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Avg Speed</div>
                      <div className="font-semibold text-gray-900">{trip.avgSpeed} km/h</div>
                    </div>
                  </div>
                </div>

                <div className="ml-4">
                  <div className={clsx(
                    'px-3 py-1 rounded-full text-xs font-medium',
                    trip.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  )}>
                    {trip.status === 'completed' ? 'Completed' : 'Active'}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedTrip?.id === trip.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Route Details</h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">Start Location</div>
                            <div className="text-sm text-gray-500">
                              {trip.startLocation.latitude.toFixed(6)}, {trip.startLocation.longitude.toFixed(6)}
                            </div>
                            <div className="text-xs text-gray-400">
                              {trip.startTime.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full mt-1"></div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">End Location</div>
                            <div className="text-sm text-gray-500">
                              {trip.endLocation.latitude.toFixed(6)}, {trip.endLocation.longitude.toFixed(6)}
                            </div>
                            <div className="text-xs text-gray-400">
                              {trip.endTime.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Trip Statistics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Fuel Used</div>
                          <div className="text-lg font-semibold text-gray-900">{trip.fuelConsumed}L</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Efficiency</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {(trip.fuelConsumed! / trip.distance * 100).toFixed(1)}L/100km
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredTrips.length === 0 && (
          <div className="p-12 text-center">
            <Navigation className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-500">Try adjusting your search or date filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripHistory;