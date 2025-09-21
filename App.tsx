
import React, { useState, useCallback } from 'react';
import AgentCard from './components/AgentCard';
import TopicInput from './components/TopicInput';
import { runResearcherAgent, runWriterAgent, runSchedulerAgent } from './services/geminiService';
import { AGENTS } from './constants';
import type { AgentId } from './types';
import { AgentStatus } from './types';

const App: React.FC = () => {
    const [topic, setTopic] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const initialStatuses = AGENTS.reduce((acc, agent) => {
        acc[agent.id] = AgentStatus.Idle;
        return acc;
    }, {} as Record<AgentId, AgentStatus>);

    const initialOutputs = AGENTS.reduce((acc, agent) => {
        acc[agent.id] = null;
        return acc;
    }, {} as Record<AgentId, string | null>);

    const [agentStatuses, setAgentStatuses] = useState<Record<AgentId, AgentStatus>>(initialStatuses);
    const [agentOutputs, setAgentOutputs] = useState<Record<AgentId, string | null>>(initialOutputs);

    const resetState = () => {
        setAgentStatuses(initialStatuses);
        setAgentOutputs(initialOutputs);
        setError(null);
    };
    
    const handleStartProcess = useCallback(async () => {
        if (!topic.trim()) return;

        resetState();
        setIsLoading(true);

        try {
            // --- Researcher Agent ---
            setAgentStatuses(prev => ({ ...prev, researcher: AgentStatus.Working }));
            const summary = await runResearcherAgent(topic);
            setAgentOutputs(prev => ({ ...prev, researcher: summary }));
            setAgentStatuses(prev => ({ ...prev, researcher: AgentStatus.Done }));

            // --- Writer Agent ---
            setAgentStatuses(prev => ({ ...prev, writer: AgentStatus.Working }));
            const blogPost = await runWriterAgent(summary);
            
            const blogLines = blogPost.split('\n');
            const titleLine = blogLines.find(line => line.toLowerCase().startsWith('title:'));
            const blogTitle = titleLine ? titleLine.substring(7).trim() : 'Untitled Blog Post';
            const blogContent = titleLine ? blogLines.slice(1).join('\n').trim() : blogPost;
            
            setAgentOutputs(prev => ({ ...prev, writer: blogContent }));
            setAgentStatuses(prev => ({ ...prev, writer: AgentStatus.Done }));

            // --- Scheduler Agent ---
            setAgentStatuses(prev => ({ ...prev, scheduler: AgentStatus.Working }));
            const scheduleConfirmation = await runSchedulerAgent(blogTitle);
            setAgentOutputs(prev => ({ ...prev, scheduler: scheduleConfirmation }));
            setAgentStatuses(prev => ({ ...prev, scheduler: AgentStatus.Done }));

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
            setAgentStatuses(prev => {
                const newStatuses = { ...prev };
                for (const key in newStatuses) {
                    if (newStatuses[key as AgentId] === AgentStatus.Working) {
                        newStatuses[key as AgentId] = AgentStatus.Error;
                    }
                }
                return newStatuses;
            });
        } finally {
            setIsLoading(false);
        }
    }, [topic]);

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Agentic AI System
                    </h1>
                    <p className="text-lg text-slate-400 mt-2 max-w-3xl mx-auto">
                        An autonomous multi-agent system that researches, writes, and schedules content based on a single topic.
                    </p>
                </header>

                <main>
                    <TopicInput 
                        topic={topic}
                        setTopic={setTopic}
                        onSubmit={handleStartProcess}
                        isLoading={isLoading}
                    />
                    
                    {error && (
                         <div className="my-8 bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center max-w-3xl mx-auto">
                            <span className="font-bold">Error:</span> {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                        {AGENTS.map(agent => (
                            <AgentCard
                                key={agent.id}
                                agent={agent}
                                status={agentStatuses[agent.id]}
                                output={agentOutputs[agent.id]}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
