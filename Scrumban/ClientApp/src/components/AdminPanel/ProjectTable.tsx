import * as React from 'react';
import { Column, useTable } from 'react-table';
import { Project, ProjectAction } from '../../store/Project';
import useModals from '../common/useModals';
import { Button } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from '../../store';
import useFetch from '../common/useFetch';
import { Dispatch } from 'redux';
import { toast } from 'react-toastify';

const ProjectTable: React.FunctionComponent = () => {
    const projects = useSelector<ApplicationState, Project[]>(state => state.project.projects);

    const { openModal } = useModals();

    const { getRequest, postRequest } = useFetch();
    const dispatch = useDispatch<Dispatch<ProjectAction>>();

    const [loading, setLoading] = React.useState(false);

    const handleDelete: (project: Project) => Promise<void> = (project) => postRequest({
        url: '/api/Project/Delete',
        body: project.id,
        callback: (res) => {
            if (res.status === 200) {
                toast.success('Project deleted');
                dispatch({
                    type: 'DELETE_PROJECT',
                    project
                })
            }
        }
    });

    const columns: Column<Project>[] = [
        {
            Header: 'Id',
            id: 'id',
            accessor: (row) => row.id
        },
        {
            Header: 'Name',
            id: 'name',
            accessor: (row) => row.name
        },
        {
            Header: 'Finished',
            id: 'finished',
            accessor: (row) => (row.finished ? 'Tak' : 'Nie')
        },
        {
            Header: '',
            id: 'buttons',
            Cell: (props) => (<div>
                <Button
                    size="sm"
                    className="btn btn-primary"
                    onClick={() => openModal({ type: 'Project', data: props.row.original })}>
                    Edycja
                    </Button>
                <Button
                    size="sm"
                    className="btn btn-danger"
                    onClick={() => openModal({
                        type: 'Delete', data: props.row.original,
                        headerText: 'Usuń projekt',
                        bodyText: 'Czy na pewno chcesz usunąć ten projekt?',
                        onConfirm: () => handleDelete(props.row.original)
                    })}>
                    Usuń
                    </Button>

            </div>)
        }
    ];

    const [projectsLoaded, setProjectsLoaded] = React.useState(false);

    React.useEffect(() => {
        if (!projectsLoaded && !loading) {
            setLoading(true);
            getRequest({
                url: '/api/Project/GetProjects',
                callback: async (res) => {
                    dispatch({
                        type: 'ADD_PROJECTS',
                        projects: await res.json()
                    });
                    setLoading(false);
                    setProjectsLoaded(true);
                }
            })
        }
    })

    const { getTableProps, headerGroups, getTableBodyProps,
        rows, prepareRow } = useTable({
            columns,
            data: projects,
            initialState: {
                hiddenColumns: ['id']
            }
        });

    return (<div>
        <table {...getTableProps()} className="table table-striped table-hover">
            <thead className="thead-dark">
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(
                    (row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    }
                )}
            </tbody>
        </table>
        <Button className="btn btn-success"
            onClick={() => openModal({
                type: 'Project',
            })}>Dodaj</Button>
    </div>);

}

export default ProjectTable;