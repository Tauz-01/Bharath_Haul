import React, { useEffect, useState } from 'react';
import { walletService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const WalletPage = () => {
    const { user } = useAuth();
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadWalletData();
    }, [user]);

    const loadWalletData = () => {
        if (!user) return;
        walletService.getBalance(user.id)
            .then(res => setBalance(res.data))
            .catch(err => setBalance(0));

        walletService.getTransactions(user.id)
            .then(res => setTransactions(res.data))
            .catch(err => console.log('No transactions'));
    };

    const handleAddMoney = async (e) => {
        e.preventDefault();
        try {
            await walletService.addMoney(user.id, amount, 'Bank Transfer');
            setMessage('Money added successfully!');
            setAmount('');
            loadWalletData();
        } catch (error) {
            setMessage('Failed to add money.');
        }
    };

    const handleWithdraw = async (e) => {
        e.preventDefault();
        try {
            await walletService.withdraw(user.id, amount, 'Bank Transfer');
            setMessage('Withdrawal successful!');
            setAmount('');
            loadWalletData();
        } catch (error) {
            setMessage('Failed to withdraw. Insufficient funds?');
        }
    };

    return (
        <div className="container mx-auto p-4 pt-24 bg-black">
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="bg-gray-800 text-white p-6">
                    <h1 className="text-3xl font-bold">My Wallet</h1>
                    <p className="text-gray-400 mt-1">Manage your funds securely</p>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

                    <div>
                        <div className="bg-blue-50 p-6 rounded-lg mb-6 border border-blue-100">
                            <h2 className="text-gray-600 font-semibold mb-1">Current Balance</h2>
                            <div className="text-4xl font-bold text-blue-700">₹{balance.toFixed(2)}</div>
                        </div>

                        <form onSubmit={user.role === 'driver' || user.role === 'Driver' ? handleWithdraw : handleAddMoney} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    {user.role === 'driver' || user.role === 'Driver' ? 'Withdraw Amount' : 'Add Amount'}
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">₹</span>
                                    </div>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-2 border"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                                    ${user.role === 'driver' || user.role === 'Driver' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                                    focus:outline-none`}
                            >
                                {user.role === 'driver' || user.role === 'Driver' ? 'Withdraw Funds' : 'Add Money to Wallet'}
                            </button>
                            {message && <p className="text-sm text-center mt-2 text-gray-600">{message}</p>}
                        </form>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Transaction History</h3>
                        <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto border border-gray-200">
                            {transactions.length === 0 ? (
                                <p className="text-center text-gray-400 py-8">No transactions yet.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {transactions.map(tx => (
                                        <li key={tx.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                                            <div>
                                                <div className={`font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount}
                                                </div>
                                                <div className="text-xs text-gray-500">{tx.method}</div>
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {/* No date in simple Transaction model? Assuming ID acts as timestamp or user accepts hidden dates */}
                                                ID: {tx.id}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletPage;
