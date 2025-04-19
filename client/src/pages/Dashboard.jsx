import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <Link
                        to="/"
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                        Logout
                    </Link>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4 bg-white">
                            <h2 className="text-2xl font-semibold mb-4">Welcome to your Dashboard</h2>
                            <p className="text-gray-600 mb-4">
                                This is a placeholder dashboard page. In a real application, you would see your
                                personal data, analytics, or other information here.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                                <div className="bg-blue-100 p-4 rounded shadow-sm">
                                    <h3 className="font-bold text-blue-800">Recent Activity</h3>
                                    <p className="text-sm text-blue-600">No recent activity</p>
                                </div>
                                <div className="bg-green-100 p-4 rounded shadow-sm">
                                    <h3 className="font-bold text-green-800">Statistics</h3>
                                    <p className="text-sm text-green-600">No data available</p>
                                </div>
                                <div className="bg-purple-100 p-4 rounded shadow-sm">
                                    <h3 className="font-bold text-purple-800">Notifications</h3>
                                    <p className="text-sm text-purple-600">No new notifications</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;