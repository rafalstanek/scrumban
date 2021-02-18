import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert } from 'reactstrap';
import DefaultFormGroup from '../common/DefaultFormGroup';
import { useDispatch } from 'react-redux';
import { AppUser } from '../../store/AppUser';
import { toast } from 'react-toastify';
import useModals from '../common/useModals';
import useFetch from '../common/useFetch';
import { ModalProps } from '../common/ModalProps';

interface LoginErrors {
    username: string;
    password: string;
}

const ModalLogin: React.FunctionComponent<ModalProps> = (props) => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const { hideModal } = useModals();

    const [error, setError] = React.useState('');

    const [errors, setErrors] = React.useState({
        username: '',
        password: ''
    } as LoginErrors);

    const { postRequest } = useFetch();

    const close = () => {
        hideModal(props.id);
    }

    const dispatch = useDispatch();

    const validate: () => boolean = () => {
        var result = true;
        var temp = errors;
        if (username === '') {
            temp = { ...temp, username: 'Username cannot be blank' };
            result = false;
        }
        if (password === '') {
            temp = { ...temp, password: 'Password cannot be blank' };
            result = false;
        }
        setErrors(temp);
        return result;
    }

    const handleLogin = () => {
        if (validate()) {
            postRequest({
                url: '/api/user/Authenticate',
                body: { username, password },
                callback: async (res) => {
                    if (res.status == 200) {
                        res.json().then((user: AppUser) => {
                            localStorage.setItem('token', user.token);
                            dispatch({
                                type: 'SET_APP_USER',
                                user: user
                            });
                            toast.success('Successfully logged in');
                            close();
                        })
                    }
                    else {
                        setError('Sign in failed');
                    }
                }
            });
        }
    }

    return (
        <Modal isOpen={props.isOpen} toggle={close}>
            <ModalHeader>Zaloguj się</ModalHeader>
            <ModalBody>
                {error &&
                    <Alert color="danger">
                        {error}
                    </Alert>
                }
                <DefaultFormGroup
                    label={'Podaj login'}
                    type={"text"}
                    onChangeEvent={(e) => {
                        setUsername(e.target.value);
                        setErrors({ ...errors, username: '' });
                    }}
                    error={errors.username}
                />
                <DefaultFormGroup
                    label={'Podaj hasło'}
                    type={"password"}
                    onChangeEvent={(e) => {
                        setPassword(e.target.value)
                        setErrors({ ...errors, password: '' });
                    }}
                    error={errors.password}
                />
            </ModalBody>
            <ModalFooter>
                <Button className="btn btn-danger" onClick={close}>Anuluj</Button>
                <Button className="btn btn-success" onClick={handleLogin}>Zaloguj</Button>
            </ModalFooter>
        </Modal>);

}

export default ModalLogin;