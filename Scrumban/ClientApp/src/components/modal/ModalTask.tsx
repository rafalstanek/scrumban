import * as React from 'react';
import { Modal, ModalHeader, ModalBody, Alert, ModalFooter, Button } from 'reactstrap';
import useModals from '../common/useModals';
import useFetch from '../common/useFetch';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { ProjectAction } from '../../store/Project';
import { toast } from 'react-toastify';
import { Task, TaskStatus } from '../../store/Task';
import DefaultFormGroup from '../common/DefaultFormGroup';
import { ModalProps } from '../common/ModalProps';

interface TaskErrors {
    name: string;
    projectId: string;
}

interface TaskProps {
    id: string;
    name: string;
}

const ModalTask: React.FunctionComponent<ModalProps & { task?: TaskProps }
    & { projectId: string; status: TaskStatus | undefined }> = (props) => {

        const update = props.task !== undefined;

        const { hideModal } = useModals();
        const { postRequest } = useFetch();

        const dispatch = useDispatch<Dispatch<ProjectAction>>();

        const [name, setName] = React.useState(props.task?.name || '');

        const [error, setError] = React.useState('');
        const [errors, setErrors] = React.useState({
            name: '',
            projectId: ''
        } as TaskErrors);

        const close = () => {
            hideModal(props.id);
        }

        const validate: () => boolean = () => {
            var result = true;
            var temp = errors;
            if (name === '') {
                temp = { ...temp, name: 'Name cannot be blank' };
                result = false;
            }
            setErrors(temp);
            return result;
        }

        const submit = () => {
            if (validate()) {
                postRequest({
                    url: update ? '/api/Task/Update' : '/api/Task/Create',
                    body: {
                        id: props.task?.id,
                        name,
                        project: {
                            id: props.projectId
                        },
                        status: props.status
                    },
                    callback: async (res) => {
                        if (res.status == 200) {
                            res.json().then((task: { id: string, name: string, status: TaskStatus }) => {
                                toast.success(update ? 'Task updated' : 'Task created');
                                dispatch({
                                    type: 'ADD_TASK',
                                    task
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
        }

        return (<Modal isOpen={props.isOpen} toggle={close}>
            <ModalHeader>Utwórz zadanie</ModalHeader>
            <ModalBody>
                {error &&
                    <Alert color="danger">
                        {error}
                    </Alert>
                }
                <DefaultFormGroup
                    label={'Podaj nazwę zadania'}
                    value={name}
                    error={errors.name}
                    onChangeEvent={(e) => {
                        setName(e.target.value);
                        setErrors({ ...errors, name: '' });
                    }} />

            </ModalBody>
            <ModalFooter>
                <Button className="btn btn-danger" onClick={close}>Anuluj</Button>
                <Button className="btn btn-success" onClick={submit}>Create</Button>
            </ModalFooter>
        </Modal>);

    }

export default ModalTask;