import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState } from '../../store';
import { AppUser } from '../../store/AppUser';
import useFetch from './useFetch';

type UserRole =
    'Guest' | 'User' | 'Planner' | 'Admin';

export default function useLogin(): { loggedIn: boolean, userRole: UserRole, user: AppUser } {

    const appUser = useSelector<ApplicationState, AppUser>(state => state.appUser.user);
    const loggedIn = appUser.token !== '';
    const userRole = appUser.role;

    const dispatch = useDispatch();

    const { postRequest } = useFetch();

    React.useEffect(() => {
        if (!loggedIn) {
            var token = localStorage.getItem('token');
            if (token !== null) {
                postRequest({
                    url: '/api/user/ValidateToken',
                    body: token,
                    callback: async (res) => {
                        if (res.status === 200) {
                            res.json().then((user: AppUser) => {
                                localStorage.setItem('token', user.token);
                                dispatch({
                                    type: 'SET_APP_USER',
                                    user: user
                                });
                            })
                        }
                    }
                })
            }
        }
    });

    return { loggedIn, userRole, user: appUser };
}