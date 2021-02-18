import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { ModalProps } from '../common/ModalProps';
import useModals from '../common/useModals';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from '../../store';
import { User, UserAction } from '../../store/User';
import DefaultFormGroup from '../common/DefaultFormGroup';
import useFetch from '../common/useFetch';
import { Project, ProjectAction } from '../../store/Project';
import { toast } from 'react-toastify';

interface ProjectUserErrors {
    userId: string;
}

interface ProjectUserProps {
    projectId: string;
    userId: string;
}

const ModalProjectUser: React.FunctionComponent<ModalProps & { projectId: string }> = (props) => {

    const users = useSelector<ApplicationState, User[]>(state => state.user.users);
    const project = useSelector<ApplicationState, Project>(state => state.project.scrumbanTableProject);

    const [userId, setUserId] = React.useState('');

    const [error, setError] = React.useState('');
    const [errors, setErrors] = React.useState({
        userId: ''
    } as ProjectUserErrors)

    const { hideModal } = useModals();

    const { getRequest, postRequest } = useFetch();

    const dispatch = useDispatch<React.Dispatch<ProjectAction | UserAction>>();

    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (users.length === 0 && !loading) {
            setLoading(true);
            getRequest({
                url: '/api/user/getusers',
                callback: async (res) => {
                    dispatch({
                        type: 'ADD_USERS',
                        users: await res.json()
                    });
                    setLoading(false);
                }
            })
        }
    })


    const close = () => {
        hideModal(props.id);
    }

    const submit = () => {
        postRequest({
            url: '/api/Project/AddUser',
            body: { projectId: props.projectId, userId: userId },
            callback: async (res) => {
                if (res.status == 200) {
                    res.json().then((user: User) => {
                        toast.success('Dodano użytkownika do projektu');
                        dispatch({
                            type: 'ADD_USER_TO_PROJECT',
                            user: {
                                id: user.id,
                                fullName: user.firstName + " " + user.lastName
                            }
                        });
                        close();
                    });
                }
                else {
                    setError('Something went wrong');
                }
            }
        })

    }

    return (<Modal isOpen={props.isOpen} toggle={close}>
        <ModalHeader>Add user to project</ModalHeader>
        <ModalBody>
            <DefaultFormGroup
                label={'Wybierz użytkownika'}
                value={userId}
                type={'select'}
                error={errors.userId}
                onChangeEvent={(e) => {
                    setUserId(e.target.value);
                    setErrors({ ...errors, userId: '' });
                }}
                options={
                    [{
                        text: 'Wybierz użytkownika',
                        value: '',
                        disabled: false
                    }].concat(
                        users
                            .filter(u => project.users === null || project.owner === null || u.id !== project.owner.id)
                            .filter(u => project.users === null || project.users.find(p => p.id === u.id) === undefined)
                            .map(x => ({
                                text: x.firstName + " " + x.lastName,
                                value: x.id,
                                disabled: false
                            })))}
            />
        </ModalBody>

        <ModalFooter>
            <Button className="btn btn-danger" onClick={close}>Anuluj</Button>
            <Button className="btn btn-success" onClick={submit}>Create</Button>
        </ModalFooter>

    </Modal>);

}

export default ModalProjectUser;