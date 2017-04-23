import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Route } from 'react-router-dom'

//import App from './App';
import Home from './components/Home';

import 'semantic-ui-css/semantic.min.css';
import './index.css';

ReactDOM.render(
  <BrowserRouter>
  	<Route exact path="/" component={Home} />
  </BrowserRouter>,
  document.getElementById('root')
);
