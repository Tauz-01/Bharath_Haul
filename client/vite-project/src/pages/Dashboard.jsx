import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { walletService, bookingService } from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [balance, setBalance] = useState(0);
    const [recentBookings, setRecentBookings] = useState([]);

    useEffect(() => {
        if (user) {
            // Fetch Wallet Balance
            walletService.getBalance(user.id)
                .then(res => setBalance(res.data))
                .catch(() => setBalance(0));

            // Fetch Recent Bookings based on role
            if (user.role === 'customer' || user.role === 'Customer' || user.role === 'USER') {
                bookingService.getCustomerBookings(user.id)
                    .then(res => setRecentBookings(res.data.slice(0, 3))) // Last 3
                    .catch(err => console.error(err));
            } else if (user.role === 'driver' || user.role === 'Driver') {
                bookingService.getDriverBookings(user.id)
                    .then(res => setRecentBookings(res.data.slice(0, 3)))
                    .catch(err => console.error(err));
            }
        }
    }, [user]);

    return (
        <div className="container mx-auto p-6 pt-24">
            <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}!</h1>
                <p className="text-gray-600 mt-2">Role: <span className="uppercase font-semibold text-blue-600">{user?.role}</span></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Wallet Card */}
                <div className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg p-6 shadow-md transition-transform hover:scale-105">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Wallet</h3>
                        <span className="text-3xl">₹{balance.toFixed(2)}</span>
                    </div>
                    <Link to="/wallet" className="block w-full text-center bg-white text-green-600 py-2 rounded font-semibold hover:bg-gray-100 transition">
                        Manage Wallet
                    </Link>
                </div>

                {/* Action Card */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-6 shadow-md transition-transform hover:scale-105">
                    <h3 className="text-xl font-bold mb-4">
                        {user?.role === 'driver' || user?.role === 'Driver' ? 'Find Work' : 'Need a Ride?'}
                    </h3>
                    {user?.role === 'driver' || user?.role === 'Driver' ? (
                        <Link to="/trips" className="block w-full text-center bg-white text-blue-600 py-2 rounded font-semibold hover:bg-gray-100 transition">
                            View Assigned Trips
                        </Link>
                    ) : (
                        <Link to="/book-ride" className="block w-full text-center bg-white text-blue-600 py-2 rounded font-semibold hover:bg-gray-100 transition">
                            Book a Ride Now
                        </Link>
                    )}
                </div>

                {/* Trips Summary */}
                <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                    {recentBookings.length > 0 ? (
                        <ul className="space-y-3">
                            {recentBookings.map(booking => (
                                <li key={booking.id} className="border-b pb-2">
                                    <div className="flex justify-between">
                                        <span className="font-medium">To: {booking.dropoffLocation}</span>
                                        <span className={`text-sm px-2 py-0.5 rounded ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">{new Date(booking.bookingTime).toLocaleDateString()}</div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic">No recent activity.</p>
                    )}
                    <Link to="/trips" className="text-blue-500 text-sm mt-4 hover:underline block">View all history</Link>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
