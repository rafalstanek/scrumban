import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert } from 'reactstrap';
import DefaultFormGroup from '../common/DefaultFormGroup';
import { toast } from 'react-toastify';
import useModals from '../common/useModals';
import { useDispatch } from 'react-redux';
import useFetch from '../common/useFetch';
import { Dispatch } from 'redux';
import { UserAction, User } from '../../store/User';
import { ModalProps } from '../common/ModalProps';

interface UserErrors {
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    password: string;
    passwordRepeat: string;
}

interface UserProps {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
}

const ModalUser: React.FunctionComponent<ModalProps & { user?: UserProps } & { signingUp: boolean }> = (props) => {

    const { hideModal } = useModals();

    const close = () => {
        hideModal(props.id);
    }

    const dispatch = useDispatch<Dispatch<UserAction>>();
    const update = props.user !== undefined;

    const [username, setUsername] = React.useState(props.user?.username || '');
    const [firstName, setFirstName] = React.useState(props.user?.firstName || '');
    const [lastName, setLastName] = React.useState(props.user?.lastName || '');
    const [role, setRole] = React.useState(props.user?.role || '');
    const [password, setPassword] = React.useState('');
    const [passwordRepeat, setPasswordRepeat] = React.useState('');

    const [error, setError] = React.useState('');

    const { postRequest } = useFetch();

    const [errors, setErrors] = React.useState({
        username: '',
        firstName: '',
        lastName: '',
        password: '',
        passwordRepeat: '',
        role: ''
    } as UserErrors)

    const validate: () => boolean = () => {
        var result = true;
        var temp = errors;
        if (username === '') {
            temp = { ...temp, username: 'Username cannot be blank' };
            result = false;
        }
        if (firstName === '') {
            temp = { ...temp, firstName: 'First name cannot be blank' };
            result = false;
        }
        if (lastName === '') {
            temp = { ...temp, lastName: 'Last name cannot be blank' };
            result = false;
        }
        if (!update) {
            if (password === '') {
                temp = { ...temp, password: 'Password cannot be blank' };
                result = false;
            }
            if (passwordRepeat === '') {
                temp = { ...temp, passwordRepeat: 'Password cannot be blank' };
                result = false;
            }
        }
        if (!props.signingUp) {
            if (role === '') {
                temp = { ...temp, role: 'You must select a role' };
                result = false;
            }
        }
        if (password !== passwordRepeat) {
            temp = {
                ...temp,
                password: 'Passwords must match each other',
                passwordRepeat: 'Passwords must match each other'
            };
            result = false;
        }
        setErrors(temp);
        return result;
    }

    const submit = () => {
        if (validate()) {
            if (props.signingUp) {
                setRole('User');
            }
            postRequest({
                url: update ? '/api/user/Update' : '/api/user/Create',
                body: { id: props.user?.id, username, firstName, lastName, password, role },
                callback: async (res) => {
                    if (res.status == 200) {
                        res.json().then((user: User) => {
                            if (!props.signingUp) {
                                toast.success(update ? 'Updated a user' : 'Created a user');
                            }
                            else {
                                toast.success('Pomyślnie zarejestrowano w serwisie');
                            }
                            dispatch({
                                type: (update ? 'UPDATE_USER' : 'ADD_USER'),
                                user
                            });
                            close();
                        });
                    }
                    else {
                        setError('Something went wrong');
                        res.json().then(er => setErrors({ ...errors, username: er.username[0] }));
                    }
                }
            })
        }
    }

    return (
        <Modal isOpen={props.isOpen} toggle={close}>
            <ModalHeader>{props.signingUp ? 'Zarejestruj się' : 'Utwórz użytkownika'}</ModalHeader>
            <ModalBody>
                {error &&
                    <Alert color="danger">
                        {error}
                    </Alert>
                }
                <DefaultFormGroup
                    label={'Podaj login'}
                    value={username}
                    error={errors.username}
                    onChangeEvent={(e) => {
                        setUsername(e.target.value);
                        setErrors({ ...errors, username: '' });
                    }} />
                {!props.signingUp &&
                    <DefaultFormGroup
                        label={'Podaj rolę'}
                        value={role}
                        type={'select'}
                        error={errors.role}
                        onChangeEvent={(e) => {
                            setRole(e.target.value);
                            setErrors({ ...errors, role: '' });
                        }}
                        options={
                            [{
                                text: 'Wybierz rolę',
                                value: '',
                                disabled: false
                            }].concat(
                                ['Admin', 'User']
                                    .map(x => ({
                                        text: x,
                                        value: x,
                                        disabled: false
                                    })))}
                    />
                }

                <DefaultFormGroup
                    label={'Podaj imię'}
                    value={firstName}
                    error={errors.firstName}
                    onChangeEvent={(e) => {
                        setFirstName(e.target.value);
                        setErrors({ ...errors, firstName: '' });
                    }} />

                <DefaultFormGroup
                    label={'Podaj nazwisko'}
                    value={lastName}
                    error={errors.lastName}
                    onChangeEvent={(e) => {
                        setLastName(e.target.value);
                        setErrors({ ...errors, lastName: '' });
                    }} />

                <DefaultFormGroup
                    label={'Podaj hasło'}
                    type={'password'}
                    error={errors.password}
                    onChangeEvent={(e) => {
                        setPassword(e.target.value);
                        setErrors({ ...errors, password: '' });
                    }} />

                <DefaultFormGroup
                    label={'Powtórz hasło'}
                    type={'password'}
                    error={errors.passwordRepeat}
                    onChangeEvent={(e) => {
                        setPasswordRepeat(e.target.value);
                        setErrors({ ...errors, passwordRepeat: '' });
                    }} />
            </ModalBody>
            <ModalFooter>
                <Button className="btn btn-danger" onClick={close}>Anuluj</Button>
                <Button className="btn btn-success" onClick={submit}>{props.signingUp ? 'Zarejestruj' : 'Utwórz'}</Button>
            </ModalFooter>

        </Modal>
    );

}

export default ModalUser;