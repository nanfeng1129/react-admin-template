import './App.less';
import { Button, Spin } from 'antd'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { LoadingOutlined, CloseCircleOutlined } from '@ant-design/icons'
import AppRouter from './routers/AppRouter';
import { AliveScope } from 'react-activation'
const App = (props) => {

  const { loading } = props

  const antIcon = (
    <div>
      <LoadingOutlined />
      <CloseCircleOutlined />
    </div>
  );

  return (
    <Spin
      spinning={loading ? true : false}
      size="large"
      indicator={antIcon}
    >
      <BrowserRouter>
        <AliveScope>
          <Switch>
            <Route path='/' component={AppRouter}/>
          </Switch>
        </AliveScope>
      </BrowserRouter>
    </Spin>
  );
}

let mapStateToProps = state => ({ loading: state.commReducers.loading });
let mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
