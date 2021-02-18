import { Reducer } from 'redux';

export interface AppUser {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    role: 'Guest' | 'Admin' | 'Planner' | 'User';
    token: string;
}

export interface AppUserState {
    user: AppUser;
}

export interface SetAppUserAction {
    type: 'SET_APP_USER';
    user: AppUser;
}

export interface ResetAppUserAction {
    type: 'RESET_APP_USER';
}

export type KnownAction = SetAppUserAction | ResetAppUserAction;

const unloadedState: AppUserState = {
    user: {
        id: '',
        username: '',
        firstName: '',
        lastName: '',
        role: 'Guest',
        token: '',
    }
};

export const reducer: Reducer<AppUserState, KnownAction> = (state, action) => {

    if (state === undefined) {
        return unloadedState;
    }

    switch (action.type) {
        case 'SET_APP_USER':
            return { ...state, user: action.user };
        case 'RESET_APP_USER':
            return {
                ...state, user: unloadedState.user,
            };
        default:
            return state;
    }

}