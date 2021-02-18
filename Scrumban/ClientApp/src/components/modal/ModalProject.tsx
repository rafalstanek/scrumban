import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert } from 'reactstrap';
import { ModalProps } from '../common/ModalProps';
import useModals from '../common/useModals';
import DefaultFormGroup from '../common/DefaultFormGroup';
import useFetch from '../common/useFetch';
import { Project, ProjectAction } from '../../store/Project';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

interface ProjectErrors {
    name: string;
    finished: string;
}

interface ProjectProps {
    id: string;
    name: string;
    finished: string;
}

const ModalProject: React.FunctionComponent<ModalProps
    & { userCreating: boolean }
    & { project?: ProjectProps }> = (props) => {

    const update = props.project !== undefined;

    const { hideModal } = useModals();
    const { postRequest } = useFetch();

    const dispatch = useDispatch<Dispatch<ProjectAction>>();

    const [name, setName] = React.useState(props.project?.name || '');
    const [finished, setFinished] = React.useState((props.project?.finished ? 'true' : 'false') || '');

    const [error, setError] = React.useState('');
    const [errors, setErrors] = React.useState({
        name: '',
        finished: ''
    } as ProjectErrors);

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
        if (!props.userCreating) {
            if (finished === '') {
                temp = { ...temp, finished: 'You must choose if the project is finished' };
                result = false;
            }
        }
        setErrors(temp);
        return result;
    }

    const submit = () => {
        if (validate()) {
            if (props.userCreating) {
                setFinished('false');
            }
            postRequest({
                url: update ? '/api/Project/Update' : '/api/Project/Create',
                body: { id: props.project?.id, name, finished: finished === 'true' },
                callback: async (res) => {
                    if (res.status == 200) {
                        res.json().then((project: Project) => {
                            toast.success(update ? 'Project updated' : 'Project created');
                            if (!props.userCreating) {
                                dispatch({
                                    type: (update ? 'UPDATE_PROJECT' : 'ADD_PROJECT'),
                                    project
                                });
                            }
                            else {
                                dispatch({
                                    type: 'ADD_USER_PROJECT',
                                    project
                                });
                            }

                            close();
                        });
                    }
                    else {
                        setError('Something went wrong');
                        res.json().then(er => setErrors({ ...errors, name: er.name[0] }));
                    }
                }
            })
        }
    }

    return (<Modal isOpen={props.isOpen} toggle={close}>
        <ModalHeader>Create project</ModalHeader>
        <ModalBody>
            {error &&
                <Alert color="danger">
                    {error}
                </Alert>
            }
            <DefaultFormGroup
                label={'Podaj nazwę projektu'}
                value={name}
                error={errors.name}
                onChangeEvent={(e) => {
                    setName(e.target.value);
                    setErrors({ ...errors, name: '' });
                }} />
            {!props.userCreating &&
                <DefaultFormGroup
                    label={'Finished'}
                    value={finished}
                    type={'select'}
                    error={errors.finished}
                    options={
                        [{
                            text: 'Select value',
                            value: '',
                            disabled: false
                        }].concat(
                            [{ text: 'No', val: 'false' }, { text: 'Yes', val: 'true' }]
                                .map(x => ({
                                    text: x.text,
                                    value: x.val,
                                    disabled: false
                                })))}
                    onChangeEvent={(e) => {
                        setFinished(e.target.value);
                        setErrors({ ...errors, finished: '' });
                    }} />
            }

        </ModalBody>
        <ModalFooter>
            <Button className="btn btn-danger" onClick={close}>Anuluj</Button>
            <Button className="btn btn-success" onClick={submit}>Create</Button>
        </ModalFooter>
    </Modal>);

}

export default ModalProject;