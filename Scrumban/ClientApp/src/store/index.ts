import * as AppUser from './AppUser';
import * as Modal from './Modal';
import * as User from './User';
import * as Project from './Project';

// The top-level state object
export interface ApplicationState {
    appUser: AppUser.AppUserState;
    modal: Modal.ModalState;
    user: User.UserState;
    project: Project.ProjectState;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    appUser: AppUser.reducer,
    modal: Modal.reducer,
    user: User.reducer,
    project: Project.reducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
