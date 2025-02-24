import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Search, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TimeSlots from '../components/HallBooking/TimeSlots';
import HallList from '../components/HallBooking/HallList';
import { getDepartment, getAvailableHalls, getHallsByDepartment } from '../utils/HallsModel';

const BookingPage = () => {
  const navigate = useNavigate();
  const { deptId } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [availableHalls, setAvailableHalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState(null);
  const [departmentHalls, setDepartmentHalls] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHalls, setFilteredHalls] = useState([]);

  // Load department data and all halls for this department
  useEffect(() => {
    const deptInfo = getDepartment(Number(deptId));
    setDepartment(deptInfo);
    
    // Get all halls for this department (regardless of availability)
    const halls = getHallsByDepartment(Number(deptId));
    setDepartmentHalls(halls);
  }, [deptId]);

  // Load available halls when date or time slot changes
  useEffect(() => {
    if (selectedDate && selectedTimeSlot) {
      setLoading(true);
      
      getAvailableHalls(Number(deptId), selectedDate, selectedTimeSlot)
        .then(halls => {
          setAvailableHalls(halls);
          setFilteredHalls(halls);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching halls:", error);
          setLoading(false);
        });
    }
  }, [deptId, selectedDate, selectedTimeSlot]);

  // Filter halls based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredHalls(availableHalls);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = availableHalls.filter(hall => 
      hall.name.toLowerCase().includes(query) || 
      hall.facilities.some(facility => facility.toLowerCase().includes(query)) ||
      hall.description.toLowerCase().includes(query) ||
      hall.location.toLowerCase().includes(query)
    );
    
    setFilteredHalls(filtered);
  }, [searchQuery, availableHalls]);

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to Departments</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">
                {department?.name || 'Department'} Booking
              </h1>
              <p className="text-gray-600">Find and book available halls for your events</p>
              {department?.bookingRules && (
                <p className="text-sm text-orange-600 mt-2">
                  Note: {department.bookingRules}
                </p>
              )}
            </div>
            
            <div className="mt-4 md:mt-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search halls..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
        
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 ${department?.color ? `border-l-4 border-l-${department.color}-500` : ''}`}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <span className="text-sm text-gray-500 block">Date</span>
                <span className="font-medium">{formatDate(selectedDate)}</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <span className="text-sm text-gray-500 block">Time Slot</span>
                <span className="font-medium">{selectedTimeSlot || 'Not selected'}</span>
              </div>
            </div>
            
            {filteredHalls.length > 0 && (
              <div className="flex items-center ml-auto">
                <span className="text-sm bg-green-100 text-green-800 py-1 px-3 rounded-full">
                  {filteredHalls.length} hall{filteredHalls.length !== 1 ? 's' : ''} available
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-4">Select Time Slot</h2>
              <TimeSlots
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedTimeSlot={selectedTimeSlot}
                setSelectedTimeSlot={setSelectedTimeSlot}
                departmentHalls={departmentHalls}
              />
              
              {availableHalls.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter by Facility
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(availableHalls.flatMap(hall => hall.facilities))).map(facility => (
                      <button
                        key={facility}
                        onClick={() => setSearchQuery(facility)}
                        className="text-xs py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded-full"
                      >
                        {facility}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-4">Available Halls</h2>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredHalls.length > 0 ? (
                <HallList
                  halls={filteredHalls}
                  selectedDate={selectedDate}
                  selectedTimeSlot={selectedTimeSlot}
                />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {searchQuery ? (
                    <>
                      <p className="mb-2">No halls match your search criteria.</p>
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="text-blue-500 hover:underline"
                      >
                        Clear search
                      </button>
                    </>
                  ) : (
                    <p>No halls available for the selected time. Please try another date or time slot.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingPage;