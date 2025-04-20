import React, { useState } from 'react';
import { format } from 'date-fns';

function ThreadDetail({ thread, onBack, onAddReply }) {
    const [reply, setReply] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};

    const handleSubmitReply = async (e) => {
        e.preventDefault();
        if (!reply.trim()) return;

        setIsSubmitting(true);
        try {
            await onAddReply(thread._id, reply);
            setReply('');
        } catch (error) {
            console.error('Error submitting reply:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md">
            {/* Back button */}
            <div className="border-b border-gray-200 p-4 flex justify-between items-center">
                <button
                    onClick={onBack}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Discussions
                </button>
            </div>

            {/* Thread question */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center mb-4">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                        {thread.createdBy?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800">{thread.createdBy?.name || 'Anonymous'}</h4>
                        <p className="text-sm text-gray-500">
                            {thread.createdAt
                                ? format(new Date(thread.createdAt), 'MMM d, yyyy • h:mm a')
                                : 'Unknown date'}
                        </p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">{thread.question}</h2>

                {thread.weekNumber && (
                    <div className="mb-4">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded">
                            Week {thread.weekNumber}
                        </span>
                    </div>
                )}
            </div>

            {/* Replies section */}
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {thread.replies?.length
                        ? `${thread.replies.length} ${thread.replies.length === 1 ? 'Reply' : 'Replies'}`
                        : 'No replies yet'}
                </h3>

                <div className="space-y-6">
                    {thread.replies?.length > 0 ? (
                        thread.replies.map((reply, index) => (
                            <div key={reply._id} className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <div className="flex items-center mb-3">
                                        <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                                            {reply.userId?.name?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">
                                                {reply.userId?.name || 'Anonymous'}
                                            </h4>
                                            <p className="text-xs text-gray-500">
                                                {reply.createdAt
                                                    ? format(new Date(reply.createdAt), 'MMM d, yyyy • h:mm a')
                                                    : 'Unknown date'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-gray-800 whitespace-pre-wrap">{reply.answer}</div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Be the first to reply to this discussion!</p>
                        </div>
                    )}
                </div>

                {/* Reply form */}
                <form onSubmit={handleSubmitReply} className="mt-8">
                    <h4 className="font-medium text-gray-800 mb-2">Your reply</h4>
                    <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="4"
                        placeholder="Share your thoughts or answer..."
                        required
                    />
                    <div className="mt-3 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting || !reply.trim()}
                            className={`px-4 py-2 rounded-md text-white font-medium ${isSubmitting || !reply.trim()
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Post Reply'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ThreadDetail;