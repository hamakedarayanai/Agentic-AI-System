
import React from 'react';

interface TopicInputProps {
    topic: string;
    setTopic: (topic: string) => void;
    onSubmit: () => void;
    isLoading: boolean;
}

const TopicInput: React.FC<TopicInputProps> = ({ topic, setTopic, onSubmit, isLoading }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (topic.trim() && !isLoading) {
            onSubmit();
        }
    };
    
    return (
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg shadow-2xl border border-slate-700 w-full max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic, e.g., 'The future of quantum computing'"
                    className="flex-grow bg-slate-900 border border-slate-600 text-white placeholder-slate-400 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !topic.trim()}
                    className="bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        'Start Agent System'
                    )}
                </button>
            </form>
        </div>
    );
};

export default TopicInput;
