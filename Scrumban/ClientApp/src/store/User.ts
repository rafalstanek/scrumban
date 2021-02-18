import { Reducer } from 'redux';

export interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    password: string;
    ownedProjects: {
        id: string;
        name: string;
    }[];
    projects: {
        id: string;
        name: string;
    }[];
    tasks: {
        id: string;
        name: string;
        project: {
            id: string;
            name: string;
        }
    }[];
}

export interface UserState {
    users: User[];
}

export interface AddUserAction {
    type: 'ADD_USER';
    user: User;
}

export interface AddUsersAction {
    type: 'ADD_USERS';
    users: User[];
}

export interface UpdateUserAction {
    type: 'UPDATE_USER';
    user: User;
}

export interface DeleteUserAction {
    type: 'DELETE_USER';
    user: User;
}

type KnownAction = AddUserAction | AddUsersAction | UpdateUserAction | DeleteUserAction;

export type UserAction = KnownAction;

const unloadedState: UserState = {
    users: []
};

export const reducer: Reducer<UserState, KnownAction> = (state, action) => {

    if (state === undefined) {
        return unloadedState;
    }

    switch (action.type) {
        case 'ADD_USERS':
            return { ...state, users: action.users };
        case 'ADD_USER':
            return { ...state, users: state.users.concat(action.user) };
        case 'DELETE_USER':
            return { ...state, users: state.users.filter(u => u.id != action.user.id) };
        case 'UPDATE_USER':
            return {
                ...state, users: state.users.map(u => u.id === action.user.id
                    ? action.user
                    : u)
            };
        default:
            return state;
    }

}