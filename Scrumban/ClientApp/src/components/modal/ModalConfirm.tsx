import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import useModals from '../common/useModals';
import { User } from '../../store/User';

interface ModalProps {
    isOpen: boolean;
    id: string;
}

interface ModalConfirmProps {
    headerText: string;
    bodyText: string;
    onConfirm: () => Promise<void>;
}

const ModalConfirm: React.FunctionComponent<ModalProps & ModalConfirmProps & { user: User }> = (props) => {

    const { hideModal } = useModals();

    const close = () => {
        hideModal(props.id);
    }

    return (
        <Modal isOpen={props.isOpen} toggle={close}>
            <ModalHeader>{props.headerText}</ModalHeader>
            <ModalBody>{props.bodyText}</ModalBody>
            <ModalFooter>
                <Button className="btn btn-danger" onClick={close}>Anuluj</Button>
                <Button className="btn btn-success" onClick={() => {
                    props.onConfirm();
                    close();
                }}>Tak</Button>
            </ModalFooter>
        </Modal>
    );

}

export default ModalConfirm;