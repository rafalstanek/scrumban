import * as React from 'react';
import { Project, ProjectAction } from '../store/Project';
import { Container, Row, Col, Card, CardHeader, CardBody, ListGroup, ListGroupItem, CardFooter, Button } from 'reactstrap';
import { DragDropContext, Droppable, Draggable, DropReason, DropResult, ResponderProvided, DragStart, DraggableLocation } from 'react-beautiful-dnd';
import { Task, TaskStatus } from '../store/Task';
import useFetch from './common/useFetch';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from '../store';
import { Dispatch } from 'redux';
import useModals from './common/useModals';
import { type } from 'os';
import useLogin from './common/useLogin';

const ScrumbanTable: React.FunctionComponent = () => {
    const { postRequest } = useFetch();

    const { openModal } = useModals();
    const { user } = useLogin();

    const project = useSelector<ApplicationState, Project>(state => state.project.scrumbanTableProject);
    const projectLoaded = useSelector<ApplicationState, boolean>(state => state.project.tableLoaded);

    const [message, setMessage] = React.useState('');

    const dispatch = useDispatch<Dispatch<ProjectAction>>();

    var plannedMax = 8;
    var waitedMax = 4;
    var activeMax = 4;
    var testedMax = 3;

    const getProjectDetails: () => void = () => {
        postRequest({
            url: '/api/Project/GetDetails',
            body: project.id,
            callback: async (res) => {
                if (res.status == 200) {
                    res.json().then((project: Project) => {
                        dispatch({
                            type: 'UPDATE_TABLE',
                            project
                        });
                    });
                }
            }
        });
    }

    React.useEffect(() => {
        if (!projectLoaded) {
            getProjectDetails();
        }
    });

    var plannedTasks: Task[] = project
        .tasks
        .filter(t => t.status === 'Zaplanowane');
    var activeTasks: Task[] = project.tasks.filter(t => t.status === 'W trakcie');
    var testedTasks: Task[] = project.tasks.filter(t => t.status === 'Testy');
    var waitedTasks: Task[] = project.tasks.filter(t => t.status === 'Oczekujące');
    var finishedTasks: Task[] = project.tasks.filter(t => t.status === 'Ukończone');

    React.useEffect(() => {
        plannedTasks =
            project
                .tasks
                .filter(t => t.status === 'Zaplanowane');
        activeTasks = project.tasks.filter(t => t.status === 'W trakcie');
        finishedTasks = project.tasks.filter(t => t.status === 'Ukończone');
        testedTasks = project.tasks.filter(t => t.status === 'Testy');
        waitedTasks = project.tasks.filter(t => t.status === 'Oczekujące');
    }, [project]);


    const getDraggedElement: (source: DraggableLocation) => Task | undefined = (source) => {
        if (source.droppableId === 'droppable-0')
            return plannedTasks[source.index];

        if (source.droppableId === 'droppable-1')
            return waitedTasks[source.index];

        if (source.droppableId === 'droppable-2')
            return activeTasks[source.index];

        if (source.droppableId === 'droppable-3')
            return testedTasks[source.index];

        if (source.droppableId === 'droppable-4')
            return finishedTasks[source.index];

        return undefined;
    }

    const getRequestedStatus: (destId: string) => TaskStatus | undefined = (destId) => {
        if (destId === 'droppable-0')
            return 'Zaplanowane';

        if (destId === 'droppable-1')
            return 'Oczekujące';

        if (destId === 'droppable-2')
            return 'W trakcie';

        if (destId === 'droppable-3')
            return 'Testy';

        if (destId === 'droppable-4')
            return 'Ukończone';

        return undefined;
    }


    function getCurrentSize(name: TaskStatus) {
        switch (name) {
            case 'Zaplanowane':
                if (plannedTasks.length < plannedMax)
                    return true;
                break;
            case 'Oczekujące':
                if (waitedTasks.length < waitedMax)
                    return true;
                break;
            case 'W trakcie':
                if (activeTasks.length < activeMax)
                    return true;
                break;
            case 'Testy':
                if (testedTasks.length < testedMax)
                    return true;
                break;
            case 'Ukończone':
                return true;
            default:
                return false;
        }
    }

    const handleDelete: (user: { id: string, fullName: string }) => Promise<void> = (user) => postRequest({
        url: '/api/Project/DeleteUser',
        body: { userId: user.id, projectId: project.id },
        callback: (res) => {
            if (res.status === 200) {
                dispatch({
                    type: 'DELETE_USER_FROM_PROJECT',
                    user
                })
            }
        }
    });

    const selectTask: (task: Task) => Promise<void> = (task) => {
        if (task.user === undefined || task.user === null) {
            if (project.tasks.find(t => t.userId === user.id) === undefined) {
                return postRequest({
                    url: '/api/Task/Select',
                    body: {
                        id: task.id,
                        userId: user.id
                    },
                    callback: async (res) => {
                        if (res.status === 200) {
                            var d = await res.json();
                            console.log(d);
                            dispatch({
                                type: 'UPDATE_PROJECT_TASK',
                                task: d
                            })
                        }
                    }
                })
            }
        }
        else {
            if (task.user.id === user.id) {
                return postRequest({
                    url: '/api/Task/Deselect',
                    body: task.id,
                    callback: async (res) => {
                        if (res.status === 200) {
                            var d = await res.json();
                            dispatch({
                                type: 'UPDATE_PROJECT_TASK',
                                task: d
                            })
                        }
                    }
                })
            }
        }
        return new Promise<void>(() => ({}));
    }

    const sendMessage = () => {
        postRequest({
            url: '/api/Message/Send',
            body: {
                text: message,
                projectId: project.id,
                senderId: user.id
            },
            callback: async (res) => {
                if (res.status === 200) {
                    var d = await res.json();
                    dispatch({
                        type: 'ADD_MESSAGE',
                        message: d
                    })
                }
            }
        })
    }

    const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
        if (result.destination) {
            var task = getDraggedElement(result.source);
            if (task) {
                var status = getRequestedStatus(result.destination.droppableId);
                if (status) {
                    if (status !== task.status) {
                        if (getCurrentSize(status)) {
                            postRequest({
                                url: '/api/Task/Update',
                                body: {
                                    id: task.id,
                                    name: task.name,
                                    status: status
                                },
                                callback: async (res) => {
                                    if (res.status === 200) {
                                        res.json().then((task: { id: string; name: string; status: TaskStatus }) => {
                                            dispatch({
                                                type: 'UPDATE_TASK',
                                                task
                                            });
                                        })
                                    }
                                }
                            })
                        }
                    }
                }
            }
        }
    }

    return (
        <Row>
            <Col>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Container>
                        <Row>
                            <Col className="task-column">
                                <Droppable droppableId={'droppable-0'}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}>
                                            <Card>
                                                <CardHeader>
                                                    Nowe {plannedTasks.length}/{plannedMax}
                                                </CardHeader>
                                                <ListGroup>
                                                    {
                                                        plannedTasks
                                                            .map((t, i) => (
                                                                <Draggable draggableId={t.id}
                                                                    index={i} key={t.id}>
                                                                    {(provided) =>
                                                                        <div ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}>
                                                                            <ListGroupItem onClick={() => selectTask(t)}>
                                                                                {t.name} {t.user !== null && t.user !== undefined ? `(${t.user.fullName})` : ''}
                                                                            </ListGroupItem>
                                                                        </div>
                                                                    }
                                                                </Draggable>
                                                            ))
                                                    }
                                                </ListGroup>
                                                <CardFooter className="p-1">
                                                    <div className="text-center">
                                                        <Button className="btn btn-sm btn-primary" disabled={!getCurrentSize('Zaplanowane')} onClick={() => openModal({
                                                            type: "Task",
                                                            data: project.id,
                                                            status: 'Zaplanowane'
                                                        })}>Dodaj zadanie</Button>
                                                    </div>
                                                </CardFooter>
                                            </Card>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </Col>
                            <Col className="task-column">
                                <Droppable droppableId={'droppable-1'}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}>
                                            <Card>
                                                <CardHeader>
                                                    Oczekujące {waitedTasks.length}/{waitedMax}
                                                </CardHeader>
                                                <ListGroup>
                                                    {waitedTasks
                                                        .map((t, i) => (
                                                            <Draggable draggableId={t.id} index={i} key={t.id}>
                                                                {(provided) =>
                                                                    <div ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}>
                                                                        <ListGroupItem onClick={() => selectTask(t)}>
                                                                            { t.name } {t.user !== null && t.user !== undefined ? `(${t.user.fullName})` : ''}
                                                                        </ListGroupItem>
                                                                    </div>
                                                                }
                                                            </Draggable>
                                                        ))
                                                    }
                                                </ListGroup>
                                                <CardFooter className="p-1">
                                                    <div className="text-center">
                                                        <Button className="btn btn-sm btn-primary" disabled={!getCurrentSize('Oczekujące')} onClick={() => openModal({
                                                            type: "Task",
                                                            data: project.id,
                                                            status: 'Oczekujące'
                                                        })}>Dodaj zadanie</Button>
                                                    </div>
                                                </CardFooter>
                                            </Card>
                                            {provided.placeholder}
                                        </div>)}
                                </Droppable>
                            </Col>
                            <Col className="task-column">
                                <Droppable droppableId={'droppable-2'}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}>
                                            <Card>
                                                <CardHeader>
                                                    W trakcie {activeTasks.length}/{activeMax}
                                                </CardHeader>
                                                <ListGroup>
                                                    {activeTasks
                                                        .map((t, i) => (
                                                            <Draggable draggableId={t.id} index={i} key={t.id}>
                                                                {(provided) =>
                                                                    <div ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}>
                                                                        <ListGroupItem onClick={() => selectTask(t)}>
                                                                            {t.name} {t.user !== null && t.user !== undefined ? `(${t.user.fullName})` : ''}
                                                                        </ListGroupItem>
                                                                    </div>
                                                                }
                                                            </Draggable>
                                                        ))
                                                    }
                                                </ListGroup>
                                                <CardFooter className="p-1">
                                                    <div className="text-center">
                                                        <Button className="btn btn-sm btn-primary" disabled={!getCurrentSize('W trakcie')} onClick={() => openModal({
                                                            type: "Task",
                                                            data: project.id,
                                                            status: 'W trakcie'
                                                        })}>Dodaj zadanie</Button>
                                                    </div>
                                                </CardFooter>
                                            </Card>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </Col>
                            <Col className="task-column">
                                <Droppable droppableId={'droppable-3'}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}>
                                            <Card>
                                                <CardHeader>
                                                    Testy {testedTasks.length}/{testedMax}
                                                </CardHeader>
                                                <ListGroup>
                                                    {testedTasks
                                                        .map((t, i) => (
                                                            <Draggable draggableId={t.id} index={i} key={t.id}>
                                                                {(provided) =>
                                                                    <div ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}>
                                                                        <ListGroupItem onClick={() => selectTask(t)}>
                                                                            {t.name} {t.user !== null && t.user !== undefined ? `(${t.user.fullName})` : ''}
                                                                        </ListGroupItem>
                                                                    </div>
                                                                }
                                                            </Draggable>
                                                        ))
                                                    }
                                                </ListGroup>
                                                <CardFooter className="p-1">
                                                    <div className="text-center">
                                                        <Button className="btn btn-sm btn-primary" disabled={!getCurrentSize('Testy')} onClick={() => openModal({
                                                            type: "Task",
                                                            data: project.id,
                                                            status: 'Testy'
                                                        })}>Dodaj zadanie</Button>
                                                    </div>
                                                </CardFooter>
                                            </Card>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </Col>
                            <Col className="task-column">
                                <Droppable droppableId={'droppable-4'}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}>
                                            <Card>
                                                <CardHeader>
                                                    Ukończone
                                                 </CardHeader>
                                                <ListGroup>
                                                    {finishedTasks
                                                        .map((t, i) => (
                                                            <Draggable draggableId={t.id} index={i} key={t.id}>
                                                                {(provided) =>
                                                                    <div ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}>
                                                                        <ListGroupItem onClick={() => selectTask(t)}>
                                                                            {t.name} {t.user !== null && t.user !== undefined ? `(${t.user.fullName})` : ''}
                                                                        </ListGroupItem>
                                                                    </div>
                                                                }
                                                            </Draggable>
                                                        ))
                                                    }
                                                </ListGroup>
                                                <CardFooter className="p-1">
                                                    <div className="text-center">
                                                        <Button className="btn btn-sm btn-primary" disabled={!getCurrentSize('Ukończone')} onClick={() => openModal({
                                                            type: "Task",
                                                            data: project.id,
                                                            status: 'Ukończone'
                                                        })}>Dodaj zadanie</Button>
                                                    </div>
                                                </CardFooter>
                                            </Card>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </Col>
                        </Row>
                    </Container>
                </DragDropContext>
            </Col>
            <Col className="col-md-3 task-column">
                <Card>
                    <CardHeader>
                        Użytkownicy
                    </CardHeader>
                    <ListGroup>
                        {
                            project.users && project.users
                                .map(u => <ListGroupItem>{u.fullName} {user.id === project.owner.id && u.id !==user.id && <Button className="btn btn-danger btn-sm"
                                    onClick={() => openModal(
                                        {
                                            type: 'Delete',
                                            bodyText: 'Czy na pewno chcesz usunąć tego użytkownika z projektu?',
                                            headerText: 'Usuwanie z projektu',
                                            onConfirm: () => handleDelete(u)
                                        })}
                                >Usuń</Button>}</ListGroupItem>)
                        }
                    </ListGroup>
                    <CardFooter className="p-1">
                        {user.id === project.owner.id &&
                            <div className="text-center">
                                <Button className="btn btn-sm btn-primary" disabled={!getCurrentSize('Testy')}
                                    onClick={() => openModal({
                                        type: 'ProjectUser',
                                        data: project.id,
                                    })
                                    }
                                >Dodaj użytkownika</Button>
                            </div>
                        }
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        Wiadomości
                    </CardHeader>

                    <CardBody>
                        {project.messages.map(m => <div>
                            <div className="msg-date">{m.sendDateTime}</div>
                            <div className="msg-sender">{m.sender.fullName}</div>
                            <div className="msg-text">{m.text}</div>
                            <hr />
                        </div>)}
                    </CardBody>
                    <CardFooter>
                        <input type="text" onChange={(e) => setMessage(e.target.value)} />
                        <div className="text-center">
                            <Button onClick={() => sendMessage()} >Wyślij</Button>
                        </div>
                    </CardFooter>
                </Card>


            </Col>

        </Row>
    );


}

export default ScrumbanTable;