import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { HashRouter, Route, Switch } from "react-router-dom";
import Layout from "./components/layout";
import SignIn from "./components/signin";
import MovingLine from "./components/movingLine";
import "fontsource-roboto";

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Switch>
        <Layout>
          <Route path="/:project/:crane_id/" component={MovingLine} />
        </Layout>
        <Route path="/signin" component={SignIn} />
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
