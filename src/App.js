
import './App.css';
import React, { Component } from 'react';
import { Router, Route, Switch } from "react-router-dom";
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { createBrowserHistory } from 'history';
import store from './store/store';
import Layout from './layouts/index';

import Question from './views/questions.js';

const history = createBrowserHistory();

function App() {
  return (
    <Provider store={store}>
        <Router history={history} exact path="/">
          <main className="h-100">
            <Switch>
              <Route exact={true} path="/" render={() => (
                <>
                  <Layout page={"Service Oriented Architecture & WebServices"}/>
                  <div className="main" >
                    <Question />
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
