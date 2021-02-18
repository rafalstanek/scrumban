import * as React from 'react';
import AdminPanelNav from './AdminPanelNav';
import useLogin from '../common/useLogin';
import { Row, Col, Container } from 'reactstrap';

const AdminIndex: React.FunctionComponent = (props) => {

    const { userRole } = useLogin();

    return (userRole === 'Admin'
        ? <Row>
            <Col sm="2" md="2" lg="2" className="p-0">
                <AdminPanelNav />
            </Col>
            <Col sm="10" md="10" lg="10">
                <Container fluid>{props.children}</Container>
            </Col>
        </Row>
        : <div></div>);

}

export default AdminIndex;