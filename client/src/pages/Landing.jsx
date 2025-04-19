import React from 'react';

const Landing = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Welcome to MisogiAi</h1>
                <p className="text-lg text-gray-700 mb-6 text-center">
                    Your intelligent assistant platform
                </p>
                <div className="flex justify-center gap-4">
                    <a
                        href="/login"
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Login
                    </a>
                    <a
                        href="/register"
                        className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                        Register
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Landing;