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

// production: https://20170808t142850-dot-forward-chess-157313.appspot.com/graphql
// dev: https://forward-chess-157313.appspot.com/graphql
const networkInterface =  createNetworkInterface({ uri: 'https://forward-chess-157313.appspot.com/graphql' });

networkInterface.use([{
   applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }
    // get the authentication token from local storage if it exists
    let token = decodeURIComponent(document.cookie)
    token = token.split("token=")[1]
    if(token) {
      token = token.split(';')[0]
      req.options.headers.authorization = `Bearer ${token}`;
    } else {
       req.options.headers = {};
    }

      next();
  }
}]);

export const client = new ApolloClient({
   networkInterface
});

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
