import { Reducer } from 'redux';
import { TaskStatus } from './Task';

export interface Project {
    id: string;
    name: string;
    finished: boolean;
    owner: {
        id: string;
        fullName: string;
    };
    users: {
        id: string;
        fullName: string;
    }[];
    tasks: {
        id: string;
        name: string;
        status: TaskStatus;
        fullName?: string;
        userId?: string;
    }[];
    messages: {
        sendDateTime: Date;
        text: string;
        sender: {
            id: string;
            fullName: string;
        }
    }[];
}

export interface ProjectState {
    projects: Project[];
    scrumbanTableProject: Project;
    userProjects: Project[];
    tableLoaded: boolean;
}

export interface UpdateTableAction {
    type: 'UPDATE_TABLE';
    project: Project;
}

export interface AddProjectAction {
    type: 'ADD_PROJECT';
    project: Project;
}

export interface AddProjectsAction {
    type: 'ADD_PROJECTS';
    projects: Project[];
}

export interface UpdateProjectAction {
    type: 'UPDATE_PROJECT';
    project: Project;
}

export interface DeleteProjectAction {
    type: 'DELETE_PROJECT';
    project: Project;
}

export interface AddUserProjectsAction {
    type: 'ADD_USER_PROJECTS';
    projects: Project[];
}

export interface DeleteUserProjectAction {
    type: 'DELETE_USER_PROJECT';
    project: Project;
}

export interface UnloadTableAction {
    type: 'UNLOAD_TABLE',
    projectId: string;
}

export interface AddTaskAction {
    type: 'ADD_TASK',
    task: {
        id: string;
        name: string;
        status: TaskStatus
    }
}

export interface AddUserProjectAction {
    type: 'ADD_USER_PROJECT',
    project: Project
}

export interface UpdateTaskAction {
    type: 'UPDATE_TASK',
    task: {
        id: string;
        name: string;
        status: TaskStatus
    }
}

export interface AddUserToProjectAction {
    type: 'ADD_USER_TO_PROJECT',
    user: {
        id: string,
        fullName: string
    }
}

export interface DeleteUserFromProjectAction {
    type: 'DELETE_USER_FROM_PROJECT',
    user: {
        id: string
    }
}

export interface UpdateProjectTaskAction {
    type: 'UPDATE_PROJECT_TASK',
    task: {
        id: string;
        name: string;
        status: TaskStatus;
    }
}

export interface AddMessagesAction {
    type: 'ADD_MESSAGES',
    messages: {
        sendDateTime: Date;
        text: string;
        sender: {
            id: string;
            fullName: string;
        }
    }[]
}

export interface AddMessageAction {
    type: 'ADD_MESSAGE',
    message: {
        sendDateTime: Date;
        text: string;
        sender: {
            id: string;
            fullName: string;
        }
    }
}

export type ProjectAction = AddProjectAction | AddProjectsAction | AddUserProjectAction |
    UpdateProjectAction | DeleteProjectAction | UpdateTableAction | UpdateTaskAction
    | AddUserProjectsAction | DeleteUserProjectAction | UnloadTableAction | AddTaskAction
    | AddUserToProjectAction | DeleteUserFromProjectAction | UpdateProjectTaskAction
    | AddMessageAction | AddMessagesAction ;

const unloadedState: ProjectState = {
    projects: [],
    scrumbanTableProject: {
        id: '',
        finished: false,
        messages: [],
        name: '',
        owner: {
            fullName: '',
            id: ''
        },
        tasks: [],
        users: []
    },
    userProjects: [],
    tableLoaded: false
};

export const reducer: Reducer<ProjectState, ProjectAction> = (state, action) => {

    if (state === undefined) {
        return unloadedState;
    }

    switch (action.type) {
        case 'ADD_PROJECTS':
            return { ...state, projects: action.projects };
        case 'ADD_PROJECT':
            return { ...state, projects: state.projects.concat(action.project) };
        case 'DELETE_PROJECT':
            return { ...state, projects: state.projects.filter(p => p.id != action.project.id) };
        case 'UPDATE_PROJECT':
            return {
                ...state, projects: state.projects.map(p => p.id === action.project.id
                    ? action.project
                    : p)
            };
        case 'UPDATE_TABLE':
            return { ...state, scrumbanTableProject: action.project, tableLoaded: true };
        case 'ADD_USER_PROJECTS':
            return { ...state, userProjects: action.projects };
        case 'DELETE_USER_PROJECT':
            return { ...state, userProjects: state.userProjects.filter(p => p.id != action.project.id) };
        case 'UNLOAD_TABLE':
            return { ...state, scrumbanTableProject: { ...unloadedState.scrumbanTableProject, id: action.projectId }, tableLoaded: false }
        case 'ADD_TASK':
            return { ...state, scrumbanTableProject: { ...state.scrumbanTableProject, tasks: state.scrumbanTableProject.tasks.concat(action.task) } }
        case 'UPDATE_TASK':
            return {
                ...state,
                scrumbanTableProject: {
                    ...state.scrumbanTableProject,
                    tasks: state.scrumbanTableProject.tasks.map(t => t.id === action.task.id ? action.task : t)
                }
            }
        case 'ADD_USER_PROJECT':
            return { ...state, userProjects: state.userProjects.concat(action.project) };
        case 'ADD_USER_TO_PROJECT':
            return {
                ...state, scrumbanTableProject: {
                    ...state.scrumbanTableProject,
                    users: state.scrumbanTableProject.users !== null ?
                        state.scrumbanTableProject.users.concat(action.user)
                        : [action.user]

                }
            }
        case 'DELETE_USER_FROM_PROJECT':
            return {
                ...state, scrumbanTableProject: {
                    ...state.scrumbanTableProject,
                    users: state.scrumbanTableProject.users !== null ?
                        state.scrumbanTableProject.users.filter(u => u.id !== action.user.id)
                        : []

                }
            }

        case 'UPDATE_PROJECT_TASK':
            return {
                ...state, scrumbanTableProject: {
                    ...state.scrumbanTableProject,
                    tasks: state.scrumbanTableProject.tasks !== null ?
                        state.scrumbanTableProject.tasks.map(u =>
                            u.id !== action.task.id
                                ? u
                                : action.task)
                        : []

                }
            }

        case 'ADD_MESSAGE':
            return {
                ...state, scrumbanTableProject: {
                    ...state.scrumbanTableProject,
                    messages: state.scrumbanTableProject.messages !== null ?
                        state.scrumbanTableProject.messages.concat(action.message)
                        : [action.message]
                }
            }
        case 'ADD_MESSAGES':
            return {
                ...state, scrumbanTableProject: {
                    ...state.scrumbanTableProject,
                    messages: action.messages
                }
            }
        default:
            return state;
    }
}
