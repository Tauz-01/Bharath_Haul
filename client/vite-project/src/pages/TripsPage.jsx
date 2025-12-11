import React, { useEffect, useState } from 'react';
import { bookingService, tripService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TripsPage = () => {
    const { user } = useAuth();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTrip, setActiveTrip] = useState(null);

    const fetchTrips = async () => {
        try {
            if (user.role === 'customer' || user.role === 'Customer' || user.role === 'USER') {
                const res = await bookingService.getCustomerBookings(user.id);
                setTrips(res.data);
            } else if (user.role === 'driver' || user.role === 'Driver') {
                const res = await bookingService.getDriverBookings(user.id);
                setTrips(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch trips", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, [user]);

    const handleAccept = async (bookingId) => {
        try {
            await bookingService.accept(bookingId, user.id);
            fetchTrips();
        } catch (error) {
            alert('Failed to accept booking');
        }
    };

    const handleStartTrip = async (bookingId) => {
        try {
            await tripService.start(bookingId);
            fetchTrips();
        } catch (error) {
            alert('Failed to start trip');
        }
    };

    const handleCompleteTrip = async (tripId) => {

        try {
            await tripService.complete(tripId);
            fetchTrips();
        } catch (error) {
            alert('Failed to complete trip');
        }
    };

    if (loading) return <div className="text-center mt-20 text-white bg-black min-h-screen pt-24">Loading trips...</div>;

    return (
        <div className='bg-black min-h-screen text-white' >
            <div className="container mx-auto p-4 pt-24">
                <h1 className="text-2xl font-bold mb-6 text-white">Your Trips & Bookings</h1>

                <div className="grid gap-4">
                    {trips.length === 0 && <p className="text-gray-400">No trips found.</p>}

                    {trips.map((trip) => (
                        <div key={trip.id} className="bg-gray-800 p-4 rounded-lg shadow border border-gray-600 flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="mb-4 md:mb-0">
                                <div className="font-semibold text-lg text-white">
                                    {trip.pickupLocation} <span className="text-gray-400">→</span> {trip.dropoffLocation}
                                </div>
                                <div className="text-sm text-gray-300">
                                    Status: <span className={`uppercase font-bold ${trip.status === 'pending' ? 'text-yellow-400' :
                                        trip.status === 'accepted' ? 'text-blue-400' :
                                            trip.status === 'completed' ? 'text-green-400' : 'text-gray-400'
                                        }`}>{trip.status}</span>
                                </div>
                                <div className="text-sm text-gray-300">Date: {new Date(trip.bookingTime).toLocaleString()}</div>
                                <div className="text-sm font-bold mt-1 text-white">Fare: ₹{trip.fare}</div>
                            </div>

                            {(user.role === 'driver' || user.role === 'Driver') && (
                                <div className="flex gap-2">
                                    {trip.status === 'pending' && (
                                        <button
                                            onClick={() => handleAccept(trip.id)}
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                        >
                                            Accept
                                        </button>
                                    )}
                                    {trip.status === 'accepted' && (
                                        <button
                                            onClick={() => handleStartTrip(trip.id)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            Start Trip
                                        </button>
                                    )}
                                    {/* Note: To complete a trip, we technically need the Trip ID, not Booking ID. 
                                    Depending on backend response for 'getDriverBookings', it might not have detailed Trip info.
                                    This is a simplified assumption that we can't easily complete without Trip ID.
                                    We'd need to fetch trip details for an accepted booking.
                                */}
                                </div>
                            )}

                            {/* Actions for Customer */}
                            {(user.role === 'customer' || user.role === 'Customer' || user.role === 'USER') && (
                                <div>
                                    {/* Customer mostly just views status */}
                                    {trip.status === 'pending' && <span className="text-xs bg-yellow-900 text-yellow-200 px-2 py-1 rounded">Waiting for driver</span>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
};

export default TripsPage;
