import { Reducer } from 'redux';
import { TaskStatus } from './Task';

export type ModalType = 'User' | 'Login' | 'Delete' | 'Project' | 'Task' | 'ProjectUser';

export interface Modal {
    type: ModalType;
    id?: string;
    data?: any;
    headerText?: string;
    bodyText?: string;
    onConfirm?: () => Promise<void>;
    signingUp?: boolean;
    status?: TaskStatus;
}

export interface ModalState {
    modals: Modal[];
}

export interface ShowModalAction {
    type: 'SHOW_MODAL';
    modal: Modal;
}

export interface HideModalAction {
    type: 'HIDE_MODAL';
    id: string;
}

export type KnownAction = ShowModalAction | HideModalAction;

const unloadedState: ModalState = {
    modals: []
};

export const reducer: Reducer<ModalState, KnownAction> = (state, action) => {
    if (state === undefined) {
        return unloadedState;
    }

    switch (action.type) {
        case 'SHOW_MODAL':
            return { ...state, modals: [...state.modals.concat(action.modal)] };
        case 'HIDE_MODAL':
            return {
                ...state, modals: state.modals.filter(item => item.id !== action.id),
            };
        default:
            return state;
    }

}