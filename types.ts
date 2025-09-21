
export enum AgentStatus {
  Idle = 'idle',
  Working = 'working',
  Done = 'done',
  Error = 'error',
}

export type AgentId = 'researcher' | 'writer' | 'scheduler';

export type Agent = {
  id: AgentId;
  name: string;
  description: string;
  icon: JSX.Element;
};
