import React, { Suspense } from "react";
import { routes } from "../../../routers";
import { Route, Switch } from 'react-router-dom';
import KeepAlive from "react-activation";


const Content = () => {


  return (
    <Suspense fallback={<div></div>}>
      <Switch>
        {
          routes.map(item => (
            <Route
              exact
              key={item.key}
              path={item.key}
              render={ 
                (props) => {
                  return (
                    <KeepAlive name={item.key}>
                      <Route {...props}>
                        <item.component/>
                      </Route>
                    </KeepAlive>
                  )
                }
              }
            />
            // <Route exact path={item.key} component={item.component} key={item.key}/>
          ))
        }
      </Switch>
    </Suspense>
  )
}

export default Content