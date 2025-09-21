
import React from 'react';
import type { Agent } from '../types';
import { AgentStatus } from '../types';

interface AgentCardProps {
    agent: Agent;
    status: AgentStatus;
    output: string | null;
}

const StatusIndicator: React.FC<{ status: AgentStatus }> = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full inline-block text-white";
    switch (status) {
        case AgentStatus.Working:
            return <span className={`${baseClasses} bg-blue-500 animate-pulse`}>WORKING</span>;
        case AgentStatus.Done:
            return <span className={`${baseClasses} bg-green-500`}>DONE</span>;
        case AgentStatus.Error:
            return <span className={`${baseClasses} bg-red-500`}>ERROR</span>;
        case AgentStatus.Idle:
        default:
            return <span className={`${baseClasses} bg-slate-600`}>IDLE</span>;
    }
};

const AgentCard: React.FC<AgentCardProps> = ({ agent, status, output }) => {
    return (
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 flex flex-col border border-slate-700 transition-all duration-300 hover:border-blue-500 hover:shadow-blue-500/10">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    {agent.icon}
                    <div>
                        <h3 className="text-xl font-bold text-white">{agent.name}</h3>
                        <p className="text-sm text-slate-400">{agent.description}</p>
                    </div>
                </div>
                <StatusIndicator status={status} />
            </div>
            <div className="bg-slate-900/70 p-4 rounded-md mt-2 flex-grow min-h-[150px] overflow-y-auto">
                <pre className="text-slate-300 text-sm whitespace-pre-wrap font-sans">
                    {status === AgentStatus.Working ? "Thinking..." : output || "Awaiting execution..."}
                </pre>
            </div>
        </div>
    );
};

export default AgentCard;
