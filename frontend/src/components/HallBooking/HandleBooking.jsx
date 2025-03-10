import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const HandleBooking = ({ onBookingSuccess, onBookingError }) => {
  const location = useLocation();
  const { hall, selectedDate, selectedTimeSlot } = location.state || {};
  
  const [formData, setFormData] = useState({
    department: '',
    hallForBooking: hall?.name || '',
    date: '',
    timeFrom: '',
    timeTo: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse and set the time values and date when component mounts
  useEffect(() => {
    if (selectedTimeSlot && selectedDate) {
      // Parse the selected date string back to a Date object
      const parsedDate = new Date(selectedDate);
      const formattedDate = parsedDate.toISOString().split('T')[0];
      
      // Parse the time slot string (e.g., "9:00 AM - 10:00 AM")
      const [startTime, endTime] = selectedTimeSlot.split(' - ');
      
      // Convert to 24-hour format for the form inputs
      const timeFrom = convertTo24Hour(startTime);
      const timeTo = convertTo24Hour(endTime);
      
      setFormData(prevState => ({
        ...prevState,
        date: formattedDate,
        timeFrom,
        timeTo
      }));
    }
  }, [selectedTimeSlot, selectedDate]);

  // Helper function to convert 12-hour time format to 24-hour format
  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM' && hours !== '12') {
      hours = parseInt(hours, 10) + 12;
    }
    
    return `${hours}:${minutes}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Validate time range
      const startTime = new Date(`2000-01-01T${formData.timeFrom}`);
      const endTime = new Date(`2000-01-01T${formData.timeTo}`);
      
      if (endTime <= startTime) {
        throw new Error('End time must be after start time');
      }
      
      // Add hall ID to the form data
      const bookingData = {
        ...formData,
        hallId: hall.id
      };
      
      // Send booking request to API
      const response = await axios.post('/api/bookings', bookingData);
      
      // Handle successful booking
      if (onBookingSuccess) {
        onBookingSuccess(response.data);
      }
      
    } catch (error) {
      // Extract error message
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit booking';
      if (onBookingError) {
        onBookingError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (selectedTimeSlot && selectedDate) {
      // If we have selected time and date, reset to those values
      const parsedDate = new Date(selectedDate);
      const formattedDate = parsedDate.toISOString().split('T')[0];
      const [startTime, endTime] = selectedTimeSlot.split(' - ');
      
      setFormData({
        department: '',
        hallForBooking: hall?.name || '',
        date: formattedDate,
        timeFrom: convertTo24Hour(startTime),
        timeTo: convertTo24Hour(endTime),
        reason: ''
      });
    } else {
      // Otherwise reset to empty
      setFormData({
        department: '',
        hallForBooking: hall?.name || '',
        date: '',
        timeFrom: '',
        timeTo: '',
        reason: ''
      });
    }
  };

  // Check if selected date is valid (not in the past)
  const isDateValid = (selectedDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dateToCheck = new Date(selectedDate);
    return dateToCheck >= today;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Fill the following details and click submit to book the hall</h2>
      
      <div className="mb-6 bg-blue-50 p-4 rounded-md">
        <h3 className="font-medium text-blue-800 mb-2">Hall Information</h3>
        <p><strong>Name:</strong> {hall?.name}</p>
        {hall?.capacity && <p><strong>Capacity:</strong> {hall.capacity} people</p>}
        {hall?.facilities && hall.facilities.length > 0 && (
          <p><strong>Facilities:</strong> {hall.facilities.join(', ')}</p>
        )}
        {selectedTimeSlot && (
          <p><strong>Selected Time Slot:</strong> {selectedTimeSlot}</p>
        )}
        {selectedDate && (
          <p><strong>Selected Date:</strong> {new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
          })}</p>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center">
            <label className="font-medium w-1/3">DEPARTMENT:</label>
            <span className="mx-2">:</span>
            <select 
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="flex-1 p-2 border rounded-md"
              required
              disabled={isSubmitting}
            >
              <option value="">Select Department</option>
              <option value="Mathematics">Mechanical</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Physics">AI-DS</option>
              <option value="Chemistry">IT</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="font-medium w-1/3">HALL FOR BOOKING:</label>
            <span className="mx-2">:</span>
            <input 
              type="text"
              name="hallForBooking"
              value={formData.hallForBooking}
              className="flex-1 p-2 border rounded-md bg-gray-100"
              readOnly
            />
          </div>

          <div className="flex items-center">
            <label className="font-medium w-1/3">DATE:</label>
            <span className="mx-2">:</span>
            <input 
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`flex-1 p-2 border rounded-md ${
                formData.date && !isDateValid(formData.date) ? 'border-red-500' : ''
              }`}
              min={new Date().toISOString().split('T')[0]} // Set min date to today
              required
              disabled={isSubmitting}
            />
          </div>
          {formData.date && !isDateValid(formData.date) && (
            <div className="ml-1/3 pl-8 text-red-500 text-sm">
              Please select a current or future date
            </div>
          )}

          <div className="flex items-center">
            <label className="font-medium w-1/3">TIME FROM:</label>
            <span className="mx-2">:</span>
            <input 
              type="time"
              name="timeFrom"
              value={formData.timeFrom}
              onChange={handleChange}
              className="flex-1 p-2 border rounded-md"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center">
            <label className="font-medium w-1/3">TIME TO:</label>
            <span className="mx-2">:</span>
            <input 
              type="time"
              name="timeTo"
              value={formData.timeTo}
              onChange={handleChange}
              className={`flex-1 p-2 border rounded-md ${
                formData.timeFrom && formData.timeTo && 
                new Date(`2000-01-01T${formData.timeTo}`) <= new Date(`2000-01-01T${formData.timeFrom}`) 
                  ? 'border-red-500' : ''
              }`}
              required
              disabled={isSubmitting}
            />
          </div>
          {formData.timeFrom && formData.timeTo && 
            new Date(`2000-01-01T${formData.timeTo}`) <= new Date(`2000-01-01T${formData.timeFrom}`) && (
            <div className="ml-1/3 pl-8 text-red-500 text-sm">
              End time must be after start time
            </div>
          )}

          <div className="flex items-center">
            <label className="font-medium w-1/3">REASON:</label>
            <span className="mx-2">:</span>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="flex-1 p-2 border rounded-md"
              rows="4"
              placeholder="Describe your purpose for booking"
              required
              disabled={isSubmitting}
            ></textarea>
          </div>
        </div>

        <div className="flex mt-6 space-x-4">
          <button 
            type="submit" 
            className={`${
              isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-white px-4 py-2 rounded-md flex items-center`}
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          <button 
            type="button" 
            onClick={handleReset}
            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800"
            disabled={isSubmitting}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default HandleBooking;