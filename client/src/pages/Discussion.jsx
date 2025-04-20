import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { API_URL } from '../app/config';
import ThreadList from '../components/ThreadList';
import ThreadDetail from '../components/ThreadDetail';
import CreateThreadForm from '../components/CreateThreadForm';

function Discussion() {
    const [threads, setThreads] = useState([]);
    const [selectedThread, setSelectedThread] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const { roadmapId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const weekNumber = searchParams.get('week');

    // Fetch threads (all threads or by roadmap if roadmapId is available)
    const fetchThreads = async () => {
        setIsLoading(true);
        try {
            const endpoint = roadmapId
                ? `${API_URL}/api/thread/roadmap/${roadmapId}`
                : `${API_URL}/api/thread`;

            const response = await fetch(endpoint);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setThreads(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching threads:', err);
            setError('Failed to load discussion threads. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchThreads();
        // Set default week number from query param for thread creation form
        if (weekNumber) {
            setShowCreateForm(true);
        }
    }, [roadmapId, weekNumber]);

    const handleThreadSelect = (thread) => {
        setSelectedThread(thread);
    };

    const handleBackToList = () => {
        setSelectedThread(null);
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const handleCreateThread = async (threadData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${API_URL}/api/thread`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(threadData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Add the new thread to the list and select it
            setThreads([data, ...threads]);
            setSelectedThread(data);
            setShowCreateForm(false);
        } catch (err) {
            console.error('Error creating thread:', err);
            setError('Failed to create thread. Please try again.');
        }
    };

    const handleAddReply = async (threadId, reply) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${API_URL}/api/thread/${threadId}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ answer: reply })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Update the selected thread with the new replies
            setSelectedThread(data);

            // Update the thread in the threads list
            setThreads(threads.map(thread =>
                thread._id === threadId ? data : thread
            ));
        } catch (err) {
            console.error('Error adding reply:', err);
            setError('Failed to add reply. Please try again.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Discussion Forum</h1>
                <button
                    onClick={handleBackToDashboard}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded flex items-center"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Dashboard
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {!selectedThread ? (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">
                            {roadmapId ? 'Roadmap Discussions' : 'All Discussions'}
                        </h2>
                        <button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                        >
                            {showCreateForm ? 'Cancel' : 'Start a New Discussion'}
                        </button>
                    </div>

                    {showCreateForm && (
                        <CreateThreadForm
                            roadmapId={roadmapId}
                            onSubmit={handleCreateThread}
                            onCancel={() => setShowCreateForm(false)}
                        />
                    )}

                    {isLoading ? (
                        <div className="text-center py-10">
                            <p className="text-gray-600">Loading discussions...</p>
                        </div>
                    ) : threads.length > 0 ? (
                        <ThreadList
                            threads={threads}
                            onThreadSelect={handleThreadSelect}
                        />
                    ) : (
                        <div className="text-center py-10 bg-gray-50 rounded-lg">
                            <p className="text-gray-600">No discussions yet. Start a new one!</p>
                        </div>
                    )}
                </>
            ) : (
                <ThreadDetail
                    thread={selectedThread}
                    onBack={handleBackToList}
                    onAddReply={handleAddReply}
                />
            )}
        </div>
    );
}

export default Discussion;