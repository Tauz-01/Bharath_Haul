import React, { useState } from 'react';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        pickupLocation: '',
        dropoffLocation: '',
        vehicleType: 'truck',
        fare: 0
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateEstimatedFare = () => {

        return Math.floor(Math.random() * (500 - 100 + 1) + 100);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const bookingPayload = {
                ...formData,
                bookingTime: new Date().toISOString(),
                fare: calculateEstimatedFare()
            };

            await bookingService.create(user.id, bookingPayload);
            setMessage('Booking created successfully! Redirecting...');
            setTimeout(() => {
                navigate('/trips');
            }, 1500);
        } catch (error) {
            console.error(error);
            setMessage('Failed to create booking.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="bg-blue-600 px-6 py-4">
                    <h2 className="text-2xl font-bold text-center text-white">Book a Ride</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {message && (
                        <div className={`p-3 rounded text-sm ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
                        <input
                            type="text"
                            name="pickupLocation"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter pickup address"
                            value={formData.pickupLocation}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Dropoff Location</label>
                        <input
                            type="text"
                            name="dropoffLocation"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter dropoff address"
                            value={formData.dropoffLocation}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                        <select
                            name="vehicleType"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={formData.vehicleType}
                            onChange={handleChange}
                        >
                            <option value="sedan">Regular Sedan</option>
                            <option value="suv">SUV</option>
                            <option value="truck">Mini Truck (Haul)</option>
                            <option value="bike">Bike</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <div className="text-sm text-gray-500">
                            Est. Fare: <span className="font-bold text-gray-900">₹{calculateEstimatedFare()} - ₹{calculateEstimatedFare() + 50}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Confirm Booking'}
                    </button>

                    <div className="text-center mt-4">
                        <button type="button" onClick={() => navigate('/dashboard')} className="text-sm text-blue-500 hover:text-blue-700">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingPage;
