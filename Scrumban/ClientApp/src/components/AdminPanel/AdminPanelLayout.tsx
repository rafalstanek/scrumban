import * as React from 'react';

import { Route } from 'react-router';
import UserTable from './UserTable';
import AdminIndex from './AdminIndex';
import ProjectTable from './ProjectTable';

const AdminPanelLayout: React.FunctionComponent = () =>
    <AdminIndex>
        <Route path="/admin-panel/users" component={UserTable} />
        <Route path="/admin-panel/projects" component={ProjectTable} />
    </AdminIndex>;

export default AdminPanelLayout;