import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
 import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { renderRoutes } from 'react-router-config';

//import App from './App';

import routes from './routes.config.js'

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'semantic-ui-css/semantic.min.css';
import './index.css';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


const client = new ApolloClient({
   networkInterface: createNetworkInterface({ uri: 'https://forward-chess-157313.appspot.com/graphql'}),
})



ReactDOM.render(
  <MuiThemeProvider>
	<ApolloProvider client={client}>
	  <Router>
	    {renderRoutes(routes)}
	  </Router>
     </ApolloProvider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
