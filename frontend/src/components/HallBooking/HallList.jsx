// components/HallBooking/HallList.jsx
import React from 'react';
import { Building2 } from 'lucide-react';

const HallList = ({ halls, selectedDate, selectedTimeSlot }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <Building2 className="h-5 w-5 text-blue-600 mr-2" />
        <h2 className="text-lg font-semibold">Available Halls</h2>
      </div>
      
      {selectedDate && selectedTimeSlot ? (
        <div className="space-y-4">
          {halls.map((hall) => (
            <div
              key={hall.id}
              className="p-4 border rounded-md hover:border-blue-500 cursor-pointer"
            >
              <h3 className="font-semibold">{hall.name}</h3>
              <p className="text-sm text-gray-600">Capacity: {hall.capacity}</p>
              <p className="text-sm text-gray-600">
                Facilities: {hall.facilities.join(', ')}
              </p>
              <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Book Now
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">
          Please select date and time to view available halls
        </p>
      )}
    </div>
  );
};

export default HallList;
