import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from '../store';
import { Button, Row, Card, CardBody, CardText, Col, CardHeader, Table } from 'reactstrap';
import useLogin from './common/useLogin';
import useModals from './common/useModals';
import { Project } from '../store/Project';
import useFetch from './common/useFetch';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';

const Home: React.FunctionComponent = () => {
    const projects = useSelector<ApplicationState, Project[]>(state => state.project.userProjects);
    const { openModal } = useModals();

    const dispatch = useDispatch();
    const { getRequest, postRequest } = useFetch();

    const { loggedIn, user } = useLogin();

    const logout = () => {
        localStorage.removeItem('token');
        dispatch({
            type: 'RESET_APP_USER'
        });
        setProjectsLoaded(false);
    }

    const history = useHistory();

    const handleDelete: (project: Project) => Promise<void> = (project) => postRequest({
        url: '/api/Project/Delete',
        body: project.id,
        callback: (res) => {
            if (res.status === 200) {
                toast.success('Usunięto projekt');
                dispatch({
                    type: 'DELETE_USER_PROJECT',
                    project
                })
            }
        }
    });

    const [projectsLoading, setProjectsLoading] = React.useState(false);
    const [projectsLoaded, setProjectsLoaded] = React.useState(false);


    React.useEffect(() => {
        if (loggedIn) {
            if (!projectsLoaded && !projectsLoading) {
                setProjectsLoading(true);
                getRequest({
                    url: '/api/Project/GetOwnedProjects',
                    callback: async (res) => {
                        if (res.status === 200) {
                            res.json().then((projects: Project[]) => {
                                dispatch({
                                    type: 'ADD_USER_PROJECTS',
                                    projects
                                });
                                setProjectsLoaded(true);
                            })
                        }
                        setProjectsLoading(false);
                    }
                })
            }
        }
    });

    return loggedIn
        ? <Row>
            <Col md="3">
                <Card className="text-center">
                    <CardBody>
                        <h5>Witaj, {user.username}</h5>
                        <hr />
                        <Button className="btn btn-primary" onClick={logout}>Wyloguj się</Button>
                    </CardBody>
                </Card>
            </Col>

            <Col>
                <Card>
                    <CardBody>
                        <h2 className="ml-2">Twoje projekty</h2>

                        <table className="table mt-3">
                            <thead>
                                <tr>
                                    <td>Nazwa</td>
                                    <td>Status</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    projects.map((p, i) => (<tr key={i}>
                                        <td>{p.name}</td>
                                        <td>{p.finished ? 'Ukończony' : 'Nieukończony'}</td>
                                        <td>
                                            <Button className="btn btn-info"
                                                onClick={() => {
                                                    dispatch({
                                                        type: 'UNLOAD_TABLE',
                                                        projectId: p.id
                                                    });
                                                    history.push("/table")
                                                }
                                                }
                                            >Tablica</Button>
                                            {
                                                p.owner.id === user.id &&
                                                <Button className="btn btn-danger ml-2"
                                                    onClick={() => openModal({
                                                        type: 'Delete',
                                                        bodyText: 'Czy na pewno chcesz usunąć ten projekt?',
                                                        headerText: 'Usuwanie projektu',
                                                        onConfirm: () => handleDelete(p)
                                                    })}
                                                >Usun</Button>
                                            }
                                        </td>
                                    </tr>))
                                }
                            </tbody>
                        </table>

                        <div className="text-center">
                            <Button
                                onClick={() => openModal({
                                    type: 'Project',
                                    signingUp: true
                                })}
                                className="btn btn-primary">Utwórz projekt</Button>
                        </div>
                    </CardBody>
                </Card>
            </Col>

        </Row>

        : <Row><Col></Col>
            <Col>
                <Card className="text-center">
                    <CardBody>
                        <CardText>
                            Nie jesteś zalogowany
                        </CardText>
                        <Button block onClick={() => openModal({ type: 'Login' })} className="btn btn-primary">Zaloguj się</Button>
                        <Button block onClick={() => openModal({ type: 'User', signingUp: true })} className="btn btn-primary">Zarejestruj się</Button>
                    </CardBody>
                </Card>
            </Col>
            <Col></Col></Row>;
};


export default Home;
