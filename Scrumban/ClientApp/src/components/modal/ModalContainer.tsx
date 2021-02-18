import * as React from 'react';
import useModals from '../common/useModals';
import ModalUser from './ModalUser';
import ModalConfirm from './ModalConfirm';
import ModalLogin from './ModalLogin';
import ModalProject from './ModalProject';
import ModalTask from './ModalTask';
import ModalProjectUser from './ModalProjectUser';

const ModalContainer: React.FunctionComponent = () => {
    const { modals } = useModals();

    return <div> {
        modals.map((m, i) => {
            switch (m.type) {
                case 'User':
                    return <ModalUser key={i} isOpen={true} id={m.id || ''} user={m.data}
                        signingUp={m.signingUp || false} />;
                case 'Delete':
                    return <ModalConfirm key={i} isOpen={true} id={m.id || ''}
                        user={m.data} headerText={m.headerText!}
                        bodyText={m.bodyText!} onConfirm={m.onConfirm!} />
                case 'Login':
                    return <ModalLogin key={i} isOpen={true} id={m.id || ''} />
                case 'Project':
                    return <ModalProject key={i} isOpen={true} id={m.id || ''} project={m.data} userCreating={m.signingUp !== undefined ? m.signingUp : false} />
                case 'Task':
                    return <ModalTask key={i} isOpen={true} id={m.id || ''} projectId={m.data} status={m.status} />
                case 'ProjectUser':
                    return <ModalProjectUser key={i} isOpen={true} id={m.id || ''} projectId={m.data} />
                default:
                    return <div></div>;
            }
        })}
    </div>;
}

export default ModalContainer;