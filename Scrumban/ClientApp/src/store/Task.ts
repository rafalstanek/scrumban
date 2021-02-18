export type TaskStatus = 'Zaplanowane' | 'Oczekujące' | 'W trakcie' | 'Testy' | 'Ukończone';

export interface Task {
    id: string;
    status: TaskStatus;
    name: string;
    project?: {
        id: string;
        name: string;
    }
    user?: {
        id: string;
        fullName: string;
    }
    userId?: string;
}