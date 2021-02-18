import * as React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';

const Layout: React.FunctionComponent = (props: { children?: React.ReactNode }) =>
    <React.Fragment>
        <NavMenu />
        <Container>
            {props.children}
        </Container>
    </React.Fragment>;

export default Layout;
