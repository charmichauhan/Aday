import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { renderRoutes } from 'react-router-config';

//import App from './App';

import routes from './routes.config.js'

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'semantic-ui-css/semantic.min.css';
import './index.css';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

ReactDOM.render(
	<MuiThemeProvider>
		<Router>
            {renderRoutes(routes)}
		</Router>
	</MuiThemeProvider>,
    document.getElementById('root')
);
