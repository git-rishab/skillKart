import React from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

function ThreadList({ threads, onThreadSelect }) {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};

    return (
        <div className="space-y-4">
            {threads.map((thread) => (
                <div
                    key={thread._id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-100"
                >
                    <div className="p-5">
                        <div className="flex justify-between items-start">
                            <div
                                className="cursor-pointer flex-grow"
                                onClick={() => onThreadSelect(thread)}
                            >
                                <h3 className="text-xl font-semibold text-blue-700 mb-2 line-clamp-2 hover:text-blue-500">
                                    {thread.question}
                                </h3>
                                <div className="flex items-center text-sm text-gray-500 mb-3">
                                    <span className="font-semibold text-gray-700 mr-1">
                                        {thread.createdBy?.name || 'Anonymous'}
                                    </span>
                                    <span className="mx-2">•</span>
                                    <span>
                                        {thread.createdAt
                                            ? format(new Date(thread.createdAt), 'MMM d, yyyy')
                                            : 'Unknown date'}
                                    </span>

                                    {thread.weekNumber && (
                                        <>
                                            <span className="mx-2">•</span>
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                Week {thread.weekNumber}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div onClick={() => onThreadSelect(thread)} className="cursor-pointer">
                            <div className="mt-2 flex justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center text-gray-500">
                                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                        </svg>
                                        <span>{thread.replies?.length || 0} replies</span>
                                    </div>
                                </div>
                                <button
                                    className="text-blue-600 text-sm font-medium hover:text-blue-800"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onThreadSelect(thread);
                                    }}
                                >
                                    View Discussion →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ThreadList;