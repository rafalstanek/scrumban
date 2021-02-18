import * as React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';

const AdminPanelNav: React.FunctionComponent = () =>
    <Nav vertical>
        <NavItem>
            <NavLink
                tag={Link}
                to="/admin-panel/users">
                Users
                </NavLink>
            <NavLink
                tag={Link}
                to="/admin-panel/projects">
                Projects
            </NavLink>
        </NavItem>
    </Nav>;

export default withRouter(AdminPanelNav);