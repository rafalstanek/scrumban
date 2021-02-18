import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './custom.css'
import AdminPanelLayout from './components/AdminPanel/AdminPanelLayout';
import ModalContainer from './components/modal/ModalContainer';
import ScrumbanTable from './components/ScrumbanTable';

const App: React.FunctionComponent = () =>
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/table' component={ScrumbanTable} />
        <Route path='/admin-panel' component={AdminPanelLayout} />
        <ModalContainer />
        <ToastContainer autoClose={2000} />
    </Layout>;

export default App;