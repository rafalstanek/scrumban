import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from '../../store';
import * as Modal from '../../store/Modal';
import { v4 as uuid } from 'uuid';

export default function useModals(): {
    modals: Modal.Modal[],
    openModal: (modal: Modal.Modal) => void,
    hideModal: (id: string) => void
} {

    const modals = useSelector<ApplicationState, Modal.Modal[]>(state => state.modal.modals);

    const dispatch = useDispatch();

    const openModal: (modal: Modal.Modal) => void = (modal) => {
        dispatch({
            type: 'SHOW_MODAL',
            modal: {
                ...modal,
                id: uuid()
            }
        });
    }

    const hideModal: (id: string) => void = (id) => {
        dispatch({
            type: 'HIDE_MODAL',
            id
        })
    }

    return { modals, openModal, hideModal };

}