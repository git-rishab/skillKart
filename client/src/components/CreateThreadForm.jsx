import React, { useState, useEffect } from 'react';
import { API_URL } from '../app/config';

function CreateThreadForm({ roadmapId, onSubmit, onCancel }) {
    const [question, setQuestion] = useState('');
    const [weekNumber, setWeekNumber] = useState('');
    const [availableWeeks, setAvailableWeeks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch available weeks for the roadmap if a roadmapId is provided
    useEffect(() => {
        const fetchRoadmapWeeks = async () => {
            if (!roadmapId) {
                setAvailableWeeks([]);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                const response = await fetch(
                    `${API_URL}/api/roadmap/${roadmapId}`,
                    { headers }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                if (data && data.modules) {
                    const weeks = data.modules.map(module => module.weekNumber);
                    setAvailableWeeks(weeks.sort((a, b) => a - b));
                    // Set default week to the first week
                    if (weeks.length > 0 && !weekNumber) {
                        setWeekNumber(weeks[0].toString());
                    }
                }
            } catch (err) {
                console.error('Error fetching roadmap details:', err);
                setError('Unable to load roadmap details');
            }
        };

        fetchRoadmapWeeks();
    }, [roadmapId]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!question.trim()) {
            setError('Please enter your question');
            return;
        }

        setIsLoading(true);

        const threadData = {
            question: question.trim(),
            roadmapId: roadmapId || null,
            weekNumber: weekNumber ? parseInt(weekNumber, 10) : null
        };

        onSubmit(threadData);
        setIsLoading(false);
        // Reset form
        setQuestion('');
        setWeekNumber('');
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Start a New Discussion</h3>

            {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {roadmapId && availableWeeks.length > 0 && (
                    <div className="mb-4">
                        <label htmlFor="weekNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Related Week (Optional)
                        </label>
                        <select
                            id="weekNumber"
                            value={weekNumber}
                            onChange={(e) => setWeekNumber(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">-- Select Week --</option>
                            {availableWeeks.map((week) => (
                                <option key={week} value={week}>
                                    Week {week}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="mb-4">
                    <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Question or Topic
                    </label>
                    <textarea
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="4"
                        placeholder="What do you want to discuss?"
                        required
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || !question.trim()}
                        className={`px-4 py-2 rounded-md text-white font-medium ${isLoading || !question.trim()
                            ? 'bg-blue-300 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isLoading ? 'Creating...' : 'Create Discussion'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateThreadForm;