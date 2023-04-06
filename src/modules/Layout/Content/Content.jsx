import React, { Suspense } from "react";
import { routes } from "../../../routers";
import { Route, Switch } from 'react-router-dom';


const Content = () => {


  return (
    <Suspense fallback={<div></div>}>
      <Switch>
        {
          routes.map(item => (
            <Route exact path={item.key} component={item.component} key={item.key}/>
          ))
        }
      </Switch>
    </Suspense>
  )
}

export default Content