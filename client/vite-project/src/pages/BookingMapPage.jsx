import React, { useState, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { bookingService } from '../services/api';

const libraries = ['places'];
const mapContainerStyle = {
    width: '100%',
    height: '100%',
};
const center = {
    lat: 12.9716, // Default to Bangalore (or any relevant center)
    lng: 77.5946,
};

const BookingMapPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [directions, setDirections] = useState(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const [fare, setFare] = useState(0);
    const [vehicleType, setVehicleType] = useState('truck');
    const [pickupLocation, setPickupLocation] = useState(null); // { lat, lng, address }
    const [dropoffLocation, setDropoffLocation] = useState(null); // { lat, lng, address }
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyCmzk0DdREGbzw9D3sPujCaaefhdKV_WQM', // Replace with secure method in prod
        libraries,
    });

    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    // Custom hook for places autocomplete
    const PlacesAutocomplete = ({ setSelected, role, label }) => {
        const {
            ready,
            value,
            setValue,
            suggestions: { status, data },
            clearSuggestions,
        } = usePlacesAutocomplete();

        const handleSelect = async (address) => {
            setValue(address, false);
            clearSuggestions();

            try {
                const results = await getGeocode({ address });
                const { lat, lng } = await getLatLng(results[0]);
                setSelected({ lat, lng, address });
            } catch (error) {
                console.log('Error: ', error);
            }
        };

        return (
            <div className="mb-4 relative">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    {label} {role === 'pickup' && <span className="text-green-600">●</span>} {role === 'dropoff' && <span className="text-red-600">●</span>}
                </label>
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={!ready}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder={`Enter ${label}`}
                />
                {status === 'OK' && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                        {data.map(({ place_id, description }) => (
                            <li
                                key={place_id}
                                onClick={() => handleSelect(description)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            >
                                {description}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    const calculateRoute = async () => {
        if (!pickupLocation || !dropoffLocation) return;

        const directionsService = new google.maps.DirectionsService();
        const results = await directionsService.route({
            origin: pickupLocation,
            destination: dropoffLocation,
            travelMode: google.maps.TravelMode.DRIVING,
        });
        setDirections(results);
        setDistance(results.routes[0].legs[0].distance.text);
        setDuration(results.routes[0].legs[0].duration.text);

        // Simple mock fare calculation
        const distValue = results.routes[0].legs[0].distance.value / 1000; // km
        const baseFare = vehicleType === 'bike' ? 20 : vehicleType === 'truck' ? 100 : 50;
        const perKm = vehicleType === 'bike' ? 10 : vehicleType === 'truck' ? 30 : 15;
        const estimatedFare = Math.round(baseFare + (distValue * perKm));
        setFare(estimatedFare);
    };

    // Effect to recalculate route when locations change
    React.useEffect(() => {
        if (pickupLocation && dropoffLocation && isLoaded) {
            // Accessing google object needing window or script loaded
            if (window.google) {
                const directionsService = new window.google.maps.DirectionsService();
                directionsService.route({
                    origin: pickupLocation,
                    destination: dropoffLocation,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                }, (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        setDirections(result);
                        setDistance(result.routes[0].legs[0].distance.text);
                        setDuration(result.routes[0].legs[0].duration.text);

                        const distValue = result.routes[0].legs[0].distance.value / 1000;
                        const baseFare = vehicleType === 'bike' ? 20 : vehicleType === 'truck' ? 100 : 50;
                        const perKm = vehicleType === 'bike' ? 10 : vehicleType === 'truck' ? 30 : 15;
                        setFare(Math.round(baseFare + (distValue * perKm)));
                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                });
            }
        }
    }, [pickupLocation, dropoffLocation, vehicleType, isLoaded]);


    const handleBooking = async () => {
        if (!pickupLocation || !dropoffLocation) {
            alert('Please select pickup and dropoff locations');
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

            await bookingService.create(user.id, bookingPayload);
            setMessage('Booking created successfully! Redirecting...');
            setTimeout(() => navigate('/trips'), 1500);
        } catch (error) {
            console.error(error);
            setMessage('Failed to create booking.');
        } finally {
            setLoading(false);
        }
    };

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
        <div className="flex h-screen pt-16">
            {/* Left Panel - Input Forms */}
            <div className="w-full md:w-1/3 bg-white shadow-xl z-10 flex flex-col p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Plan Your Haul</h2>

                {message && (
                    <div className={`p-3 rounded mb-4 text-sm ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <PlacesAutocomplete role="pickup" label="Pickup Location" setSelected={setPickupLocation} />
                <PlacesAutocomplete role="dropoff" label="Dropoff Location" setSelected={setDropoffLocation} />

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
                    disabled={loading || !fare}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
                >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
            </div>

            {/* Right Panel - Map */}
            <div className="hidden md:block w-2/3 relative">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={12}
                    center={pickupLocation || center}
                    options={{
                        disableDefaultUI: false,
                        zoomControl: true,
                    }}
                    onLoad={onMapLoad}
                >
                    {pickupLocation && (
                        <Marker
                            position={pickupLocation}
                            icon={{
                                url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                            }}
                        />
                    )}
                    {dropoffLocation && (
                        <Marker
                            position={dropoffLocation}
                            icon={{
                                url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                            }}
                        />
                    )}
                    {directions && (
                        <DirectionsRenderer
                            directions={directions}
                            options={{
                                polylineOptions: {
                                    strokeColor: "#2563EB",
                                    strokeWeight: 5,
                                },
                                suppressMarkers: true // We use custom markers
                            }}
                        />
                    )}
                </GoogleMap>
            </div>
        </div>
    );
};

export default BookingMapPage;
