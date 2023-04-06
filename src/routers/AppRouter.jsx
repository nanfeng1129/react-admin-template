import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
// import { LayoutError404 as Error404, AdminLayout as Layout, SubApp } from '../components';
// import routes from './routes';
import Layout from '../modules/Layout/Index';
import Login from '../modules/Login/Login';
import { withRouter } from 'react-router-dom';
// import { routes } from './index';

const Router = BrowserRouter;
const AppRouter = () => {
  const isLogin = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : ''

  return (
    <Router>
      <Switch>
        <Route exact path='/login' render={(props) => {
          if (isLogin) {
            return <Redirect to='/'/>
          } else {
            return <Login {...props}/>
          }
        }}/>
        <Route path='/' render={(props) => {
          if (!isLogin) {
            return <Redirect to='/login'/>
          } else {
            return <Layout {...props}/>
          }
        }}/>
      </Switch>
    </Router>
  );
}

export default withRouter(AppRouter)
