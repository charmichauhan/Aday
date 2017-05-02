import Root from './components/Root';
import Home from './components/Home';
import Calendar from './components/scheduling';

const routes = [
	{
		component: Root,
    	routes: [
			{
				path: '/',
		        exact: true,
				component: Home
			},
			{
				path: '/calendar',
		        exact: true,
				component: Calendar
			}
		]
	}
]


export default routes