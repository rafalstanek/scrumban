import * as React from 'react';
import { useTable, Column } from 'react-table';
import { AppUser } from '../../store/AppUser';
import { User } from '../../store/User';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from '../../store';
import { Button } from 'reactstrap';
import useModals from '../common/useModals';
import { toast } from 'react-toastify';
import { UserAction } from '../../store/User';
import { Dispatch } from 'redux';
import useFetch from '../common/useFetch';

const UserTable: React.FunctionComponent = () => {
    const users = useSelector<ApplicationState, User[]>(state => state.user.users);
    const appUser = useSelector<ApplicationState, AppUser>(state => state.appUser.user);

    const [loading, setLoading] = React.useState(false);

    const { openModal } = useModals();

    const { postRequest, getRequest } = useFetch();

    const dispatch = useDispatch<Dispatch<UserAction>>();

    const handleDelete: (user: User) => Promise<void> = (user) => postRequest({
        url: '/api/user/Delete',
        body: user.id,
        callback: (res) => {
            if (res.status === 200) {
                toast.success('Deleted a user');
                dispatch({
                    type: 'DELETE_USER',
                    user
                })
            }
        }
    });

    const columns: Column<User>[] = [
        {
            Header: 'Id',
            id: 'id',
            accessor: (row) => row.id
        },
        {
            Header: 'Username',
            id: 'username',
            accessor: (row) => row.username
        },
        {
            Header: 'First name',
            id: 'firstName',
            accessor: (row) => row.firstName
        },
        {
            Header: 'Last name',
            id: 'lastName',
            accessor: (row) => row.lastName
        },
        {
            Header: 'Role',
            id: 'role',
            accessor: (row) => row.role
        },
        {
            Header: '',
            id: 'buttons',
            Cell: (props) => (<div>
                <Button
                    size="sm"
                    className="btn btn-primary"
                    onClick={() => openModal({ type: 'User', data: props.row.original })}>
                    Edycja
                    </Button>
                <Button
                    size="sm"
                    className="btn btn-danger"
                    onClick={() => openModal({
                        type: 'Delete', data: props.row.original,
                        headerText: 'Usuń użytkownika',
                        bodyText: 'Czy na pewno chcesz usunąć tego użytkownika?',
                        onConfirm: () => handleDelete(props.row.original)
                    })}>
                    Usuń
                    </Button>

            </div>)
        }
    ];

    React.useEffect(() => {
        if (appUser.role === 'Admin' && users.length === 0 && !loading) {
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

    const { getTableProps, headerGroups, getTableBodyProps,
        rows, prepareRow } = useTable({
            columns,
            data: users,
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
                type: 'User',
            })}>Dodaj</Button>
    </div>
    );

}

export default UserTable;