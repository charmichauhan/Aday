import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom'

import { renderRoutes } from 'react-router-config'

//import App from './App';

import routes from './routes.config.js'

import 'semantic-ui-css/semantic.min.css';
import './index.css';

ReactDOM.render(
  <Router>
    {renderRoutes(routes)}
  </Router>,
  document.getElementById('root')
);
