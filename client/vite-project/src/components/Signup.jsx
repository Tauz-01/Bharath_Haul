import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        otp: '',
        role: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOTP = (e) => {
        e.preventDefault();
        // Mock OTP send
        console.log('Sending OTP to:', formData.phone);
        setStep(2);
    };

    const handleVerifyOTP = (e) => {
        e.preventDefault();
        // Mock OTP verify
        console.log('Verifying OTP:', formData.otp);
        setStep(3);
    };

    const handleRoleSelection = async (e) => {
        e.preventDefault();
        setError('');

        // Prepare data for backend (expects 'gmail' instead of 'email')
        const userData = {
            name: formData.name,
            gmail: formData.email,
            password: formData.password,
            phone: formData.phone,
            role: formData.role // 'customer' or 'driver'
        };

        const result = await signup(userData);

        if (result.success) {
            alert(`Signup successful as ${formData.role}!`);
            navigate('/dashboard');
        } else {
            setError(result.message || 'Signup failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>Step 1</span>
                        <span className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>Step 2</span>
                        <span className={`text-sm font-medium ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>Step 3</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(step / 3) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Account</h2>

                {error && <div className="mb-4 text-red-500 text-sm text-center bg-red-100 p-2 rounded">{typeof error === 'object' ? JSON.stringify(error) : error}</div>}

                {step === 1 && (
                    <form onSubmit={handleSendOTP}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 XXXXXXXXXX"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                        >
                            Send OTP
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOTP}>
                        <p className="text-gray-600 text-sm mb-4 text-center">
                            We've sent a verification code to <strong>{formData.phone}</strong>
                        </p>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-2">Enter OTP</label>
                            <input
                                type="text"
                                name="otp"
                                value={formData.otp}
                                onChange={handleChange}
                                placeholder="Enter 6-digit OTP"
                                maxLength="6"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                        >
                            Verify OTP
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full mt-3 text-gray-600 hover:text-gray-800 text-sm"
                        >
                            ← Back
                        </button>
                    </form>
                )}
                {step === 3 && (
                    <form onSubmit={handleRoleSelection}>
                        <p className="text-gray-600 text-sm mb-6 text-center">
                            Select your role to continue
                        </p>
                        <div className="space-y-4 mb-6">
                            <label className={`block p-4 border-2 rounded-lg cursor-pointer transition ${formData.role === 'customer' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="customer"
                                    onChange={handleChange}
                                    className="mr-3"
                                    required
                                />
                                <span className="font-medium text-gray-800">Customer</span>
                                <p className="text-sm text-gray-600 ml-6">I want to transport goods</p>
                            </label>
                            <label className={`block p-4 border-2 rounded-lg cursor-pointer transition ${formData.role === 'driver' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="driver"
                                    onChange={handleChange}
                                    className="mr-3"
                                    required
                                />
                                <span className="font-medium text-gray-800">Driver (Transporter)</span>
                                <p className="text-sm text-gray-600 ml-6">I own a transport vehicle</p>
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                        >
                            Complete Signup
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="w-full mt-3 text-gray-600 hover:text-gray-800 text-sm"
                        >
                            ← Back
                        </button>
                    </form>
                )}

                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
