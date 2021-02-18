import { useSelector } from 'react-redux';
import { ApplicationState } from '../../store';

export interface RequestProps {
    url: string;
    body?: any;
    callback: (response: Response) => void | Promise<void>;
}

type Request = (props: RequestProps) => Promise<void>;

export default function useFetch(): { postRequest: Request, getRequest: Request } {

    const jwtToken = useSelector<ApplicationState, string>(state => state.appUser.user.token);

    const postRequest = (props: RequestProps) =>
        fetch(props.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(props.body)
        }).then(res => props.callback(res));

    const getRequest = (props: RequestProps) =>
        fetch(props.url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        }).then(res => props.callback(res));

    return { postRequest, getRequest };

}