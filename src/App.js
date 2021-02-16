
import './App.css';
import React, { Component } from 'react';
import { Router, Route, Switch } from "react-router-dom";
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { createBrowserHistory } from 'history';
import store from './store/store';
import Layout from './layouts/index';

import Ex1 from './views/excercise1.js';
import Ex2 from './views/excercise2.js';
import Ex3 from './views/excercise3.js';

const history = createBrowserHistory();

function App() {
  return (
    <Provider store={store}>
        <Router history={history} exact path="/">
          <main className="h-100">
            <Switch>
              <Route exact={true} path="/Ex1" render={() => (
                <>
                  <Layout page={"Service Oriented Architecture & WebServices (Excercise:1)"}/>
                    <div className="main" >
                      <Ex1 />
                    </div>
                </>
              )}
              />
              <Route exact={true} path="/Ex2" render={() => (
                <>
                  <Layout page={"Service Oriented Architecture & WebServices (Excercise:2)"}/>
                    <div className="main" >
                      <Ex2 />
                    </div>
                </>
              )}
              />
              <Route exact={true} path="/" render={() => (
                <>
                  <Layout page={"Service Oriented Architecture & WebServices (Excercise:3)"}/>
                    <div className="main" >
                      <Ex3 />
                    </div>
                </>
              )}
              />

            </Switch>
            <ToastContainer />
          </main>
        </Router>
      </Provider>
  );
}

export default App;
