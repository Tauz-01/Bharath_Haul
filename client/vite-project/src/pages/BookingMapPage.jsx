import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/api';

const BookingMapPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const [fare, setFare] = useState(0);
    const [vehicleType, setVehicleType] = useState('truck');
    const [pickupLocation, setPickupLocation] = useState(null);
    const [dropoffLocation, setDropoffLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [manualDistance, setManualDistance] = useState('');


    React.useEffect(() => {
        if (pickupLocation && dropoffLocation) {
            if (manualDistance && parseFloat(manualDistance) > 0) {
                const distKm = parseFloat(manualDistance);
                const baseFare = vehicleType === 'bike' ? 20 : vehicleType === 'truck' ? 100 : 50;
                const perKm = vehicleType === 'bike' ? 10 : vehicleType === 'truck' ? 30 : 15;
                const calculatedFare = Math.round(baseFare + (distKm * perKm));
                setFare(calculatedFare);
                setDistance(`${distKm} km`);
                setDuration('Approx');
            } else if (fare === 0) {
                const baseFare = vehicleType === 'bike' ? 50 : vehicleType === 'truck' ? 200 : 100;
                setFare(baseFare);
                setDistance('Enter distance');
                setDuration('Approx');
            }
        }
    }, [pickupLocation, dropoffLocation, vehicleType, manualDistance]);

    const handleBooking = async () => {
        if (!pickupLocation || !dropoffLocation) {
            alert('Please enter pickup and dropoff locations');
            return;
        }

        if (!user || !user.id) {
            alert('Please login first to create a booking');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const bookingPayload = {
                pickupLocation: pickupLocation.address,
                dropoffLocation: dropoffLocation.address,
                vehicleType,
                fare,
                bookingTime: new Date().toISOString()
            };

            console.log('User ID:', user.id);
            console.log('Booking Payload:', bookingPayload);

            await bookingService.create(user.id, bookingPayload);
            setMessage('Booking created successfully! Redirecting...');
            setTimeout(() => navigate('/trips'), 1500);
        } catch (error) {
            console.error('Booking error:', error);
            const errorMessage = error.response?.data || error.message || 'Failed to create booking.';

            if (errorMessage.includes('User not found')) {
                setMessage('Session invalid. Please login again.');
                navigate('/login');
            } else {
                setMessage(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen pt-16">
         
            <div className="w-full md:w-1/3 bg-white shadow-xl z-10 flex flex-col p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Plan Your Haul</h2>

                {message && (
                    <div className={`p-3 rounded mb-4 text-sm ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Pickup Location <span className="text-green-600">●</span>
                    </label>
                    <input
                        type="text"
                        value={pickupLocation?.address || ''}
                        onChange={(e) => setPickupLocation({ address: e.target.value })}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Pickup Location"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Dropoff Location <span className="text-red-600">●</span>
                    </label>
                    <input
                        type="text"
                        value={dropoffLocation?.address || ''}
                        onChange={(e) => setDropoffLocation({ address: e.target.value })}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Dropoff Location"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Vehicle Type</label>
                    <select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        className="shadow border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:shadow-outline bg-white"
                    >
                        <option value="truck">Mini Truck (Haul)</option>
                        <option value="suv">SUV</option>
                        <option value="sedan">Sedan</option>
                        <option value="bike">Bike</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Approximate Distance (km)</label>
                    <input
                        type="number"
                        value={manualDistance}
                        onChange={(e) => setManualDistance(e.target.value)}
                        placeholder="Enter distance in kilometers"
                        min="0"
                        step="0.1"
                        className="shadow border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:shadow-outline"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter approximate distance for fare calculation</p>
                </div>

                {distance && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Distance:</span>
                            <span className="font-bold">{distance}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-bold">{duration}</span>
                        </div>
                        <div className="flex justify-between border-t border-blue-200 pt-2 mt-2">
                            <span className="text-gray-800 font-bold">Estimated Fare:</span>
                            <span className="text-blue-600 font-bold text-xl">₹{fare}</span>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleBooking}
                    disabled={loading || !pickupLocation || !dropoffLocation}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
                >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
            </div>

           
            <div className="hidden md:block w-2/3 relative bg-gray-100">
                <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCmzk0DdREGbzw9D3sPujCaaefhdKV_WQM&q=${pickupLocation?.address || 'India'}`}
                    title="Map View"
                ></iframe>
            </div>
        </div>
    );
};

export default BookingMapPage;
