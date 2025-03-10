import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle } from 'lucide-react';

const BookingStatus = () => {
  const navigate = useNavigate();

  // Dummy data for approved bookings
  const approvedBookings = [
    {
      id: 1,
      hall_name: 'Main Conference Hall',
      event_name: 'Annual Staff Meeting',
      booking_date: '2024-03-15',
      start_time: '10:00 AM',
      end_time: '12:00 PM',
      status: 'approved'
    },
    {
      id: 2,
      hall_name: 'Seminar Room A',
      event_name: 'Training Workshop',
      booking_date: '2024-04-02',
      start_time: '02:00 PM',
      end_time: '05:00 PM',
      status: 'approved'
    },
    {
      id: 3,
      hall_name: 'Board Room',
      event_name: 'Client Presentation',
      booking_date: '2024-03-22',
      start_time: '11:00 AM',
      end_time: '01:00 PM',
      status: 'approved'
    }
  ];

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      {/* Back Button */}
      <button 
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      <h1 className="text-3xl font-bold text-center mb-8">Approved Bookings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {approvedBookings.map((booking) => (
          <div 
            key={booking.id} 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <Calendar className="h-8 w-8 text-green-600 mr-3" />
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{booking.hall_name}</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Event:</strong> {booking.event_name}</p>
              <p><strong>Date:</strong> {formatDate(booking.booking_date)}</p>
              <p><strong>Start Time:</strong> {booking.start_time}</p>
              <p><strong>End Time:</strong> {booking.end_time}</p>
              <p><strong>Status:</strong> 
                <span className="text-green-600 font-bold ml-2">Approved</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingStatus;